import { Reveal } from "@/components/motion/Reveal";
import { SectionShell } from "@/components/ui/SectionShell";
import type { PublicoLp } from "./types";

/**
 * O bloco de problema, logo depois do hero.
 *
 * Antes de listar vantagem, a página nomeia a dor que o público já vive — é o
 * que faz o leitor reconhecer que a página foi escrita para ele e continuar
 * rolando. A "virada" fecha o bloco em uma linha só, com o acento, e é a ponte
 * para a seção de argumentos.
 *
 * O tom vem de fora porque é ele que fecha a alternância da página. As landings
 * de lojista têm dez seções e alternam sozinhas a partir do claro; a do
 * investidor tem onze, e com número ímpar a conta só fecha se ela começar pelo
 * escuro. Esta é a única seção com tom variável, e é o suficiente: ver a ordem
 * montada em PaginaLpTrafego.
 *
 * O escuro é `none`, e não `dark`: `none` é transparente e deixa passar o fundo
 * fixo da página, que é o azul-noite com a treliça parada. É o mesmo azul de
 * todas as outras seções escuras da landing. O `dark` seria um azul mais claro,
 * com treliça própria e animada, e destoaria logo na primeira dobra.
 */
export function BlocoDor({
  publico,
  tone = "light",
}: {
  publico: PublicoLp;
  tone?: "light" | "none";
}) {
  const { dor } = publico;
  const escuro = tone === "none";

  return (
    <SectionShell tone={tone} compacto>
      <div className="grid-editorial">
        <Reveal>
          <p className="label-editorial text-lp-accent">{dor.rotulo}</p>
        </Reveal>

        <div className="max-w-3xl">
          <Reveal>
            <h2
              className={`display-editorial ${escuro ? "text-white" : "text-nexa-ink"}`}
            >
              {dor.titulo}
            </h2>
          </Reveal>

          {dor.paragrafos.map((p, i) => (
            <Reveal key={p.slice(0, 32)} delay={0.08 + i * 0.06}>
              <p
                className={`mt-6 text-[17px] leading-relaxed ${escuro ? "text-white/80" : "text-nexa-soft"}`}
              >
                {p}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.24}>
            <p
              className={`mt-9 border-l-2 border-lp-accent pl-5 text-[19px] font-semibold leading-snug md:text-[22px] ${escuro ? "text-white" : "text-nexa-ink"}`}
            >
              {dor.virada}
            </p>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
