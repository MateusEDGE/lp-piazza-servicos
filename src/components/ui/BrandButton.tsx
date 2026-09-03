import Link from "next/link";
import type { ReactNode } from "react";
import { Tilt } from "@/components/motion/Tilt";

type BrandButtonProps = {
  href: string;
  children: ReactNode;
  /** solid = azul; knock = branco/texto azul (fundos escuros); outline = contorno branco */
  variant?: "solid" | "knock" | "outline";
  /** grande é o botão de fechamento das páginas, que carrega a conversão */
  tamanho?: "padrao" | "grande";
  external?: boolean;
  className?: string;
};

const VARIANTS = {
  solid: "bg-nexa-primary text-white hover:bg-nexa-bright",
  knock: "bg-white text-nexa-primary hover:bg-nexa-tertiary",
  outline:
    "border border-white/60 text-white hover:border-white hover:bg-white/10",
};

/** Medidas 20% acima do que eram, para o botão pesar mais na página. */
const TAMANHOS = {
  padrao: "gap-2.5 px-[1.8rem] py-[1.05rem] text-[16.8px]",
  grande:
    "gap-3 px-[2.7rem] py-[1.5rem] text-[18px] md:px-[3.3rem] md:py-[1.68rem] md:text-[19.2px]",
};

export function BrandButton({
  href,
  children,
  variant = "solid",
  tamanho = "padrao",
  external,
  className = "",
}: BrandButtonProps) {
  const cls = `btn-shine inline-flex items-center justify-center rounded-[var(--radius-brand)] font-semibold uppercase tracking-wider transition-colors duration-300 ${TAMANHOS[tamanho]} ${VARIANTS[variant]} ${className}`;

  // o mesmo giro que segue o cursor dos cards de números da home
  return (
    <Tilt className="inline-block">
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {children}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {children}
        </Link>
      )}
    </Tilt>
  );
}
