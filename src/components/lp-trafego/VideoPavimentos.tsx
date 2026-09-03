"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SeloIlustrativo } from "@/components/ui/SeloIlustrativo";

/**
 * O vídeo do projeto na seção de pavimentos, com visor próprio.
 *
 * A peça é vertical, e o visor da galeria não servia: ele abre em quadro cheio
 * e os controles nativos ainda ofereciam tela cheia, que deitava o vídeo na
 * horizontal com tarja preta dos dois lados. Aqui não há tela cheia em lugar
 * nenhum, nem no card nem no visor — o vídeo é vertical do começo ao fim.
 *
 * Os controles são nossos, e não os do navegador. O Chrome desenha um botão de
 * tela cheia nos controles nativos e ignora `controlsList="nofullscreen"`, o
 * que reabriria justamente a porta que precisa ficar fechada. A barra repete
 * nos dois lugares: tocar, progresso, som e ampliar (ou reduzir).
 *
 * Ampliar quer dizer crescer um pouco e ganhar o centro da tela, com o resto da
 * página desfocada por trás. Não é tela cheia: o vídeo continua limitado pela
 * altura da janela e mantém a proporção.
 *
 * O visor sai por um portal no `body`, e não no lugar onde este componente vive.
 * O card fica dentro de um `Reveal`, que anima com `transform`, e um ancestral
 * transformado passa a ser o quadro de referência do `position: fixed` — o
 * visor abria encostado à direita em vez de no centro da janela. Pelo portal
 * ele fica fora dessa árvore e centraliza na tela, esteja o card onde estiver.
 */
export function VideoPavimentos({
  src,
  capa,
  nome,
}: {
  src: string;
  capa: string;
  nome: string;
}) {
  const [aberto, setAberto] = useState(false);
  const [montado, setMontado] = useState(false);
  const reduce = useReducedMotion();
  const painelRef = useRef<HTMLDivElement>(null);
  const origemRef = useRef<HTMLElement | null>(null);
  const fechar = useCallback(() => setAberto(false), []);

  useEffect(() => setMontado(true), []);

  // devolve o foco ao card ao fechar, e prende a rolagem enquanto está aberto
  useEffect(() => {
    if (!aberto) return;
    origemRef.current = document.activeElement as HTMLElement | null;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = requestAnimationFrame(() => painelRef.current?.focus());
    return () => {
      document.body.style.overflow = anterior;
      cancelAnimationFrame(t);
      origemRef.current?.focus?.();
    };
  }, [aberto]);

  const visor = (
    <AnimatePresence>
      {aberto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onKeyDown={(e) => e.key === "Escape" && fechar()}
        >
          <motion.div
            aria-hidden
            onClick={fechar}
            className="absolute inset-0 bg-nexa-ink/90 backdrop-blur-xl"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          <motion.div
            ref={painelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Vídeo do projeto do ${nome}`}
            tabIndex={-1}
            className="relative focus:outline-none"
            initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Quem dimensiona a moldura é o próprio vídeo, limitado pela
                altura da janela: com proporção intrínseca o navegador resolve a
                largura, e não sobra tarja nas laterais. */}
            <Quadro
              src={src}
              capa={capa}
              nome={nome}
              classeVideo="block max-h-[84svh] w-auto cursor-pointer"
              classeMoldura="relative w-fit overflow-hidden rounded-[var(--radius-brand)] bg-nexa-ink ring-1 ring-white/15"
              acaoTamanho={{
                rotulo: "Reduzir o vídeo",
                ao: fechar,
                icone: "reduzir",
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Quadro
        src={src}
        capa={capa}
        nome={nome}
        classeVideo="block aspect-[9/16] w-full cursor-pointer object-cover"
        classeMoldura="relative mx-auto w-full max-w-[24rem] overflow-hidden rounded-[var(--radius-brand)] border-4 border-white shadow-[0_22px_54px_rgba(14,20,48,0.3)]"
        acaoTamanho={{
          rotulo: `Ampliar o vídeo do projeto do ${nome}`,
          ao: () => setAberto(true),
          icone: "ampliar",
        }}
      />

      {montado ? createPortal(visor, document.body) : null}
    </>
  );
}

/**
 * A moldura do vídeo com a barra de controles.
 *
 * A mesma peça serve o card e o visor: muda o tamanho da moldura e o que o
 * botão da direita faz — ampliar num, reduzir no outro. Cada moldura guarda o
 * seu próprio estado de reprodução, de propósito: pausar no card não deve
 * pausar o que está aberto, nem o contrário.
 *
 * `disablePictureInPicture` fecha a última porta que deitaria a peça: a janela
 * flutuante, que o navegador oferece pelo menu de contexto.
 *
 * Nasce sempre mudo, nos dois lugares. Nenhum navegador deixa um vídeo tocar
 * sozinho com som, então abrir o visor com áudio ligado só fazia a peça nascer
 * travada. O botão de som liga quando a pessoa quiser.
 */
function Quadro({
  src,
  capa,
  nome,
  classeVideo,
  classeMoldura,
  acaoTamanho,
}: {
  src: string;
  capa: string;
  nome: string;
  classeVideo: string;
  classeMoldura: string;
  acaoTamanho: { rotulo: string; ao: () => void; icone: "ampliar" | "reduzir" };
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [tocando, setTocando] = useState(true);
  const [mudo, setMudo] = useState(true);
  const [progresso, setProgresso] = useState(0);
  /** o `play()` em andamento, enquanto ele não resolve */
  const pendente = useRef<Promise<void> | null>(null);

  /**
   * Tocar e pausar sem corrida.
   *
   * `play()` devolve uma promessa que só resolve quando a reprodução começa de
   * fato. Pausar antes disso faz a promessa rejeitar com `AbortError`, e sem
   * ninguém tratando ela o erro sobe como falha da página — era o que
   * acontecia ao clicar no vídeo logo depois de a seção aparecer, com o
   * autoplay ainda em curso. Aqui a pausa espera o play terminar, e a rejeição
   * é engolida: um vídeo que não pôde tocar não é erro de aplicação.
   */
  const alternarPlay = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      const p = v.play();
      if (p) {
        pendente.current = p;
        p.catch(() => {}).finally(() => {
          pendente.current = null;
        });
      }
    } else if (pendente.current) {
      pendente.current.then(() => v.pause()).catch(() => {});
    } else {
      v.pause();
    }
  }, []);

  const botao =
    "flex size-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-nexa-ink/70 text-white backdrop-blur-md transition-colors duration-300 hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none";

  return (
    <div className={classeMoldura}>
      {/* acima da barra de controles, que ocupa a base */}
      <SeloIlustrativo className="bottom-16" />
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={ref}
        src={src}
        poster={capa || undefined}
        autoPlay
        loop
        playsInline
        muted={mudo}
        disablePictureInPicture
        onClick={alternarPlay}
        onPlay={() => setTocando(true)}
        onPause={() => setTocando(false)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration) setProgresso((v.currentTime / v.duration) * 100);
        }}
        aria-label={`Vídeo do projeto do ${nome}`}
        className={classeVideo}
      />

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 bg-gradient-to-t from-nexa-ink/90 to-transparent px-3 pb-3 pt-10 md:gap-3 md:px-4 md:pb-4">
        <button
          type="button"
          onClick={alternarPlay}
          aria-label={tocando ? "Pausar o vídeo" : "Tocar o vídeo"}
          className={botao}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
            {tocando ? (
              <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
            ) : (
              <path d="M8 5.5v13l11-6.5z" />
            )}
          </svg>
        </button>

        <span
          aria-hidden
          className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
        >
          <span
            className="block h-full rounded-full bg-lp-accent"
            style={{ width: `${progresso}%` }}
          />
        </span>

        <button
          type="button"
          onClick={() => setMudo((m) => !m)}
          aria-label={mudo ? "Ligar o som" : "Desligar o som"}
          className={botao}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
            {mudo ? (
              <path d="M16 9l5 6M21 9l-5 6" fill="none" />
            ) : (
              <path d="M16.5 8.5a5 5 0 0 1 0 7" fill="none" />
            )}
          </svg>
        </button>

        <button
          type="button"
          onClick={acaoTamanho.ao}
          aria-label={acaoTamanho.rotulo}
          className={botao}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {acaoTamanho.icone === "ampliar" ? (
              <path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5" />
            ) : (
              <path d="M9 4v5H4M15 20v-5h5M15 4v5h5M9 20v-5H4" />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
