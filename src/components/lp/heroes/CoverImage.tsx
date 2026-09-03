"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Capa de empreendimento: dolly-in guiado pelo scroll.
 *
 * A home "entra" no empreendimento scrubando um vídeo de câmera com o scroll
 * (ver HeroScrolly). Aqui a foto é estática, então a mesma sensação vem de um
 * avanço de câmera: ao rolar, a imagem cresce e sobe um pouco, como se o
 * enquadramento entrasse no projeto.
 *
 * Camadas:
 *   1. dolly-in + parallax — escala e deslocamento guiados pelo scroll. Só
 *      `transform`, roda no compositor.
 *   2. overlay institucional a 150° — dá contraste para a tipografia.
 *   3. vinheta + base escurecida — fecham as bordas e assentam o conteúdo.
 *
 * `src` chega já resolvido do servidor (foto ou placeholder de marca), para o
 * gerador de SVG não ir para o bundle do cliente.
 */
export function CoverImage({
  src,
  unoptimized = false,
}: {
  src: string;
  unoptimized?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // o avanço de câmera: cresce ao rolar, como se entrasse no empreendimento
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1.34]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y, scale, willChange: "transform" }}
      >
        {/* sem scroll a imagem já nasce com folga, para o deslocamento não
            revelar faixa vazia na base */}
        <div className={`relative size-full ${reduce ? "scale-[1.06]" : ""}`}>
          <Image
            src={src}
            alt=""
            fill
            priority
            unoptimized={unoptimized}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </motion.div>

      {/* overlay institucional: contraste para o texto sem apagar o projeto */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(150deg, rgba(16,26,77,0.82) 0%, rgba(27,44,119,0.52) 45%, rgba(14,20,48,0.9) 100%)",
        }}
      />

      {/* vinheta: fecha as bordas e empurra o centro para o fundo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 80% at 50% 42%, transparent 35%, rgba(14,20,48,0.5) 100%)",
        }}
      />

      {/* base escurecida: o conteúdo assenta sobre um plano mais próximo */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            "linear-gradient(to top, rgba(14,20,48,0.88) 0%, rgba(14,20,48,0.35) 55%, transparent 100%)",
        }}
      />
    </div>
  );
}
