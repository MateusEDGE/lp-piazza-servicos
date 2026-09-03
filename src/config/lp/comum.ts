import { foto } from "./foto";

/**
 * O que é igual nas quatro landing pages do Piazza Nicomedes.
 *
 * Três regras valem para todo texto destas páginas:
 *
 * 1. Não há projeção de rentabilidade, VGV nem ticket de entrada em página
 *    aberta — decisão do cliente. A página do investidor argumenta por
 *    fundamento do ativo, e o número fica para a reunião.
 * 2. Escassez só com fato verificável. "50% de ancoragem antes da obra" é
 *    fato, e vem do CMS. "Restam 3 unidades" não entra sem vir do funil real.
 * 3. Nenhum travessão em texto que a pessoa lê (decisão de 18/08/2026). Vale
 *    para copy, rótulo, legenda e texto alternativo de imagem — em dois pontos,
 *    vírgula ou parênteses, conforme a frase pedir. Estes comentários de código
 *    não são página e seguem livres.
 */

/** A busca de foto por legenda, reexportada para quem só importa daqui. */
export { foto };

/* Blocos repetidos: mesma resposta, mesma redação, nas quatro páginas. */

export const FAQ_QUEM_ESTA_ATRAS = {
  pergunta: "Quem está por trás do empreendimento?",
  resposta:
    "A Nexa Malls: 18 anos de experiência combinada, atuação em 4 estados, 5 strip malls desenvolvidos, mais de 30 operações build to suit entregues e mais de 400 imóveis comerciais locados. No Piazza Nicomedes a Nexa é a incorporadora e responde pelo masterplan, pela comercialização e pela gestão do ativo depois da entrega: carteira, fundo de promoção e condomínio.",
} as const;

export const FAQ_COMO_RESERVAR = {
  pergunta: "Como funciona para reservar uma unidade?",
  resposta:
    "Três passos. Você informa o segmento e a metragem que procura; o time devolve a planta com as unidades ainda livres, a posição de cada uma e as condições; a reserva é formalizada em seguida. Receber a proposta não tem custo nem compromisso.",
} as const;
