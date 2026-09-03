"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import type { ReactNode } from "react";

/** Mesmos valores de mola do card de números da home, para o efeito casar. */
const SPRING = { stiffness: 200, damping: 20, mass: 0.5 };

/**
 * Tilt 3D que segue o cursor, com escala sutil — o efeito dos cards de números
 * da home (ver NumerosSection), extraído para reuso.
 *
 * Só o giro e a escala vivem aqui; cor, borda e brilho ficam no filho, que
 * reage via `group-hover`. Desliga inteiro com `prefers-reduced-motion` ou
 * `enabled={false}`, e reseta no blur para não ficar torto após navegar por
 * teclado.
 */
export function Tilt({
  children,
  className = "",
  enabled = true,
  /** graus de giro no eixo Y (o eixo X usa 3/4 disso).
   * O padrão 24 reproduz exatamente o card de números da home: ±12° em Y,
   * ±9° em X. */
  grau = 24,
  escala = 1.05,
}: {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
  grau?: number;
  escala?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const ativo = enabled && !reduce;

  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const scale = useSpring(1, SPRING);

  function seguir(e: React.MouseEvent) {
    const el = ref.current;
    if (!ativo || !el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotateY.set((px - 0.5) * grau);
    rotateX.set((0.5 - py) * grau * 0.75);
    scale.set(escala);
  }

  function repousar() {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }

  if (!ativo) return <div className={className}>{children}</div>;

  /**
   * `relative hover:z-20` vem antes do className de fora e resolve a sobreposição.
   *
   * O elemento cresce 5% no hover e passa por cima do vizinho, mas sem subir na
   * pilha quem é desenhado depois no documento fica por cima — e o card ampliado
   * aparece cortado pelo de trás. O `relative` existe porque z-index só vale em
   * elemento posicionado, e aqui o filho do grid é o `li`, não este div.
   */
  return (
    <motion.div
      ref={ref}
      onMouseMove={seguir}
      onMouseLeave={repousar}
      onBlur={repousar}
      style={{ rotateX, rotateY, scale, transformPerspective: 900 }}
      className={`relative hover:z-20 ${className}`}
    >
      {children}
    </motion.div>
  );
}
