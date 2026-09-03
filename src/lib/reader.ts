import { existsSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

export const reader = createReader(process.cwd(), keystaticConfig);

export const getSite = cache(async () => {
  const site = await reader.singletons.site.read();
  if (!site) throw new Error("Conteúdo ausente: singletons/site");
  return site;
});

export const getEmpreendimentos = cache(async () => {
  const all = await reader.collections.empreendimentos.all();
  return all.sort((a, b) => (a.entry.ordem ?? 0) - (b.entry.ordem ?? 0));
});

/**
 * Marcas atendidas, na ordem definida no CMS.
 *
 * Se o campo `logo` estiver vazio, procura `public/images/marcas/<slug>.webp`:
 * assim basta soltar o arquivo (ou rodar `npm run imagens`) para o logo entrar,
 * sem ter de editar cada marca no Keystatic.
 */
export const getMarcas = cache(async () => {
  const all = await reader.collections.marcas.all();
  return all
    .sort((a, b) => (a.entry.ordem ?? 0) - (b.entry.ordem ?? 0))
    .map((m) => {
      if (m.entry.logo) return m;
      const relativo = `/images/marcas/${m.slug}.webp`;
      const existe = existsSync(path.join(process.cwd(), "public", relativo));
      return existe
        ? { ...m, entry: { ...m.entry, logo: relativo } }
        : m;
    });
});

/**
 * As mesmas marcas, apontando para a arte colorida em vez da silhueta.
 *
 * A ordem e os nomes continuam vindo do CMS; só o caminho do arquivo muda. Se
 * a versão colorida de alguma não existir, a silhueta entra no lugar, e a faixa
 * não abre buraco.
 */
export const getMarcasColoridas = cache(async () => {
  const marcas = await getMarcas();
  return marcas.map((m) => {
    const colorido = `/images/marcas-cor/${m.slug}.webp`;
    const existe = existsSync(path.join(process.cwd(), "public", colorido));
    return {
      slug: m.slug,
      nome: m.entry.nome,
      logo: existe ? colorido : m.entry.logo,
    };
  });
});
