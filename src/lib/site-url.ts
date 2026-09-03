/**
 * URL pública do site, base de `metadataBase`, do sitemap, do robots e do JSON-LD.
 *
 * A leitura é defensiva de propósito: esta constante alimenta
 * `new URL()` no layout raiz, que é carregado por *toda* página. Um valor
 * inválido aqui não quebra uma rota — quebra o build inteiro, com um
 * `ERR_INVALID_URL` que aponta para uma página sorteada ao acaso e não diz
 * nada sobre a variável de ambiente que o causou.
 *
 * Os três casos que já apareceram ao apontar um domínio novo:
 *
 * - **variável presente e vazia** (`NEXT_PUBLIC_SITE_URL=`), quando o domínio
 *   ainda não foi decidido. `??` não protege disso: só cai no padrão quando o
 *   valor é `undefined`, e string vazia passa direto.
 * - **domínio sem esquema** (`nexamalls.com.br`), que é como se digita o
 *   domínio no painel. `new URL()` exige o protocolo.
 * - **barra no fim** (`https://nexamalls.com.br/`), que viraria `//buscar` em
 *   todo link do sitemap, montado por interpolação.
 */
function normalizar(valor: string | undefined): string | null {
  const bruto = valor?.trim();
  if (!bruto) return null;

  const comEsquema = /^https?:\/\//i.test(bruto) ? bruto : `https://${bruto}`;

  try {
    return new URL(comEsquema).origin;
  } catch {
    return null;
  }
}

export const SITE_URL =
  normalizar(process.env.NEXT_PUBLIC_SITE_URL) ??
  // Preenchida pela Vercel enquanto o domínio próprio não está configurado.
  normalizar(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) ??
  "https://lp-piazza-servicos.vercel.app";
