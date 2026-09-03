import { Reveal } from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/Tilt";
import { SectionShell } from "@/components/ui/SectionShell";
import type { PublicoLp } from "./types";

/**
 * Ficha do ativo — os dados duros, sem adjetivo.
 *
 * A ficha é a mesma nas quatro páginas, variando só o campo que interessa a
 * cada público (o pavimento dele, ou a fatia já comercializada, no caso do
 * investidor).
 *
 * Os dados eram células coladas por um fio de 1px, formando um painel único.
 * Viraram cards soltos, cada um com a mecânica 3D do resto do site: é a mesma
 * leitura, mas cada número passa a ser uma peça, e não uma linha de tabela.
 */
export function FichaAtivo({
  publico,
  tone = "none",
}: {
  publico: PublicoLp;
  tone?: "none" | "tint";
}) {
  const escuro = tone === "none";
  return (
    <SectionShell tone={tone} compacto>
      <Reveal>
        <p className="label-editorial text-lp-accent">Ficha técnica</p>
        <h2
          className={`display-editorial mt-4 ${escuro ? "text-white" : "text-nexa-ink"}`}
        >
          {publico.ficha.titulo}
        </h2>
      </Reveal>

      <dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {publico.ficha.itens.map((item, i) => (
          <Reveal key={item.label} delay={Math.min(i * 0.05, 0.3)}>
            <Tilt className="group/ficha h-full" grau={12} escala={1.03}>
              <div className={`flex h-full flex-col items-center justify-between gap-3 rounded-[var(--radius-brand)] border px-5 py-6 text-center transition-[background-color,border-color] duration-300 motion-reduce:transition-none md:px-6 md:py-7 ${escuro ? "border-white/12 bg-white/[0.06] shadow-[0_18px_44px_-26px_rgba(6,10,32,0.95)] backdrop-blur-sm group-hover/ficha:border-white/30 group-hover/ficha:bg-white/[0.1]" : "border-nexa-ink/8 bg-white shadow-[0_14px_34px_-20px_rgba(14,20,48,0.32)] group-hover/ficha:border-nexa-ink/20"}`}>
                <dt
                  className={`text-[11px] font-bold uppercase leading-snug tracking-[0.16em] ${escuro ? "text-white/50" : "text-nexa-mist"}`}
                >
                  {item.label}
                </dt>
                <dd
                  className={`heading-nexa-caixa text-[1.5rem] leading-tight md:text-[1.7rem] ${escuro ? "text-white" : "text-lp-accent"}`}
                >
                  {item.valor}
                </dd>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </dl>
    </SectionShell>
  );
}
