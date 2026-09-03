import { waLink } from "./whatsapp";

/**
 * Lead das landing pages de tráfego pago.
 *
 * O ponto único de integração com o CRM é `registrarLead`. Enquanto a
 * integração não existe, o formulário entrega o lead qualificado no WhatsApp do
 * comercial — a página converte desde o primeiro dia e nada fica pendurado
 * esperando back-end. Quando o CRM entrar, basta preencher a função: o
 * formulário não muda, e a entrega no WhatsApp pode continuar como redundância
 * ou sair, conforme o time preferir.
 */
export type Lead = {
  nome: string;
  telefone: string;
  email: string;
  /** resposta do campo que qualifica o público (nome do negócio, perfil de investidor) */
  qualificacao: string;
  /** como essa resposta é anunciada ao comercial: "Negócio", "Perfil" */
  qualificacaoLabel: string;
  /** qual público da página originou o lead: "saude", "investidor", etc. */
  publico: string;
  empreendimento: string;
  /**
   * Qual LP, como projeto publicado, originou o lead — não confundir com
   * `publico` acima.
   *
   * Existe porque conteúdo idêntico pode viver em domínios diferentes: a LP
   * dedicada `lp-piazza-saude` e a página `/saude` de `lp-piazza-lojista`
   * mostram a mesma copy (mesmo YAML, mesmo componente), mas são anúncios e
   * domínios diferentes, e o Zaper precisa distinguir de qual dos dois o lead
   * veio. Cada projeto gerado grava o seu próprio valor fixo em
   * `src/config/lp/index.ts` — ver `scripts/gerar-lp.mjs`.
   */
  lpOrigem: string;
  /** parâmetros de campanha capturados da URL do anúncio */
  origem: Origem;
};

export type Origem = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  /** identificador do clique no Google Ads */
  gclid?: string;
  /** identificador do clique no Meta Ads */
  fbclid?: string;
  /** URL completa (com domínio) da página em que o lead foi preenchido */
  pagina?: string;
};

const CHAVES_ORIGEM = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

/**
 * Lê os parâmetros de campanha da URL.
 *
 * O anúncio traz a marcação na query string; ela é lida no envio e viaja junto
 * do lead, para a atribuição já estar pronta no dia em que o CRM entrar. Roda
 * só no cliente — no servidor devolve objeto vazio.
 *
 * `pagina` é a URL inteira, com domínio, e não só o caminho: o caminho de uma
 * LP dedicada de hub é sempre `/` (a página é a raiz do domínio dela), então
 * sem o domínio o dado não diria qual das cinco LPs do Piazza é essa. `lpOrigem`
 * (em `Lead`, montado por quem chama esta função) é a marcação pensada para
 * isso; esta URL fica como registro bruto, útil para conferir o anúncio.
 */
export function capturarOrigem(): Origem {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const origem: Origem = { pagina: window.location.href };
  for (const chave of CHAVES_ORIGEM) {
    const valor = params.get(chave);
    if (valor) origem[chave] = valor;
  }
  return origem;
}

/**
 * Mensagem que o lead envia ao comercial, já qualificada.
 *
 * O texto é escrito na primeira pessoa porque quem aparece enviando é o próprio
 * lead. A linha de campanha só entra quando há marcação na URL, e serve para o
 * comercial saber de qual anúncio a pessoa veio antes de responder.
 */
export function montarMensagemLead(lead: Lead): string {
  const linhas = [
    `Olá! Vim pelo site da Nexa Malls e quero falar com o time sobre o ${lead.empreendimento}.`,
    "",
    `Nome: ${lead.nome}`,
    `Telefone: ${lead.telefone}`,
  ];
  if (lead.email) linhas.push(`E-mail: ${lead.email}`);
  if (lead.qualificacao)
    linhas.push(`${lead.qualificacaoLabel}: ${lead.qualificacao}`);
  if (lead.origem.utm_campaign) {
    linhas.push("", `(campanha: ${lead.origem.utm_campaign})`);
  }
  return linhas.join("\n");
}

/** Link do WhatsApp já com o lead qualificado dentro da mensagem. */
export function linkLead(lead: Lead, whatsappNumero: string): string {
  return waLink(whatsappNumero, montarMensagemLead(lead));
}

/**
 * Ponto único de integração com o CRM: encaminha o lead para `/api/lead`, que
 * é quem fala com o Zaper — assim a URL do webhook fica no servidor e nunca
 * vai para o navegador. O objeto `Lead` já carrega nome, telefone, e-mail, a
 * qualificação, qual LP originou o lead e a marcação de campanha: é o payload
 * completo, não falta nada a coletar.
 *
 * Chamada sem `await` pelo formulário, de propósito. O envio do lead nunca pode
 * esperar rede: a janela do WhatsApp abre no mesmo gesto do clique (se abrisse
 * depois de um `await`, o bloqueador de pop-up do navegador a barraria) e o
 * registro corre por fora. `keepalive` mantém a requisição viva mesmo que a
 * aba perca o foco para a janela do WhatsApp logo em seguida. Falha de CRM
 * fica no console — perder o registro é ruim, perder o lead é pior.
 */
export function registrarLead(lead: Lead): void {
  fetch("/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(lead),
    keepalive: true,
  }).catch((erro) => {
    console.error("Falha ao registrar lead", erro);
  });
}
