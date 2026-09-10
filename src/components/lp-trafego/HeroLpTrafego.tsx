import { CoverImage } from "@/components/lp/heroes/CoverImage";
import { Reveal } from "@/components/motion/Reveal";
import { PinIcon } from "@/components/ui/PinIcon";
import { SeloIlustrativo } from "@/components/ui/SeloIlustrativo";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { ProvasHero } from "./ProvasHero";
import { VideoPavimentos } from "./VideoPavimentos";
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
 *
 * **Há uma segunda montagem, para quando `hero.tituloVideo` existe:** o vídeo
 * do projeto toma o lugar dos números, e o parágrafo de apoio sai. É a página
 * do investidor. O vídeo entrega o conjunto do ativo em segundos, coisa que
 * nenhuma foto parada entrega, e é a prova mais forte que a página tem — mas
 * dois blocos de prova no mesmo canto só dividiriam a atenção de quem acabou
 * de chegar, então os números ficam na ficha do ativo. O subtítulo sai pelo
 * mesmo motivo: com o vídeo ao lado, ele disputava a primeira tela.
 *
 * **Nessa variante a montagem é uma grade, e não duas colunas soltas, por
 * causa do celular.** Ali tudo vira uma coluna só, e a ordem é promessa,
 * vídeo, endereço e botões — o vídeo entra no meio do texto, não depois dele.
 * Com duas colunas em `flex` isso não se escreve: o vídeo estaria em outro
 * contêiner e só poderia cair antes ou depois do bloco de texto inteiro. Na
 * grade cada peça é um item próprio: no celular empilham na ordem do código, e
 * no desktop as de texto voltam para a coluna da esquerda enquanto o vídeo
 * ocupa a da direita, atravessando as duas linhas.
 */
export function HeroLpTrafego({
  publico,
  ativo,
}: {
  publico: PublicoLp;
  ativo: AtivoLp;
}) {
  const { hero } = publico;
  // Guardado como valor, e não como booleano: assim o TypeScript sabe que
  // `videoDoHero.src` existe dentro do ramo, sem asserção não-nula.
  const videoDoHero = hero.tituloVideo ? ativo.video : null;

  const endereco = (
    <Reveal delay={0.18}>
      <p className="mt-6 flex items-start gap-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">
        <PinIcon className="mt-0.5 size-4 shrink-0 text-lp-accent" />
        {ativo.endereco}
      </p>
    </Reveal>
  );

  const acoes = (
    <Reveal delay={0.24}>
      {/* No celular os dois botões nascem com larguras diferentes; em coluna
          cada um fica do tamanho do seu texto e os dois se lêem como um par. */}
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
  );

  const promessa = (
    <Reveal delay={0.06}>
      <h1 className="heading-nexa text-[clamp(2.1rem,5.6vw,4rem)]">
        {hero.titulo} <span className="text-lp-accent">{hero.acento}.</span>
      </h1>
    </Reveal>
  );

  if (videoDoHero) {
    return (
      <section className="relative isolate overflow-hidden bg-nexa-ink text-white">
        <CoverImage src={hero.imagem} />
        <SeloIlustrativo />

        <div className="container-wide relative z-[2] grid min-h-svh content-center gap-y-10 pb-20 pt-32 md:pb-24 md:pt-36 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-x-16 lg:gap-y-6">
          <div className="max-w-2xl lg:col-start-1 lg:row-start-1">{promessa}</div>

          {/* O vídeo é vertical e tem visor próprio (ver VideoPavimentos).
              19rem é a largura que os cards de números ocupavam, para o
              equilíbrio do hero não mudar — mas ela é um teto, e não uma medida
              fixa: em 9:16 cada rem de largura custa quase dois de altura, e
              numa janela baixa a peça inteira empurrava o hero para fora da
              primeira tela. O `min` desconta do viewport o que o hero já gasta
              em respiro e no título (17rem, folgado) e converte o que sobra em
              largura pela proporção do vídeo. Em tela alta vale o teto; em tela
              baixa o vídeo encolhe e a dobra continua inteira. */}
          <Reveal
            delay={0.2}
            className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:w-[min(19rem,calc((100svh_-_17rem)_*_0.5625))] lg:shrink-0"
          >
            <h2 className="heading-nexa mb-4 text-center text-[1.1rem] tracking-[0.06em] text-white md:text-[1.25rem]">
              {hero.tituloVideo}
            </h2>
            <VideoPavimentos
              src={videoDoHero.src}
              capa={videoDoHero.capa}
              nome={ativo.nome}
            />
          </Reveal>

          <div className="max-w-2xl lg:col-start-1 lg:row-start-2">
            {endereco}
            {acoes}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden bg-nexa-ink text-white">
      <CoverImage src={hero.imagem} />
      <SeloIlustrativo />

      <div className="container-wide relative z-[2] flex min-h-svh flex-col justify-center pb-20 pt-32 md:pb-24 md:pt-36">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            {promessa}

            <Reveal delay={0.12}>
              <p className="mt-6 text-[17px] leading-relaxed text-white/85 md:text-[18px]">
                {hero.subtitulo}
              </p>
            </Reveal>

            {endereco}
            {acoes}
          </div>

          <Reveal delay={0.3} className="lg:shrink-0">
            <ProvasHero provas={publico.provas} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
