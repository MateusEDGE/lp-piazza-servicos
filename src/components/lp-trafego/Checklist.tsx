import { Reveal } from "@/components/motion/Reveal";
import { SectionShell } from "@/components/ui/SectionShell";
import type { PublicoLp } from "./types";

/**
 * A checagem do ativo, critério por critério — exclusiva da página do investidor.
 *
 * É a parte que faz o trabalho pesado dessa página: em vez de prometer retorno,
 * percorre a lista que um investidor de varejo já usa para avaliar um strip
 * mall — localização, escala, vagas, mix, ancoragem,
 * perfil da receita, gestão e histórico — e responde cada item com o dado do
 * empreendimento. Quem sabe o que está olhando reconhece a lista; quem não sabe
 * aprende o critério lendo, e passa a comparar os outros ativos por ele.
 *
 * Números de rentabilidade, VGV e ticket não entram aqui por decisão do
 * cliente: são apresentados nominalmente, com as premissas abertas.
 *
 * Ganhou seção própria em 26/08/2026, a pedido do cliente. Estava dentro da
 * ficha, e as duas leituras emendadas viravam um paredão sem respiro.
 *
 * O tom é claro porque a ficha, logo acima, é escura: azul seguido de azul
 * apagava a divisa entre as duas. A página do investidor tem uma seção a mais
 * que as de lojista, e com número ímpar a alternância não fecha em todo lugar —
 * a repetição que sobra foi empurrada para o lado claro, entre esta seção
 * (branco) e a dos pavimentos (cinza claro), onde as duas ainda são cores
 * diferentes e o fio de luz do topo separa uma da outra.
 */
export function Checklist({ publico }: { publico: PublicoLp }) {
  const lista = publico.checklist;
  if (!lista) return null;

  return (
    <SectionShell tone="light" compacto>
      <Reveal>
        <p className="label-editorial text-lp-accent">{lista.rotulo}</p>
        <h2 className="display-editorial mt-4 max-w-3xl text-nexa-ink">
          {lista.titulo}
        </h2>
      </Reveal>

      <ol className="mt-10 divide-y divide-nexa-ink/10 border-y border-nexa-ink/10">
        {lista.itens.map((item, i) => (
          <li key={item.criterio}>
            <Reveal delay={Math.min(i * 0.05, 0.3)}>
              <div className="grid gap-3 py-7 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-10">
                <h3 className="flex items-baseline gap-3">
                  <span className="text-[11px] font-bold tabular-nums tracking-[0.14em] text-lp-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="heading-nexa text-[1.15rem] text-nexa-ink md:text-[1.3rem]">
                    {item.criterio}
                  </span>
                </h3>
                <p className="text-[16px] leading-relaxed text-nexa-soft">
                  {item.resposta}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
