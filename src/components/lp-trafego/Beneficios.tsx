import { Reveal } from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/Tilt";
import { SectionShell } from "@/components/ui/SectionShell";
import type { PublicoLp } from "./types";

/**
 * Os argumentos do público, em cards.
 *
 * Cada card abre com o dado que sustenta o argumento — "134 vagas",
 * "Semi-enterrado", "+30 operações" — e só depois vem a frase. É o dado que
 * convence; o texto explica por que ele importa para quem está lendo.
 *
 * O card usa a mecânica dos cards do site: tilt seguindo o cursor e inversão
 * para o azul cheio no hover.
 */
export function Beneficios({
  publico,
  tone = "none",
}: {
  publico: PublicoLp;
  tone?: "none" | "tint";
}) {
  const { beneficios } = publico;
  const escuro = tone === "none";

  return (
    <SectionShell tone={tone} compacto>
      <Reveal>
        <p className="label-editorial text-lp-accent">{beneficios.rotulo}</p>
        <h2
          className={`display-editorial mt-4 max-w-3xl ${escuro ? "text-white" : "text-nexa-ink"}`}
        >
          {beneficios.titulo}
        </h2>
      </Reveal>

      <ul className="mt-12 grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
        {beneficios.itens.map((item, i) => (
          <li key={item.titulo}>
            <Reveal delay={Math.min(i * 0.06, 0.3)} className="h-full">
              <Tilt className="group/ben h-full" grau={14} escala={1.03}>
                <article className={`flex h-full flex-col rounded-[var(--radius-brand)] border p-6 ${escuro ? "border-white/12 bg-white/[0.06] shadow-[0_18px_44px_-26px_rgba(6,10,32,0.95)]" : "border-nexa-ink/8 bg-white shadow-[0_14px_34px_-20px_rgba(14,20,48,0.32)]"} transition-[background-color,border-color,box-shadow] duration-300 group-hover/ben:border-nexa-primary group-hover/ben:bg-nexa-primary group-hover/ben:shadow-[0_28px_60px_-18px_rgba(32,51,153,0.6)] motion-reduce:transition-none md:p-7`}>
                  <p className="heading-nexa-caixa text-[1.35rem] uppercase text-lp-accent transition-colors duration-300 group-hover/ben:text-white motion-reduce:transition-none">
                    {item.dado}
                  </p>
                  <h3
                    className={`mt-4 text-[17px] font-semibold leading-snug ${escuro ? "text-white" : "text-nexa-ink"}`}
                  >
                    {item.titulo}
                  </h3>
                  <p className={`mt-3 text-[15px] leading-relaxed ${escuro ? "text-white/70" : "text-nexa-soft"} transition-colors duration-300 group-hover/ben:text-white/85 motion-reduce:transition-none`}>
                    {item.texto}
                  </p>
                </article>
              </Tilt>
            </Reveal>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
