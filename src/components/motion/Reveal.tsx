"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      // Só acende, não sobe.
      //
      // O deslocamento de 24px era invisível na rolagem devagar, mas aparecia
      // inteiro ao chegar por âncora: o menu leva a pessoa até a seção e, no
      // instante em que ela chega, todos os blocos em vista começam a subir ao
      // mesmo tempo, cada um com o seu atraso. Lê-se como a página se
      // arrumando sozinha depois que já parou, que é o oposto do que uma
      // âncora promete.
      //
      // A opacidade sozinha dá a mesma entrada sem mover nada de lugar, e
      // combina com a régua da marca: cor e profundidade antes de movimento.
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
