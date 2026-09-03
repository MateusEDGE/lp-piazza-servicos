import type { ReactNode } from "react";
import { NexaMarkOutline } from "./NexaMarkOutline";

type Tone = "light" | "tint" | "dark" | "deep" | "none";

type SectionShellProps = {
  children: ReactNode;
  id?: string;
  /**
   * light = branco; tint = cinza claro; dark = azul institucional;
   * deep = azul-noite; none = transparente, para deixar passar um fundo fixo
   * de página (ver NexaBackdrop)
   */
  tone?: Tone;
  /** desliga o grafismo de marca quando a seção já tem imagem própria */
  semGrafismo?: boolean;
  /**
   * Desliga o fio de luz do topo.
   *
   * O fio marca onde uma seção começa, e serve enquanto a divisa é reta. Quando
   * a seção vizinha é recortada em diagonal, ele vira uma linha horizontal
   * atravessando a cunha, contradizendo o corte — aí sai.
   */
  semFio?: boolean;
  /**
   * Recorta a seção em cunha, no topo e no pé, cortando as vizinhas.
   *
   * É a divisa que as landings de tráfego já usavam. Nas páginas de
   * empreendimento ela é **exceção, não ritmo**: vale só na seção de hubs, que
   * é a que se conversa com a página de hubs da landing. Aplicada a todas as
   * seções claras, o corte deixa de ser gesto e vira um ziguezague ao longo da
   * página inteira, onde nenhuma divisa chama atenção porque todas chamam.
   * Só faz sentido numa seção clara entre duas escuras (ou o contrário),
   * porque é o contraste que desenha a cunha.
   *
   * Depende de `--corte` estar declarado em algum ancestral, que é a altura da
   * diagonal. Sem ele o recorte vira zero e a seção fica reta, sem quebrar.
   *
   * Implica `semFio`: o fio de luz do topo viraria uma linha horizontal
   * atravessando a cunha, contradizendo o corte.
   */
  diagonal?: boolean;
  /** respiro ~15% menor, usado nas páginas de empreendimento */
  compacto?: boolean;
  /** grafismo parado: mesma composição, sem respirar nem derivar */
  estatico?: boolean;
  className?: string;
};

/**
 * Invólucro de seção. Nenhum tom é cor chapada: cada um recebe um degradê base,
 * brilhos radiais e um fio de luz no topo, para as seções terem plano de fundo e
 * plano de frente em vez de blocos planos empilhados.
 *
 * Os degradês vão em `style` de propósito: como valor arbitrário de classe
 * dependeriam de escapar espaço por underscore, e um erro ali falha em silêncio.
 */
const FUNDOS: Record<Tone, React.CSSProperties> = {
  // transparente de propósito: quem pinta é o fundo fixo da página
  none: {},
  light: {
    backgroundImage: [
      "radial-gradient(ellipse 60% 45% at 12% 0%, rgba(32,51,153,0.11), transparent 68%)",
      "radial-gradient(ellipse 55% 40% at 92% 100%, rgba(59,84,201,0.1), transparent 68%)",
      // O brilho branco elíptico do meio saiu daqui.
      //
      // Ele existia para clarear o centro da seção, e já tinha sido suavizado
      // uma vez porque a borda da elipse desenhava um anel: uma faixa
      // horizontal de branco diferente atravessando a seção. Suavizar não
      // resolve, só empurra a borda. Elipse tem borda, e numa seção alta ela
      // cai dentro da área visível: é a "diferença de cor no fundo" que
      // aparecia perto do pé das seções claras.
      //
      // O clareamento do meio agora vem do próprio degradê vertical, que não
      // tem borda nenhuma por ser linear. O pé continua em #eef0f8, que é a
      // cor do `body`, para a emenda com o fim da página também sumir.
      "linear-gradient(to bottom, #ffffff 0%, #fafbfe 38%, #f5f6fb 70%, #eef0f8 100%)",
    ].join(","),
  },
  tint: {
    backgroundImage: [
      "radial-gradient(ellipse 65% 45% at 85% 0%, rgba(32,51,153,0.07), transparent 70%)",
      "radial-gradient(ellipse 55% 40% at 8% 90%, rgba(59,84,201,0.06), transparent 70%)",
      "linear-gradient(to bottom, #f7f8fb 0%, #f2f3f8 55%, #eceef6 100%)",
    ].join(","),
  },
  dark: {
    backgroundImage: [
      "radial-gradient(ellipse 60% 45% at 80% 5%, rgba(59,84,201,0.32), transparent 70%)",
      "radial-gradient(ellipse 55% 40% at 5% 95%, rgba(32,51,153,0.4), transparent 70%)",
      "linear-gradient(150deg, #203399 0%, #1b2c77 55%, #101a4d 100%)",
    ].join(","),
  },
  deep: {
    backgroundImage: [
      "radial-gradient(ellipse 60% 45% at 78% 8%, rgba(42,64,192,0.28), transparent 70%)",
      "radial-gradient(ellipse 50% 40% at 6% 92%, rgba(32,51,153,0.3), transparent 70%)",
      "linear-gradient(to bottom, #16204f 0%, #101a4d 55%, #0d1440 100%)",
    ].join(","),
  },
};

/**
 * Treliça diagonal da marca, em camadas.
 *
 * Cada camada leva um espaçamento e uma defasagem próprios e respira no seu
 * tempo (ver `.trelica-viva` no globals.css): as linhas surgem e desaparecem
 * sem o desenho sair da geometria de ±45°. Uma camada só, animada em bloco,
 * faria a malha inteira piscar junto.
 */
const CAMADAS: { angulo: number; passo: number; classe: string }[] = [
  { angulo: 45, passo: 148, classe: "trelica-viva" },
  { angulo: -45, passo: 148, classe: "trelica-viva trelica-viva-2" },
  { angulo: 45, passo: 232, classe: "trelica-viva trelica-viva-3" },
  { angulo: -45, passo: 196, classe: "trelica-viva trelica-viva-4" },
];

const MASCARA =
  "radial-gradient(ellipse 85% 80% at 50% 45%, #000 30%, transparent 85%)";

function camadaTrelica(
  escuro: boolean,
  angulo: number,
  passo: number,
): React.CSSProperties {
  const cor = escuro ? "rgba(123,150,255,0.09)" : "rgba(32,51,153,0.1)";
  return {
    backgroundImage: `repeating-linear-gradient(${angulo}deg, ${cor} 0 1px, transparent 1px ${passo}px)`,
    maskImage: MASCARA,
    WebkitMaskImage: MASCARA,
    // descer esta distância reposiciona a diagonal em exatamente um período
    // (passo × √2), então a descida contínua não tem costura
    "--desce": `${Math.round(passo * Math.SQRT2)}px`,
  } as React.CSSProperties;
}

const TEXTO: Record<Tone, string> = {
  none: "text-white",
  light: "text-nexa-ink",
  tint: "text-nexa-ink",
  dark: "text-white",
  deep: "text-white",
};

export function SectionShell({
  children,
  id,
  tone = "light",
  semGrafismo = false,
  semFio = false,
  diagonal = false,
  compacto = false,
  estatico = false,
  className = "",
}: SectionShellProps) {
  const escuro = tone === "dark" || tone === "deep" || tone === "none";
  // com fundo fixo por baixo, a seção não repete treliça nem marca
  const decorar = !semGrafismo && tone !== "none";
  // no modo estático o desenho é o mesmo, só sem as classes de animação
  const anim = (classes: string) => (estatico ? "" : classes);

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        compacto ? "py-16 md:py-24" : "py-20 md:py-28"
      } ${
        diagonal
          ? "mt-[calc(var(--corte,0px)*-1)] [clip-path:polygon(0_var(--corte,0px),100%_0,100%_100%,0_calc(100%-var(--corte,0px)))]"
          : ""
      } ${TEXTO[tone]} ${className}`}
    >
      {/* plano de fundo em camadas */}
      <div aria-hidden className="absolute inset-0 -z-10" style={FUNDOS[tone]} />

      {decorar && (
        <>
          {/* Duas camadas por treliça, e não uma. A de fora leva a máscara e
              fica parada; a de dentro leva o padrão e desce. Juntas na mesma,
              a máscara desceria junto com a treliça e o esmaecido das bordas
              andaria pela seção. */}
          {CAMADAS.map(({ angulo, passo, classe }, i) => {
            const { backgroundImage, ...moldura } = camadaTrelica(
              escuro,
              angulo,
              passo,
            );
            return (
              <div
                key={i}
                aria-hidden
                className="absolute inset-0 -z-10 overflow-hidden"
                style={moldura}
              >
                <div
                  className={`trelica-tela ${anim(classe)}`}
                  style={{
                    backgroundImage,
                    ...(estatico ? { opacity: 0.75 } : {}),
                  }}
                />
              </div>
            );
          })}
          {/* a marca em contorno, ancorando a composição */}
          <NexaMarkOutline
            strokeWidth={1.3}
            className={`${anim("marca-deriva")} pointer-events-none absolute -right-40 -top-24 -z-10 size-[34rem] md:size-[42rem] ${
              escuro ? "text-nexa-line" : "text-nexa-primary"
            }`}
            style={
              {
                "--marca-op": 0.09,
                ...(estatico ? { opacity: 0.09 } : {}),
              } as React.CSSProperties
            }
          />
          <NexaMarkOutline
            strokeWidth={1.1}
            className={`${anim("marca-deriva marca-deriva-2")} pointer-events-none absolute -bottom-32 -left-40 -z-10 hidden size-[28rem] lg:block ${
              escuro ? "text-nexa-line" : "text-nexa-primary"
            }`}
            style={
              {
                "--marca-op": 0.06,
                ...(estatico ? { opacity: 0.06 } : {}),
              } as React.CSSProperties
            }
          />
        </>
      )}

      {/* fio de luz separando as seções */}
      {!semFio && !diagonal && (
        <span
          aria-hidden
          className={`absolute inset-x-0 top-0 h-px ${
            escuro
              ? "bg-gradient-to-r from-transparent via-white/25 to-transparent"
              : "bg-gradient-to-r from-transparent via-nexa-ink/10 to-transparent"
          }`}
        />
      )}

      <div className="container-wide relative">{children}</div>
    </section>
  );
}
