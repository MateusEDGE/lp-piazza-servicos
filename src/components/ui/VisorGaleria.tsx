"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SeloIlustrativo } from "@/components/ui/SeloIlustrativo";

/**
 * O visor em tela cheia da galeria, compartilhado.
 *
 * Nasceu dentro de `components/lp/Galeria` e saiu de lá quando a galeria das
 * landing pages de tráfego passou a abrir foto também. O Coverflow já tinha
 * ensinado a lição: enquanto houve duas implementações do carrossel, a correção
 * de uma não chegava à outra. Aqui a peça é uma só, e as duas galerias herdam o
 * mesmo teclado, o mesmo Esc e a mesma devolução de foco.
 */
export type Foto = { imagem: string | null; legenda: string; video: string | null };

/**
 * Visor em tela cheia. Navega com as setas do teclado, fecha com Esc, prende o
 * foco no diálogo e devolve o foco à miniatura de origem ao fechar.
 */
export function Visor({
  fotos,
  indice,
  nome,
  onFechar,
  onIr,
}: {
  fotos: Foto[];
  indice: number | null;
  nome: string;
  onFechar: () => void;
  onIr: (i: number) => void;
}) {
  const reduce = useReducedMotion();
  const painelRef = useRef<HTMLDivElement>(null);
  const origemRef = useRef<HTMLElement | null>(null);
  const anterior = useRef<number | null>(null);
  const aberto = indice !== null;

  // de que lado a próxima foto entra: +1 avançando, -1 voltando
  const sentido =
    indice !== null && anterior.current !== null && indice !== anterior.current
      ? indice > anterior.current || (anterior.current === fotos.length - 1 && indice === 0)
        ? 1
        : -1
      : 1;
  if (indice !== null) anterior.current = indice;

  useEffect(() => {
    if (!aberto) return;
    origemRef.current = document.activeElement as HTMLElement | null;
    return () => origemRef.current?.focus?.();
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    const t = requestAnimationFrame(() => painelRef.current?.focus());
    return () => cancelAnimationFrame(t);
  }, [aberto]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (indice === null) return;
    if (e.key === "Escape") return onFechar();
    if (e.key === "ArrowRight") return onIr((indice + 1) % fotos.length);
    if (e.key === "ArrowLeft")
      return onIr((indice - 1 + fotos.length) % fotos.length);
  };

  const foto = indice !== null ? fotos[indice] : null;

  /* o mesmo botão nas duas molduras, foto e vídeo */
  const botaoFechar = (
    <button
      type="button"
      onClick={onFechar}
      aria-label="Fechar galeria"
      className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full border border-white/30 bg-nexa-ink/70 text-xl text-white backdrop-blur-md transition-colors duration-300 hover:border-white hover:bg-nexa-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <span aria-hidden>×</span>
    </button>
  );

  return (
    <AnimatePresence>
      {foto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onKeyDown={onKeyDown}
        >
          <motion.div
            aria-hidden
            onClick={onFechar}
            className="absolute inset-0 bg-nexa-ink/95 backdrop-blur-md"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          <motion.div
            ref={painelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${foto.legenda || nome}, ${foto.video ? "vídeo" : "imagem"} ${indice! + 1} de ${fotos.length}`}
            tabIndex={-1}
            className="relative w-full max-w-6xl focus:outline-none"
            initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* A peça em vídeo é vertical, então ela ganha moldura própria em vez
                de ficar numa tira estreita no meio de um quadro 16/9.

                Aqui quem dimensiona a moldura é o próprio vídeo, limitado pela
                altura da tela: ele tem proporção intrínseca, então o navegador
                resolve a largura sem cálculo nosso e sem sobra nas laterais. Uma
                caixa com `aspect-ratio` e largura automática não serviria, porque
                em bloco a largura automática enche o pai e a tira voltaria.

                O vídeo também fica fora do embrulho de transição: aquele
                embrulho é posicionado por cima, e o que é posicionado por cima
                não dimensiona o pai. A foto continua com ele. */}
            {foto.video ? (
              <div className="relative mx-auto w-fit overflow-hidden rounded-[var(--radius-brand)] bg-nexa-ink ring-1 ring-white/15">
                {/* acima da barra de controles do vídeo, que ocupa a base */}
                <SeloIlustrativo className="bottom-14 md:bottom-16" />
                {/* Toca sozinho ao abrir, porque abrir o visor já foi o clique de
                    play. Sem `muted` não tocaria: navegador só libera autoplay
                    sem som, e os controles ficam à mão para ligar o áudio. */}
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  key={foto.video}
                  src={foto.video}
                  poster={foto.imagem ?? undefined}
                  controls
                  autoPlay
                  muted
                  playsInline
                  className="block max-h-[76svh] max-w-full"
                />
                {botaoFechar}
              </div>
            ) : (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-brand)] bg-nexa-ink ring-1 ring-white/15">
                <SeloIlustrativo />
                {/* Troca de foto: a que sai apaga deslizando um pouco para o lado
                    de onde veio o comando, a que entra faz o caminho oposto. As
                    duas ficam empilhadas no mesmo lugar, então o deslize é curto
                    e serve só para indicar a direção — quem carrega a transição é
                    o cruzamento das opacidades. */}
                <AnimatePresence initial={false}>
                  <motion.div
                    key={indice}
                    className="absolute inset-0"
                    initial={
                      reduce ? { opacity: 0 } : { opacity: 0, x: sentido > 0 ? 44 : -44 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    exit={
                      reduce ? { opacity: 0 } : { opacity: 0, x: sentido > 0 ? -44 : 44 }
                    }
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {foto.imagem && (
                      <Image
                        src={foto.imagem}
                        alt={foto.legenda || nome}
                        fill
                        sizes="(min-width: 1280px) 1152px, 100vw"
                        className="object-contain"
                        priority
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {botaoFechar}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white">
                {foto.legenda}
              </p>
              <p className="text-[13px] tabular-nums text-white/60">
                {indice! + 1} / {fotos.length}
              </p>
            </div>

            {/* navegação */}
            <button
              type="button"
              onClick={() => onIr((indice! - 1 + fotos.length) % fotos.length)}
              aria-label="Item anterior da galeria"
              className="absolute left-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-nexa-ink/70 text-lg text-white backdrop-blur-md transition-colors duration-300 hover:border-white hover:bg-nexa-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:-left-16"
            >
              <span aria-hidden>←</span>
            </button>
            <button
              type="button"
              onClick={() => onIr((indice! + 1) % fotos.length)}
              aria-label="Próximo item da galeria"
              className="absolute right-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-nexa-ink/70 text-lg text-white backdrop-blur-md transition-colors duration-300 hover:border-white hover:bg-nexa-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:-right-16"
            >
              <span aria-hidden>→</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
