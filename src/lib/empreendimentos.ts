/**
 * Vocabulário e derivações do portfólio de empreendimentos.
 *
 * ATENÇÃO ao mapeamento status → rótulo: as chaves são históricas e não
 * coincidem mais com o texto exibido. Use sempre STATUS_LABEL, nunca a chave.
 *   operacao        → "Gestão de Ativos"
 *   comercializacao → "Incorporação"
 *   desenvolvimento → "Desenvolvimento"
 */
export const STATUS_LABEL: Record<string, string> = {
  operacao: "Gestão de Ativos",
  comercializacao: "Incorporação",
  desenvolvimento: "Desenvolvimento",
};

/** Ordem editorial do ciclo de vida: da entrega para trás. */
export const STATUS_ORDER = ["operacao", "comercializacao", "desenvolvimento"] as const;

/** Cor do marcador de status — único ponto onde o ciclo ganha cor. */
export const STATUS_DOT: Record<string, string> = {
  operacao: "bg-emerald-400",
  comercializacao: "bg-nexa-line",
  desenvolvimento: "bg-amber-400",
};

/**
 * Zonas de Uberlândia, para o filtro da busca.
 *
 * Os valores vieram do bairro de cada endereço e precisam de conferência de
 * quem conhece a cidade: `Central` para Centro e Altamira, `Oeste` para
 * Tubalina, `Sul` para Morada da Colina e Nicomedes Alves dos Santos, `Leste`
 * para Granja Marileusa. Corrigir é um clique no Keystatic.
 */
export const ZONA_LABEL: Record<string, string> = {
  sul: "Zona Sul",
  norte: "Zona Norte",
  leste: "Zona Leste",
  oeste: "Zona Oeste",
  central: "Central",
};

/** Ordem em que as zonas aparecem no filtro. */
export const ZONA_ORDER = ["central", "sul", "norte", "leste", "oeste"] as const;

/**
 * O que se pode abrir em cada empreendimento.
 *
 * Diferente de `CATEGORIA_LABEL`, que diz o formato do prédio: aqui é o que o
 * lojista procura.
 *
 * O vocabulário é o do quadro comercial, que é de onde os dados vêm. Manter os
 * mesmos termos evita um de-para que precisaria ser refeito toda vez que um
 * empreendimento novo entrasse — e evita perder granularidade pelo caminho
 * (o quadro separa restaurante de fast food, e clínica de saúde em geral).
 *
 * A busca só oferece os tipos que algum empreendimento tem cadastrado, então
 * uma lista longa aqui não vira um menu longo na tela.
 */
export const TIPO_OPERACAO_LABEL: Record<string, string> = {
  academia: "Academia",
  "auto-center": "Auto center",
  banco: "Banco e financeira",
  clinica: "Clínica",
  concessionaria: "Concessionária",
  conveniencia: "Conveniência",
  coworking: "Coworking",
  educacao: "Educação",
  entretenimento: "Entretenimento",
  escritorio: "Escritório",
  farmacia: "Farmácia",
  "fast-food": "Fast food",
  gastronomia: "Gastronomia",
  "home-center": "Home center",
  "pet-shop": "Pet shop",
  restaurante: "Restaurante",
  "sala-comercial": "Sala comercial",
  saude: "Saúde e bem-estar",
  servicos: "Serviços",
  supermercado: "Supermercado",
  varejo: "Varejo",
};

/**
 * Os 21 tipos reunidos nos grupos que o lojista de fato usa para se descrever.
 *
 * O vocabulário granular acima é o do quadro comercial, e continua sendo o que
 * fica gravado em cada empreendimento — nada foi apagado. O que este mapa faz é
 * só juntar o que na prática é a mesma pergunta: quem procura ponto para
 * restaurante e quem procura para fast food procuram gastronomia; farmácia,
 * clínica e academia são todas saúde e bem-estar.
 *
 * Agrupar na exibição em vez de reduzir no dado tem três ganhos. O filtro cai
 * de 21 para 8 opções, que é o tamanho de uma lista que se lê de uma vez. O
 * detalhe sobrevive para as fichas e para a busca por texto — quem digitar
 * "farmácia" continua achando. E ninguém precisa recadastrar os 20 ativos.
 *
 * CUIDADO: todo tipo de `TIPO_OPERACAO_LABEL` precisa aparecer em exatamente um
 * grupo. Tipo fora daqui vira dado inalcançável pelo filtro.
 */
export const GRUPO_OPERACAO: readonly {
  valor: string;
  label: string;
  tipos: readonly string[];
}[] = [
  {
    valor: "gastronomia",
    label: "Gastronomia",
    tipos: ["gastronomia", "restaurante", "fast-food"],
  },
  {
    valor: "saude",
    label: "Saúde e bem-estar",
    tipos: ["saude", "clinica", "farmacia", "academia"],
  },
  {
    valor: "servicos",
    label: "Serviços e conveniência",
    tipos: ["servicos", "banco", "conveniencia", "pet-shop"],
  },
  {
    valor: "varejo",
    label: "Varejo e supermercado",
    tipos: ["varejo", "supermercado", "home-center"],
  },
  {
    valor: "escritorios",
    label: "Escritórios e salas",
    tipos: ["escritorio", "sala-comercial", "coworking"],
  },
  {
    valor: "automotivo",
    label: "Automotivo",
    tipos: ["auto-center", "concessionaria"],
  },
  { valor: "educacao", label: "Educação", tipos: ["educacao"] },
  {
    valor: "entretenimento",
    label: "Entretenimento",
    tipos: ["entretenimento"],
  },
];

/**
 * Os tipos que um ativo recebe, arrumados nos grupos a que pertencem.
 *
 * Uma lista corrida de onze termos em ordem alfabética não diz nada: "academia,
 * auto center, banco, concessionária, entretenimento, farmácia, fast food, home
 * center, pet shop, restaurante, supermercado" obriga a pessoa a montar sozinha
 * a leitura de que ali cabem duas operações de comida e duas de carro. Agrupado,
 * a vocação do ativo aparece de relance.
 *
 * Usa os mesmos grupos do filtro da busca de propósito: quem filtrou por
 * "Gastronomia" e chegou aqui reencontra a palavra pela qual procurou.
 */
export function agruparOperacoes(
  tipos: readonly string[],
): readonly { valor: string; label: string; itens: readonly string[] }[] {
  return GRUPO_OPERACAO.map((g) => ({
    valor: g.valor,
    label: g.label,
    itens: g.tipos
      .filter((t) => tipos.includes(t))
      .map((t) => TIPO_OPERACAO_LABEL[t] ?? t),
  })).filter((g) => g.itens.length > 0);
}

/** Os tipos de um grupo, para o filtro casar sem varrer a lista toda. */
export const TIPOS_DO_GRUPO: Record<string, readonly string[]> =
  Object.fromEntries(GRUPO_OPERACAO.map((g) => [g.valor, g.tipos]));

export const CATEGORIA_LABEL: Record<string, string> = {
  "strip-mall": "Strip Mall",
  "lojas-comerciais": "Lojas Comerciais",
  "open-mall": "Open Mall",
  "hub-conveniencia": "Hub de Conveniência",
  "hub-servicos": "Hub de Serviços",
  shopping: "Shopping",
};

/** Frentes de trabalho da Nexa dentro de um empreendimento. */
export const ATUACAO_LABEL: Record<string, string> = {
  incorporacao: "Incorporação",
  masterplan: "Masterplan",
  desenvolvimento: "Desenvolvimento",
  "curadoria-mix": "Mix de operações",
  comercializacao: "Comercialização",
  gestao: "Gestão",
};

export function statusLabel(status: string): string {
  return STATUS_LABEL[status] ?? status;
}

export function atuacaoLabel(atuacao: string): string {
  return ATUACAO_LABEL[atuacao] ?? atuacao;
}

export function categoriaLabel(categoria: string): string {
  return CATEGORIA_LABEL[categoria] ?? categoria;
}

export type NumeroDestaque = {
  valor: string;
  prefixo: string;
  sufixo: string;
  label: string;
};

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/**
 * Que tipo de resultado o indicador mede. Lido do próprio rótulo escrito no
 * CMS, para que o card diga "Ocupação" / "Comercialização" / "Ancoragem" em vez
 * de deixar o número solto sem contexto.
 */
export function tipoResultado(label: string): string | null {
  const l = normalize(label);
  if (l.includes("ocupa")) return "Ocupação";
  if (l.includes("comercializ")) return "Comercialização";
  if (l.includes("ancora")) return "Ancoragem";
  if (l.includes("opera")) return "Operações";
  return null;
}

/** Indicador principal do card: o primeiro número de destaque do empreendimento. */
export type Indicador = { valor: string; label: string; tipo: string | null };

export function indicadorPrincipal(
  numeros: readonly NumeroDestaque[],
  fallback: string,
): Indicador | null {
  const n = numeros[0];
  if (n?.valor) {
    return {
      valor: `${n.prefixo}${n.valor}${n.sufixo}`,
      label: n.label,
      tipo: tipoResultado(n.label),
    };
  }
  return fallback
    ? { valor: "", label: fallback, tipo: tipoResultado(fallback) }
    : null;
}

/**
 * Taxa média de ocupação: média dos números percentuais cujo rótulo fala de
 * ocupação. Ignora percentuais de comercialização/ancoragem, que medem outra
 * coisa. Retorna null quando nenhum empreendimento reporta ocupação.
 */
export function taxaMediaOcupacao(
  itens: readonly { numerosDestaque: readonly NumeroDestaque[] }[],
): number | null {
  const taxas = itens.flatMap((item) =>
    item.numerosDestaque
      .filter(
        (n) => n.sufixo.trim() === "%" && normalize(n.label).includes("ocupa"),
      )
      .map((n) => Number(n.valor))
      .filter((v) => Number.isFinite(v)),
  );
  if (taxas.length === 0) return null;
  return Math.round(taxas.reduce((a, b) => a + b, 0) / taxas.length);
}

export function contarPorStatus(
  itens: readonly { status: string }[],
  status: string,
): number {
  return itens.filter((i) => i.status === status).length;
}

/**
 * A fase comercial do ativo, que é o mesmo dado de `status` dito de outro jeito.
 *
 * `STATUS_LABEL` traduz a chave para o **pilar** da Nexa ("Gestão de Ativos"),
 * que é linguagem institucional: diz de que time o ativo é. Na busca a pergunta
 * é outra — em que pé está a obra —, e "Gestão de Ativos" não responde. Por
 * isso os dois mapas convivem: mesma chave, duas leituras, cada uma no seu
 * contexto. É o "Estágio do projeto" das referências do setor.
 */
export const FASE_LABEL: Record<string, string> = {
  operacao: "Em operação",
  comercializacao: "Em comercialização",
  desenvolvimento: "Em desenvolvimento",
};

/** Do pronto para o que ainda vai sair — a ordem que o lojista percorre. */
export const FASE_ORDER = ["operacao", "comercializacao", "desenvolvimento"] as const;

export const PUBLICO_LABEL: Record<string, string> = {
  lojista: "Lojista",
  investidor: "Investidor",
  ancora: "Loja âncora",
};

export const PUBLICO_ORDER = ["lojista", "investidor", "ancora"] as const;

/**
 * Para quem aquele ativo serve.
 *
 * A fase já responde quase sempre, e é por isso que o padrão sai dela em vez de
 * exigir preenchimento: num ativo em operação sobra sala e falta lojista;
 * num que ainda é projeto, quem chega primeiro é investidor ou âncora. Quando
 * o ativo foge da regra, o campo `publicos` no CMS ganha da derivação — o
 * cliente corrige sem precisar de código.
 */
export function publicosDe(
  status: string,
  publicos?: readonly string[],
): readonly string[] {
  if (publicos && publicos.length > 0) return publicos;
  if (status === "operacao") return ["lojista"];
  if (status === "comercializacao") return ["lojista", "investidor"];
  return ["investidor", "ancora"];
}

/**
 * O convite do card, que muda com a fase porque a ação muda com ela.
 *
 * Mandar "invista" em quem procura uma sala num ativo 95% ocupado é oferecer a
 * porta errada. Villa Viseu pede lojista; uma avenida ainda em projeto pede
 * investidor.
 */
export function ctaBusca(status: string): string {
  if (status === "operacao") return "Ver lojas disponíveis";
  if (status === "comercializacao") return "Ver a oportunidade";
  return "Conhecer o projeto";
}

/**
 * Texto alternativo de foto: o nome do ativo, e a legenda quando existir.
 *
 * Existe porque a galeria pode cair no retrato do hero, que não tem legenda —
 * e `${nome}: ${legenda}` virava "Uberlândia Shopping: " com dois-pontos
 * pendurado, lido em voz alta por leitor de tela.
 */
export function altFoto(nome: string, legenda: string): string {
  const l = legenda.trim();
  return l ? `${nome}: ${l}` : nome;
}

/**
 * Para onde o card manda quem clicou, e com que promessa.
 *
 * A régua é o quanto o destino qualifica o lead. Uma landing por público
 * (o `/lojista` e o `/investidor` do Piazza) já separa quem quer sala de quem
 * quer cota antes de qualquer conversa, então ganha do WhatsApp. A LP do ativo
 * qualifica menos, mas ainda apresenta o empreendimento. O WhatsApp é o último
 * recurso, para o ativo que ainda não tem página nenhuma — melhor que o card
 * morrer na grade.
 *
 * Um ativo que serve aos dois públicos devolve dois destinos, e é de propósito:
 * é o próprio visitante quem se classifica ao escolher, e essa é a informação
 * mais barata de coletar que existe.
 */
export type DestinoCard = { href: string; label: string; externo: boolean };

export function destinosDoCard(opts: {
  slug: string;
  status: string;
  publicos?: readonly string[];
  subLojista?: boolean;
  subInvestidor?: boolean;
}): readonly DestinoCard[] {
  const base = `/empreendimentos/${opts.slug}`;
  const serve = publicosDe(opts.status, opts.publicos);
  const destinos: DestinoCard[] = [];

  if (opts.subLojista && serve.includes("lojista")) {
    destinos.push({
      href: `${base}/lojista`,
      label: "Quero abrir minha loja",
      externo: false,
    });
  }
  if (opts.subInvestidor && serve.includes("investidor")) {
    destinos.push({
      href: `${base}/investidor`,
      label: "Quero investir",
      externo: false,
    });
  }
  if (destinos.length > 0) return destinos;

  // Todo ativo tem página desde que os 14 do quadro comercial ganharam a sua
  // (a curta, montada com o que existe no CMS). Antes daquilo, quem não tinha
  // página caía direto no WhatsApp, e isso pulava a etapa em que a pessoa se
  // informa: ela decidia falar com o time sem ter visto o endereço, o mix nem
  // o mapa. O WhatsApp continua existindo, mas dentro da página, depois da
  // leitura, e é lá que ele qualifica.
  return [{ href: base, label: ctaBusca(opts.status), externo: false }];
}

/**
 * Texto pronto para comparação: sem acento, sem caixa, sem borda.
 *
 * Quem digita "uberlandia" tem que achar "Uberlândia" — na busca por nome o
 * acento é obstáculo, não informação. Reusa o `normalize` que os indicadores
 * já usavam; só acrescenta o `trim`, que ali não fazia falta e aqui faz.
 */
export function normalizarBusca(texto: string): string {
  return normalize(texto).trim();
}
