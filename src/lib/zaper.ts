import type { Lead } from "./leads";

/**
 * Cliente da API do Zaper (o CRM do cliente, painel `app.zaperchat.com`).
 *
 * Substitui o webhook do Make que fazia esse trabalho até 09/2026. O Make caiu
 * junto com a conta de e-mail que o hospedava, e a conclusão ao remontar foi
 * que o intermediário não pagava o próprio custo: o app pronto do wts.chat só
 * criava o contato, e o card no painel exigiria requisição HTTP escrita à mão
 * de qualquer jeito. Aqui as duas coisas acontecem no mesmo lugar, sem conta de
 * terceiro no caminho e sem URL de webhook para rodar em seis projetos.
 *
 * **A superfície do token permanente não é a mesma que o painel usa.** O front
 * do Zaper é um Angular que fala com a API interna; o token de "Integração via
 * API" enxerga um subconjunto, e as diferenças não são óbvias:
 *
 * - escrita é sempre `POST` — `PUT` responde 404 em todas as rotas, embora o
 *   painel use `PUT` para salvar contato;
 * - sub-recurso de painel não existe para o token (`/panel/{id}/step`,
 *   `/panel/step/{id}/card`, `/panel/card/filter` dão 404). O card entra por
 *   `POST /crm/v1/panel/card`, com `panelId` e `stepId` no corpo;
 * - o token não apaga nada (403 em contato, 404 em card).
 *
 * Nada disso está documentado publicamente: foi levantado do bundle do painel e
 * confirmado contra a conta real em 10/09/2026.
 */

const BASE = process.env.ZAPER_API_URL ?? "https://api.app.zaperchat.com";

/**
 * Painel "Leads de anúncios" e a etapa de entrada dele.
 *
 * Ficam como padrão no código, e não como variável obrigatória, porque não são
 * segredo — são identificadores de um painel que já existe. Só o token é
 * segredo, e é a única variável que precisa estar configurada para a
 * integração funcionar. As duas abaixo existem como variável para o dia em que
 * o cliente trocar de painel sem querer um deploy.
 */
const PAINEL = process.env.ZAPER_PANEL_ID ?? "c2dac151-acfb-426a-a5ca-e509400a60ed";
const ETAPA_NOVO_LEAD =
  process.env.ZAPER_STEP_ID ?? "fa8c9d20-c9c2-457c-808b-ac2eec4325b6";

/*
 * Os custom fields `segmento` e `nome-loja` **não são preenchidos**, e não é
 * por esquecimento.
 *
 * O cenário do Make gravava os dois, e a intenção era repetir isso aqui. Não
 * dá com este token: as rotas de valor de custom field respondem 405
 * ("Acesso negado") ou 404, e mandar os valores junto na criação do contato é
 * **aceito com 200 e descartado** — o eco da resposta vem preenchido, e o
 * contato relido vem vazio. Foi assim que a primeira versão deste arquivo
 * passou por boa: eu conferi o eco, não o contato.
 *
 * O dado não se perde: `publico` e `qualificacao` estão na anotação do contato
 * e na descrição do card, que é onde o comercial lê. Se um dia o token ganhar
 * permissão de custom field, o lugar de voltar a gravar é `criarContato`.
 */

/** Tempo máximo por chamada. São três em série; o total cabe folgado na função. */
const TIMEOUT_MS = 8000;

type ContatoZaper = {
  id: string;
  name?: string | null;
  phoneNumber?: string | null;
  phoneNumberFormatted?: string | null;
  tagIds?: string[] | null;
  tagNames?: string[] | null;
};

type EtiquetaZaper = { id: string; name?: string | null };

type Pagina<T> = { items?: T[] | null; totalItems?: number };

/** Resultado do registro, para quem chama poder logar o que de fato aconteceu. */
export type ResultadoZaper = {
  contatoId: string;
  cardId: string | null;
  /** true quando o contato já existia e foi reaproveitado em vez de recriado */
  contatoReaproveitado: boolean;
  /** nome da etiqueta aplicada, ou null quando a origem não tem etiqueta */
  etiqueta: string | null;
};

/**
 * Chamada crua à API, já com autenticação e timeout.
 *
 * Lança em qualquer resposta que não seja 2xx, com o corpo no texto do erro —
 * os erros do Zaper vêm em formatos diferentes conforme a camada que recusou
 * (`badrequest` em texto puro do API Gateway, ProblemDetails do ASP.NET, ou um
 * objeto próprio com `key`/`text`), então guardar o corpo cru é mais útil do
 * que tentar interpretá-lo.
 */
async function chamar<T>(
  caminho: string,
  init: { method: "GET" | "POST"; corpo?: unknown },
): Promise<T> {
  const token = process.env.ZAPER_API_TOKEN;
  if (!token) throw new Error("ZAPER_API_TOKEN não configurada");

  const resposta = await fetch(`${BASE}${caminho}`, {
    method: init.method,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: init.corpo === undefined ? undefined : JSON.stringify(init.corpo),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!resposta.ok) {
    const corpo = await resposta.text().catch(() => "");
    throw new Error(
      `Zaper ${init.method} ${caminho} respondeu ${resposta.status}: ${corpo.slice(0, 300)}`,
    );
  }
  return (await resposta.json()) as T;
}

/**
 * Só os dígitos do telefone, com e sem o código do país.
 *
 * As duas formas são necessárias porque o Zaper é inconsistente: a **busca**
 * (`/contact/filter`) casa pelo número **sem** o 55, e a **criação** quer o
 * número **com** o 55 (guarda como `+55|34999999999`).
 *
 * O corte do país só acontece acima de 11 dígitos, senão um celular de Santa
 * Maria (DDD 55, como `55987654321`) perderia o próprio DDD.
 */
function partesDoTelefone(telefone: string): { comPais: string; semPais: string } {
  const digitos = telefone.replace(/\D/g, "");
  const semPais =
    digitos.startsWith("55") && digitos.length > 11 ? digitos.slice(2) : digitos;
  return { comPais: `55${semPais}`, semPais };
}

/**
 * A marcação de campanha do lead, tolerante a payload incompleto.
 *
 * `ehLeadValido`, na rota, só exige nome e telefone — é guarda contra lixo, não
 * validação de esquema. Quem chama a rota fora do formulário pode mandar um
 * lead sem `origem`, e aí `lead.origem.utm_campaign` derrubaria o registro
 * inteiro por causa de um campo opcional.
 */
function origemDe(lead: Lead): Lead["origem"] {
  return lead.origem ?? {};
}

/**
 * Cache de etiquetas por instância da função.
 *
 * As etiquetas mudam raramente e a lista inteira são 31 itens. Resolver o nome
 * em id a cada lead custaria uma ida à rede sem ganho; resolver **por nome**,
 * em vez de fixar os ids no código, faz a integração passar a funcionar sozinha
 * no dia em que o cliente criar a etiqueta que falta (hoje só as 5 do Piazza
 * existem — Villa Viseu, Uberlândia e o site institucional não têm a sua).
 */
let cacheEtiquetas: Map<string, string> | null = null;

async function idDaEtiqueta(nome: string): Promise<string | null> {
  if (!cacheEtiquetas) {
    // `/core/v1/tag` devolve um **array puro**, e não o `{items, totalItems}`
    // que o resto da API usa. Ler `.items` aqui dá lista vazia sem erro
    // nenhum, e o efeito só aparece lá na frente, como contato sem etiqueta.
    const etiquetas = await chamar<EtiquetaZaper[]>("/core/v1/tag?pageSize=100", {
      method: "GET",
    });
    cacheEtiquetas = new Map(
      (Array.isArray(etiquetas) ? etiquetas : [])
        .filter((e): e is EtiquetaZaper & { name: string } => Boolean(e.name))
        .map((e) => [e.name.toUpperCase(), e.id]),
    );
  }
  return cacheEtiquetas.get(nome.toUpperCase()) ?? null;
}

/**
 * Procura contato pelo telefone.
 *
 * **Cuidado com o filtro:** campo desconhecido no corpo é ignorado, e o
 * endpoint então devolve a base inteira (494 contatos) com status 200. Confiar
 * no primeiro item sem conferir daria "contato encontrado" para qualquer
 * telefone, e o lead novo iria parar no cadastro de um estranho. Por isso o
 * telefone da resposta é comparado com o que se procurava.
 */
async function buscarContato(telefone: string): Promise<ContatoZaper | null> {
  const { semPais } = partesDoTelefone(telefone);
  if (!semPais) return null;

  const pagina = await chamar<Pagina<ContatoZaper>>("/core/v1/contact/filter", {
    method: "POST",
    corpo: { phonenumber: semPais, pageNumber: 1, pageSize: 10 },
  });

  const encontrado = (pagina.items ?? []).find((contato) => {
    const digitos = (contato.phoneNumber ?? "").replace(/\D/g, "");
    return digitos.endsWith(semPais);
  });
  return encontrado ?? null;
}

/**
 * A anotação que o comercial lê no contato.
 *
 * Mesmo texto que o cenário do Make montava, mantido de propósito: os contatos
 * criados antes desta troca têm essa cara, e mudar o formato agora deixaria a
 * base com dois padrões sem ganho nenhum.
 */
function montarAnotacao(lead: Lead): string {
  const partes = [`LP: ${lead.lpOrigem}`, `Público: ${lead.publico}`];
  if (lead.qualificacao) {
    partes.push(`${lead.qualificacaoLabel}: ${lead.qualificacao}`);
  }
  const campanha = origemDe(lead).utm_campaign;
  if (campanha) partes.push(`Campanha: ${campanha}`);
  return partes.join(" | ");
}

/**
 * A descrição do card, com a marcação de campanha inteira.
 *
 * Vai tudo em texto porque o `metadata` do card **não persiste** — a API aceita
 * o campo e devolve `null`. Como é no card que o comercial trabalha o lead, é
 * aqui que a origem precisa estar legível.
 */
function montarDescricaoCard(lead: Lead): string {
  const origem = origemDe(lead);
  const linhas = [
    `Origem: ${lead.lpOrigem}`,
    `Público: ${lead.publico}`,
    `Empreendimento: ${lead.empreendimento}`,
  ];
  if (lead.qualificacao) {
    linhas.push(`${lead.qualificacaoLabel}: ${lead.qualificacao}`);
  }
  if (lead.email) linhas.push(`E-mail: ${lead.email}`);
  linhas.push(`Telefone: ${lead.telefone}`);

  const campanha = [
    ["Campanha", origem.utm_campaign],
    ["Fonte", origem.utm_source],
    ["Mídia", origem.utm_medium],
    ["Conteúdo", origem.utm_content],
    ["Termo", origem.utm_term],
    ["gclid", origem.gclid],
    ["fbclid", origem.fbclid],
    ["Página", origem.pagina],
  ].filter((par): par is [string, string] => Boolean(par[1]));

  if (campanha.length) {
    linhas.push("", ...campanha.map(([rotulo, valor]) => `${rotulo}: ${valor}`));
  }
  return linhas.join("\n");
}

/**
 * Registra o lead no Zaper: contato, etiqueta, custom fields e card no painel.
 *
 * O card é o passo que o Make nunca deu — o módulo "Create Contact" do wts.chat
 * cria contato e só, e por isso o painel "Leads de anúncios" nasceu vazio e
 * ficou assim.
 *
 * **Contato existente é reaproveitado, não sobrescrito.** Quem já está na base
 * costuma ter nome, anotação e etiquetas trabalhados pelo comercial; um lead
 * novo da mesma pessoa não é motivo para apagar isso. O card novo entra do
 * mesmo jeito, e é ele que carrega o contexto desta conversão.
 */
export async function registrarLeadNoZaper(lead: Lead): Promise<ResultadoZaper> {
  const existente = await buscarContato(lead.telefone);

  const nomeEtiqueta = (lead.lpOrigem ?? "").toUpperCase();
  const etiqueta = nomeEtiqueta ? await idDaEtiqueta(nomeEtiqueta) : null;

  let contatoId: string;
  if (existente) {
    contatoId = existente.id;
  } else {
    const { comPais } = partesDoTelefone(lead.telefone);
    const criado = await chamar<ContatoZaper>("/core/v1/contact", {
      method: "POST",
      corpo: {
        name: lead.nome,
        // Minúsculo de propósito: a leitura devolve `phoneNumber`, mas a
        // escrita só aceita `phonenumber`.
        phonenumber: comPais,
        email: lead.email || undefined,
        annotation: montarAnotacao(lead),
        // `tagIds`, não `tagsId`: com o nome errado a API responde 200 e
        // devolve a lista vazia, sem erro nenhum.
        tagIds: etiqueta ? [etiqueta] : [],
      },
    });
    contatoId = criado.id;

    if (etiqueta && !(criado.tagNames ?? []).length) {
      console.error(
        `Zaper aceitou o contato ${contatoId} mas não gravou a etiqueta ${nomeEtiqueta}`,
      );
    }
  }

  // O card é o único passo que pode falhar sem invalidar o resto: o contato já
  // está na base, e o comercial ainda o encontra pela busca.
  let cardId: string | null = null;
  try {
    const card = await chamar<{ id: string }>("/crm/v1/panel/card", {
      method: "POST",
      corpo: {
        panelId: PAINEL,
        stepId: ETAPA_NOVO_LEAD,
        title: `${lead.nome} — ${lead.empreendimento}`,
        description: montarDescricaoCard(lead),
        contactIds: [contatoId],
      },
    });
    cardId = card.id;
  } catch (erro) {
    console.error("Contato criado, mas o card não entrou no painel:", erro);
  }

  return {
    contatoId,
    cardId,
    contatoReaproveitado: Boolean(existente),
    etiqueta: etiqueta ? nomeEtiqueta : null,
  };
}
