import { cache } from "react";
import type { AtivoLp } from "@/components/lp-trafego/types";
import { getSite, reader } from "./reader";

/**
 * O empreendimento como as landing pages de tráfego o enxergam.
 *
 * As LPs nasceram como projetos separados, com os números do ativo copiados à
 * mão de `nexamalls.com.br`. Dentro do site elas leem o CMS: terreno, área,
 * operações, vagas e fotos vêm da mesma entrada que alimenta a página do
 * empreendimento, e uma correção no Keystatic chega às cinco páginas de uma vez.
 */
export const getAtivoLp = cache(
  async (slug: string): Promise<AtivoLp | null> => {
    const entry = await reader.collections.empreendimentos.read(slug);
    if (!entry || !entry.temLandingPage) return null;
    const site = await getSite();

    return {
      slug,
      nome: entry.nome,
      cidade: entry.cidade,
      endereco: entry.endereco,
      enderecoCurto: semCidade(entry.endereco, entry.cidade),
      terreno: entry.fichaTecnica.terreno,
      construcao: entry.fichaTecnica.abl,
      operacoes: entry.fichaTecnica.operacoes,
      vagas: entry.fichaTecnica.vagas,
      comercializado: percentualDestaque(entry.numerosDestaque),
      accent: entry.arte.accentColor,
      video: videoDaGaleria(entry.galeria),
      temGaleria: entry.galeria.some((g) => !g.video && g.imagem),
      galeria: comFallback(
        entry.galeria
          .filter((g) => !g.video && g.imagem)
          .map((g) => ({ src: g.imagem as string, legenda: g.legenda })),
        entry.imagemHero ?? entry.imagemCard,
      ),
      mapaEmbedUrl: entry.mapaEmbedUrl,
      whatsappNumero: site.whatsappNumero,
    };
  },
);

/**
 * A galeria, ou a imagem do hero quando não há galeria nenhuma.
 *
 * As páginas de tráfego pedem foto por legenda (`foto(ativo, "Praça de
 * alimentação")`), e sem galeria essa busca devolvia string vazia: cinco
 * landings inteiras com o lugar da imagem em branco. Com o hero no lugar, a
 * página nasce de pé e a foto certa é uma edição no Keystatic, não um bug.
 *
 * A legenda vazia é proposital: assim nenhuma busca por legenda casa por
 * acidente, e o fallback continua sendo fallback.
 */
function comFallback(
  galeria: readonly { src: string; legenda: string }[],
  hero: string | null,
): readonly { src: string; legenda: string }[] {
  if (galeria.length > 0) return galeria;
  return hero ? [{ src: hero, legenda: "" }] : [];
}

/**
 * O item em vídeo da galeria, que a lista de fotos deixa de fora.
 *
 * A galeria das landings é só de fotos, porque o carrossel delas não toca
 * vídeo. Mas a peça existe no CMS, e a página do investidor a usa na leitura
 * dos pavimentos. Sem vídeo cadastrado devolve nulo, e quem usa decide.
 */
function videoDaGaleria(
  galeria: readonly { imagem: string | null; video: string | null }[],
): { src: string; capa: string } | null {
  const item = galeria.find((g) => g.video);
  return item?.video ? { src: item.video, capa: item.imagem ?? "" } : null;
}

/**
 * O endereço sem a cidade no fim.
 *
 * Na ficha e no hero a cidade já está dita em volta, e repeti-la ali só rouba
 * espaço de uma linha que precisa caber inteira no celular.
 */
function semCidade(endereco: string, cidade: string): string {
  const sufixo = `, ${cidade}`;
  return endereco.endsWith(sufixo)
    ? endereco.slice(0, -sufixo.length)
    : endereco;
}

/**
 * A fatia já comercializada, lida dos números de destaque do CMS.
 *
 * É o único percentual que a página afirma, e ele precisa vir do conteúdo
 * publicado: escassez em página aberta só com fato verificável. Sem um número
 * em porcentagem cadastrado, devolve vazio e quem usa decide o que fazer.
 */
function percentualDestaque(
  numeros: readonly { valor: string; prefixo: string; sufixo: string }[],
): string {
  const item = numeros.find((n) => n.sufixo.trim() === "%");
  return item ? `${item.prefixo}${item.valor}%` : "";
}
