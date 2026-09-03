import { CoverImage } from "@/components/lp/heroes/CoverImage";
import { Reveal } from "@/components/motion/Reveal";
import { PinIcon } from "@/components/ui/PinIcon";
import { SeloIlustrativo } from "@/components/ui/SeloIlustrativo";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { ProvasHero } from "./ProvasHero";
import type { AtivoLp, PublicoLp } from "./types";

/**
 * Hero da landing de tráfego.
 *
 * A ordem é a de uma página de resposta direta: promessa, endereço, ação,
 * prova. O botão principal rola até o formulário em vez de sair da página; o
 * WhatsApp fica ao lado, como segunda via para quem prefere falar agora.
 *
 * Ocupa a tela inteira, como o hero das páginas de empreendimento: era um bloco
 * de altura de conteúdo, e a foto aparecia cortada numa faixa. Quem entra pelo
 * anúncio vê primeiro o projeto, em tela cheia, e o texto por cima.
 *
 * Os números foram para a direita, em cards soltos: como faixa no rodapé do
 * hero eles empurravam a dobra para baixo e brigavam com a foto. À direita eles
 * equilibram o peso do texto e continuam sendo a primeira resposta à pergunta
 * "por que eu deveria acreditar nisso?".
 */
export function HeroLpTrafego({
  publico,
  ativo,
}: {
  publico: PublicoLp;
  ativo: AtivoLp;
}) {
  const { hero } = publico;

  return (
    <section className="relative isolate overflow-hidden bg-nexa-ink text-white">
      <CoverImage src={hero.imagem} />
      <SeloIlustrativo />

      <div className="container-wide relative z-[2] flex min-h-svh flex-col justify-center pb-20 pt-32 md:pb-24 md:pt-36">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <Reveal delay={0.06}>
              <h1 className="heading-nexa text-[clamp(2.1rem,5.6vw,4rem)]">
                {hero.titulo}{" "}
                <span className="text-lp-accent">{hero.acento}.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 text-[17px] leading-relaxed text-white/85 md:text-[18px]">
                {hero.subtitulo}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mt-6 flex items-start gap-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">
                <PinIcon className="mt-0.5 size-4 shrink-0 text-lp-accent" />
                {ativo.endereco}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#formulario"
                  className="btn-shine inline-flex items-center justify-center rounded-[var(--radius-brand)] bg-lp-accent px-[2.2rem] py-[1.2rem] text-center text-[16px] font-semibold uppercase tracking-wider text-lp-accent-contrast transition-colors duration-300 hover:brightness-110"
                >
                  {hero.cta}
                </a>
                <WhatsAppCTA
                  numero={ativo.whatsappNumero}
                  mensagem={publico.whatsapp}
                  variant="outline"
                >
                  WhatsApp
                </WhatsAppCTA>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3} className="lg:shrink-0">
            <ProvasHero provas={publico.provas} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
