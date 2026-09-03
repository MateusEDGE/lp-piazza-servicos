import { Reveal } from "@/components/motion/Reveal";
import { SectionShell } from "@/components/ui/SectionShell";
import { linksMapa } from "@/lib/mapa";
import type { AtivoLp } from "./types";

/**
 * Onde o ativo fica, no lugar da galeria.
 *
 * Existe por duas razões, e as duas importam.
 *
 * A primeira é de conteúdo: quem procura ponto comercial decide por endereço
 * antes de decidir por foto, e a landing não dizia onde o empreendimento fica
 * em lugar nenhum, fora a linha da ficha técnica.
 *
 * A segunda é estrutural. A galeria só aparece quando há fotos cadastradas, e
 * uma corrente de fundos alternados com um elo a menos produz sempre exatamente
 * um par de fundos iguais colados. Esta seção é clara como a galeria e ocupa o
 * mesmo lugar dela, então o ativo sem foto mantém o mesmo número de seções e a
 * alternância continua fechando sozinha.
 */
export function LocalizacaoLp({ ativo }: { ativo: AtivoLp }) {
  if (!ativo.endereco) return null;

  // O embed sai do endereço normalizado, e não do campo do CMS: é o que
  // garante o pino no ponto certo em vez de uma região genérica.
  const mapa = linksMapa(ativo.endereco);

  return (
    <SectionShell tone="light" compacto>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-16">
        <Reveal>
          <p className="label-editorial text-lp-accent">Localização</p>
          <h2 className="display-editorial mt-4 text-nexa-ink">Onde fica</h2>
          <p className="mt-6 text-[17px] leading-relaxed text-nexa-soft">
            {ativo.endereco}
          </p>
          {/* Mapa sem saída obriga a copiar o endereço à mão. Estes dois levam
              para fora, onde se traça a rota e se vê o entorno. */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={mapa.rota}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-[var(--radius-brand)] bg-lp-accent px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-lp-accent-contrast transition-opacity duration-300 hover:opacity-90"
            >
              Traçar rota
            </a>
            <a
              href={mapa.abrir}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-[var(--radius-brand)] border border-nexa-ink/20 px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-nexa-ink transition-colors duration-300 hover:bg-nexa-ink/[0.04]"
            >
              Abrir no Google Maps
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-[var(--radius-brand)] border-4 border-white shadow-[0_22px_54px_rgba(14,20,48,0.3)]">
              <iframe
                src={mapa.embed}
                title={`Mapa: ${ativo.nome}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[20rem] w-full md:h-[26rem]"
              />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
