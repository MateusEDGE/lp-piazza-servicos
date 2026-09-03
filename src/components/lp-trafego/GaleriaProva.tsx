"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Coverflow } from "@/components/ui/Coverflow";
import { SectionShell } from "@/components/ui/SectionShell";
import { SeloIlustrativo } from "@/components/ui/SeloIlustrativo";
import { Visor, type Foto } from "@/components/ui/VisorGaleria";
import type { AtivoLp } from "./types";
import { altFoto } from "@/lib/empreendimentos";

/** Quantas fotos entram no carrossel. */
const MAXIMO_FOTOS = 6;

/**
 * Quanto os cards laterais desbotam, aqui.
 *
 * O padrão do carrossel (0,72 e 0,3) foi desenhado para seção escura, onde o
 * desbote lê como profundidade. Esta seção é clara: ali a foto lavava até quase
 * o branco do fundo e o efeito parecia desfoque. Com estes valores a
 * profundidade continua vindo do giro e da escala, e a cor fica.
 */
const OPACIDADE_LATERAL = [1, 0.97, 0.88] as const;

/**
 * As imagens do projeto, no mesmo carrossel do resto do site.
 *
 * Era uma grade estática, e sem visor de propósito: a ideia era não tirar o
 * visitante do caminho do formulário. O cliente pediu o contrário — a mecânica
 * que ele já conhece da página do empreendimento, com a foto abrindo em tela
 * cheia no clique. O carrossel e o visor vêm de `components/ui`, os mesmos da
 * home e do portfólio, então não há uma segunda implementação para manter.
 *
 * A galeria do ativo já chega sem os itens em vídeo (ver `lib/ativo-lp`), então
 * aqui todo item é foto, e `video` entra nulo só para satisfazer o visor.
 *
 * Os cards não levam sombra projetada. Cada um tinha uma sombra larga (60px de
 * desfoque), e como o carrossel empilha seis deles girados e sobrepostos, as
 * sombras somavam e viravam uma mancha escura atravessando a seção clara. O
 * que dá profundidade aqui é o giro e a escala do próprio carrossel, não a
 * sombra. O fundo da seção é o de sempre, branco com as linhas da marca.
 */
export function GaleriaProva({ ativo }: { ativo: AtivoLp }) {
  const [indice, setIndice] = useState(0);
  const [aberta, setAberta] = useState<number | null>(null);
  const fechar = useCallback(() => setAberta(null), []);

  const fotos = useMemo<Foto[]>(
    () =>
      ativo.galeria.slice(0, MAXIMO_FOTOS).map((f) => ({
        imagem: f.src,
        legenda: f.legenda,
        video: null,
      })),
    [ativo.galeria],
  );

  // Sem galeria cadastrada, a seção não existe. A `galeria` do ativo nunca vem
  // vazia (cai no retrato do hero, para as buscas por legenda das outras seções
  // não quebrarem), e sem esta guarda a página abria uma seção inteira chamada
  // "por dentro" para exibir, em 1/1, a mesma foto que o herói já mostra no
  // alto. Cadastrou fotos no Keystatic, a seção volta sozinha.
  if (!ativo.temGaleria || fotos.length === 0) return null;

  return (
    <SectionShell tone="light" compacto>
      <Reveal>
        <p className="label-editorial text-lp-accent">O projeto</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h2 className="display-editorial text-nexa-ink">
            {ativo.nome} por dentro
          </h2>
          <p className="text-[13px] text-nexa-soft">
            {indice + 1} / {fotos.length} · clique para ampliar
          </p>
        </div>
      </Reveal>

      <Coverflow<Foto>
        itens={fotos}
        chave={(foto) => foto.imagem ?? foto.legenda}
        rotulo={`Imagens do ${ativo.nome}`}
        pausado={aberta !== null}
        setas={false}
        opacidadeLateral={OPACIDADE_LATERAL}
        onCentral={(_, i) => setAberta(i)}
        aoTrocar={setIndice}
      >
        {(foto, { central }) => (
          <div className="group/foto relative h-full w-full overflow-hidden rounded-[var(--radius-brand)] border border-nexa-ink/10 text-left">
            <SeloIlustrativo />
            {foto.imagem && (
              <Image
                src={foto.imagem}
                alt={altFoto(ativo.nome, foto.legenda)}
                fill
                sizes="(min-width: 1024px) 600px, 90vw"
                className="object-cover"
              />
            )}

            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-nexa-ink/90 via-nexa-ink/10 to-transparent"
            />

            {/* a lupa só no card em foco: ampliar já é o gesto esperado */}
            <span
              aria-hidden
              className={`absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/30 bg-nexa-ink/60 text-white backdrop-blur-md transition-opacity duration-300 motion-reduce:transition-none ${
                central ? "opacity-0 group-hover/foto:opacity-100" : "opacity-0"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M11 8v6M8 11h6M16.5 16.5 21 21" />
              </svg>
            </span>

            {foto.legenda && (
              <span className="absolute inset-x-0 bottom-0 block p-5 md:p-6">
                <span className="block text-[15px] font-semibold text-white md:text-lg">
                  {foto.legenda}
                </span>
                <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  {ativo.nome}
                </span>
              </span>
            )}
          </div>
        )}
      </Coverflow>

      <p role="status" aria-live="polite" className="sr-only">
        Imagem {indice + 1} de {fotos.length}: {fotos[indice]?.legenda}
      </p>

      <Visor
        fotos={fotos}
        indice={aberta}
        nome={ativo.nome}
        onFechar={fechar}
        onIr={setAberta}
      />
    </SectionShell>
  );
}
