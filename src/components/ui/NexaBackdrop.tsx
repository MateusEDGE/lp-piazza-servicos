import { NexaMarkOutline } from "@/components/ui/NexaMarkOutline";

/**
 * Fundo de marca compartilhado: a página do portfólio e as páginas de cada
 * empreendimento usam o mesmo, composto com a geometria da logo.
 *
 * É `fixed`: fica preso ao viewport e acompanha o scroll, então cobre a página
 * inteira sem depender da altura do conteúdo. Por isso a composição é pensada
 * para *uma tela*, não para a página toda.
 *
 * Para ele aparecer, as seções por cima precisam ser transparentes: no <main>
 * fica o `bg-nexa-deep` como cor de base, e as seções escuras usam
 * `SectionShell tone="none"`.
 *
 * Camadas, de trás para frente:
 *   1. brilhos institucionais, para o azul não ficar chapado
 *   2. treliça diagonal a ±45°: as duas direções de traço do "X" da marca
 *   3. o "X" em contorno concêntrico, leitura de desenho de construção da marca
 *   4. cantos chanfrados, eco do corte das letras do logotipo
 *
 * Tudo estático: nada aqui anima.
 *
 * Os gradientes vão em `style` de propósito: como valor arbitrário de classe
 * dependeriam de escapar espaço por underscore, e um erro ali falha em silêncio.
 */

/**
 * Treliça com as diagonais do X, em camadas.
 *
 * Mesma mecânica do fundo claro das seções (ver SectionShell): cada camada tem
 * espaçamento e defasagem próprios e respira no seu tempo, e desliza para baixo
 * com `--desce` = passo × √2 — a distância que reposiciona a diagonal em
 * exatamente um período, então o laço não tem costura.
 */
const CAMADAS: { angulo: number; passo: number; classe: string }[] = [
  { angulo: 45, passo: 132, classe: "trelica-viva" },
  { angulo: -45, passo: 132, classe: "trelica-viva trelica-viva-2" },
  { angulo: 45, passo: 208, classe: "trelica-viva trelica-viva-3" },
  { angulo: -45, passo: 176, classe: "trelica-viva trelica-viva-4" },
];

const MASCARA =
  "radial-gradient(ellipse 90% 85% at 50% 45%, #000 35%, rgba(0,0,0,0.35) 80%, transparent)";

function camadaTrelica(angulo: number, passo: number): React.CSSProperties {
  return {
    backgroundImage: `repeating-linear-gradient(${angulo}deg, rgba(123,150,255,0.1) 0 1px, transparent 1px ${passo}px)`,
    maskImage: MASCARA,
    WebkitMaskImage: MASCARA,
    "--desce": `${Math.round(passo * Math.SQRT2)}px`,
  } as React.CSSProperties;
}

const BRILHOS: React.CSSProperties = {
  backgroundImage: [
    "radial-gradient(ellipse 62% 48% at 82% 12%, rgba(42,64,192,0.24), transparent 70%)",
    "radial-gradient(ellipse 55% 45% at 6% 62%, rgba(32,51,153,0.20), transparent 70%)",
    "radial-gradient(ellipse 70% 40% at 50% 100%, rgba(42,64,192,0.14), transparent 70%)",
  ].join(","),
};

/**
 * O "X" desenhado em contornos concêntricos, como as linhas de offset de uma
 * prancha. É a marca servindo de composição, não um selo aplicado.
 */
function MarcaComposta({
  className,
  strokeWidth = 1.3,
  estatico = false,
}: {
  className: string;
  strokeWidth?: number;
  estatico?: boolean;
}) {
  return (
    <div
      className={`${estatico ? "" : "marca-deriva"} absolute ${className}`}
      style={{ "--marca-op": 1 } as React.CSSProperties}
    >
      <NexaMarkOutline
        strokeWidth={strokeWidth}
        className="absolute inset-0 size-full text-nexa-line opacity-[0.12]"
      />
      <NexaMarkOutline
        strokeWidth={strokeWidth * 0.85}
        className="absolute inset-[17%] text-nexa-line opacity-[0.075]"
      />
      <NexaMarkOutline
        strokeWidth={strokeWidth * 0.7}
        className="absolute inset-[34%] text-nexa-line opacity-[0.05]"
      />
    </div>
  );
}

/** Canto chanfrado a 45°, o corte das letras do logotipo. */
function Chanfro({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={`absolute text-nexa-line opacity-[0.18] ${className}`}
    >
      <path d="M0 40 L40 0 L100 0" />
      <path d="M0 62 L62 0" strokeOpacity="0.55" />
    </svg>
  );
}

export function NexaBackdrop({
  /** grafismo parado: mesma composição, sem respirar, descer nem derivar */
  estatico = false,
}: {
  estatico?: boolean;
} = {}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* 1. brilhos */}
      <div className="absolute inset-0" style={BRILHOS} />

      {/* 2. treliça diagonal da marca, respirando e descendo */}
      {CAMADAS.map(({ angulo, passo, classe }, i) => (
        <div
          key={i}
          className={`absolute inset-0 ${estatico ? "" : classe}`}
          style={{
            ...camadaTrelica(angulo, passo),
            // sem a animação a treliça não recebe opacidade do keyframe
            ...(estatico ? { opacity: 0.8 } : {}),
          }}
        />
      ))}

      {/* 3. o X em contorno concêntrico, compondo a tela */}
      <MarcaComposta
        className="-right-[16rem] -top-[10rem] size-[44rem] md:-right-[10rem] md:size-[56rem]"
        estatico={estatico}
        strokeWidth={1.5}
      />
      <MarcaComposta
        className="marca-deriva-2 -bottom-[14rem] -left-[15rem] size-[38rem] md:-left-[9rem] md:size-[48rem]"
        estatico={estatico}
        strokeWidth={1.3}
      />
      <MarcaComposta
        className="left-[42%] top-[34%] hidden size-[26rem] lg:block"
        estatico={estatico}
        strokeWidth={1}
      />

      {/* 4. chanfros nas extremidades */}
      <Chanfro className="left-0 top-0 size-40 md:size-56" />
      <Chanfro className="bottom-0 right-0 size-40 rotate-180 md:size-56" />
    </div>
  );
}
