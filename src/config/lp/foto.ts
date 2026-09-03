import type { AtivoLp } from "@/components/lp-trafego/types";

/**
 * Uma foto da galeria do empreendimento, procurada pela legenda.
 *
 * As páginas escolhem imagens diferentes de propósito, para a mesma foto não
 * aparecer duas vezes na mesma leitura. A busca é pela legenda cadastrada no
 * CMS, e não por caminho de arquivo, para que trocar a imagem no Keystatic
 * baste. Se a legenda não existir mais, cai na primeira foto da galeria em vez
 * de deixar um buraco na página.
 */
export function foto(ativo: AtivoLp, legenda: string): string {
  const achada = ativo.galeria.find((g) => g.legenda === legenda);
  return achada?.src ?? ativo.galeria[0]?.src ?? "";
}
