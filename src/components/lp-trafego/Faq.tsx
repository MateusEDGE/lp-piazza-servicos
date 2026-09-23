import { Reveal } from "@/components/motion/Reveal";
import { SectionShell } from "@/components/ui/SectionShell";
import type { PublicoLp } from "./types";

/**
 * As objeções, respondidas antes de a pessoa desistir.
 *
 * Cada pergunta aqui é uma razão real de não fechar — metragem, exclusividade
 * de segmento, comparação com shopping ou com sala em edifício, quem responde
 * pelo empreendimento. Numa landing de tráfego a objeção não vira e-mail: vira
 * abandono. Por isso ela é respondida na própria página.
 *
 * Vem **depois** do formulário, e não antes (pedido do Mateus em 23/09/2026):
 * quem desce a página já passou pela prova e pelas marcas, e o formulário é o
 * primeiro lugar em que ela pode converter; as objeções ficam para quem ainda
 * não converteu. A seção é clara porque herdou o lugar do formulário na
 * alternância de fundos — inverteu-se o conteúdo, não o fundo.
 *
 * `<details>` nativo de propósito: acordeão sem uma linha de JavaScript,
 * acessível por padrão e com o conteúdo no HTML — o que também deixa as
 * respostas legíveis para quem rastreia a página.
 */
export function Faq({ publico }: { publico: PublicoLp }) {
  return (
    <SectionShell tone="light" compacto>
      <div className="grid-editorial">
        <Reveal>
          <p className="label-editorial text-lp-accent">Dúvidas</p>
        </Reveal>

        <div className="max-w-3xl">
          <Reveal>
            <h2 className="display-editorial text-nexa-ink">{publico.faq.titulo}</h2>
          </Reveal>

          <div className="mt-10 divide-y divide-nexa-ink/10 border-y border-nexa-ink/10">
            {publico.faq.itens.map((item, i) => (
              <Reveal key={item.pergunta} delay={Math.min(i * 0.05, 0.25)}>
                <details className="group/faq py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[17px] font-semibold leading-snug text-nexa-ink marker:content-none [&::-webkit-details-marker]:hidden">
                    {item.pergunta}
                    {/* cruz que vira menos quando abre */}
                    <span
                      aria-hidden
                      className="relative mt-1.5 size-3.5 shrink-0 text-lp-accent"
                    >
                      <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current" />
                      <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-current transition-transform duration-300 group-open/faq:scale-y-0 motion-reduce:transition-none" />
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-nexa-soft">
                    {item.resposta}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
