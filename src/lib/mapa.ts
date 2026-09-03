/**
 * Consultas de mapa a partir do endereço do empreendimento.
 *
 * O nome do projeto fica FORA da consulta de propósito: empreendimentos em obra
 * ainda não existem no Google Maps, e incluir o nome faz a geocodificação
 * falhar — o mapa abre numa região genérica e sem o pino vermelho. Só o
 * endereço garante o ponto exato.
 */

/** Normaliza o endereço do CMS para algo que o Google geocodifica bem. */
export function enderecoParaMapa(endereco: string): string {
  return (
    endereco
      // travessão separando bairro/cidade vira vírgula
      .replace(/\s*—\s*/g, ", ")
      // "Uberlândia/MG" → "Uberlândia, MG"
      .replace(/([A-Za-zÀ-ÿ.\s]+)\/([A-Z]{2})\b/g, "$1, $2")
      .replace(/\s{2,}/g, " ")
      .trim() + ", Brasil"
  );
}

export function linksMapa(endereco: string) {
  const q = encodeURIComponent(enderecoParaMapa(endereco));
  return {
    /** iframe: z=17 aproxima o suficiente para o pino vermelho ficar evidente */
    embed: `https://www.google.com/maps?q=${q}&z=17&hl=pt-BR&output=embed`,
    abrir: `https://www.google.com/maps/search/?api=1&query=${q}`,
    rota: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
  };
}
