import { Reveal } from "@/components/motion/Reveal";
import { SectionShell } from "@/components/ui/SectionShell";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import type { AtivoLp, PublicoLp } from "./types";

/**
 * Último chamado, depois das objeções respondidas.
 *
 * Fecha com o mesmo argumento de urgência do hero — e ele é fato, não retórica:
 * metade do empreendimento foi comercializada antes do início da obra, e isso
 * está no CMS. Escassez inventada queima a marca no primeiro contato com o
 * comercial.
 */
export function FechamentoLp({
  publico,
  ativo,
}: {
  publico: PublicoLp;
  ativo: AtivoLp;
}) {
  const { fechamento } = publico;

  return (
    <SectionShell tone="none" compacto>
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          {/* A pontuação final vem na copy, não daqui: a página do investidor
              fecha em exclamação, e um ponto fixo no componente produziria
              "investidores!." */}
          <h2 className="display-editorial text-white">
            {fechamento.titulo}{" "}
            <span className="text-lp-accent">{fechamento.acento}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-white/80">
            {fechamento.texto}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#formulario"
              className="btn-shine inline-flex items-center justify-center rounded-[var(--radius-brand)] bg-lp-accent px-[2.7rem] py-[1.5rem] text-[18px] font-semibold uppercase tracking-wider text-lp-accent-contrast transition-[filter] duration-300 hover:brightness-110 motion-reduce:transition-none"
            >
              {fechamento.cta}
            </a>
            <WhatsAppCTA
              numero={ativo.whatsappNumero}
              mensagem={publico.whatsapp}
              variant="outline"
              tamanho="grande"
            >
              WhatsApp
            </WhatsAppCTA>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
