/**
 * A landing de lojista do empreendimento, e como se chega nela.
 *
 * Este projeto recebe tráfego pago de um público só, num domínio só, então as
 * rotas são curtas: o anúncio aponta para o domínio e pronto.
 *
 *   /                     a landing, na raiz do domínio
 *
 * A copy abaixo é a mesma que roda em nexamalls.com.br, copiada de
 * `src/config/lps-piazza/` por `scripts/gerar-lp.mjs`. Os números dela
 * não estão escritos aqui: vêm do Keystatic, do cadastro do empreendimento, do
 * mesmo jeito que no site.
 */

import { servicos } from "./servicos";

/** O empreendimento desta landing, como o CMS o conhece. */
export const SLUG = "piazza-nicomedes";

export const LP_ID = "lp-piazza-servicos";

/**
 * A página deste empreendimento no site institucional.
 *
 * É o único link para fora que a landing oferece, no rodapé, e existe porque
 * quem vai responder a um anúncio de imóvel comercial pesquisa a empresa antes.
 * Vale como sinal de confiança para o visitante e para as plataformas de
 * anúncio, que penalizam página sem dono identificável.
 */
export const PAGINA_NO_SITE = `${
  process.env.NEXT_PUBLIC_SITE_NEXA ?? "https://nexamalls.com.br"
}/empreendimentos/${SLUG}`;

/** A copy da página, escrita sobre os dados que o CMS devolve do ativo. */
export const MONTAR = servicos;
