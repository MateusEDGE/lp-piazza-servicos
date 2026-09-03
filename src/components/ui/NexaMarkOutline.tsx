/**
 * O "X" da marca Nexa em contorno — duas barras cruzadas apenas com traço, sem
 * preenchimento. Em escala grande e opacidade baixa funciona como marca d'água,
 * e o cruzamento visível das barras dá a leitura de desenho técnico.
 *
 * Herda a cor via `currentColor`: controle tom e opacidade pela classe
 * (ex.: `text-nexa-line/[0.07]`). Sempre decorativo — aria-hidden.
 */
export function NexaMarkOutline({
  className = "",
  strokeWidth = 1.5,
  style,
}: {
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}) {
  // Barra de 283 de comprimento (diagonal de um quadrado de 200) girada 45°:
  // a caixa resultante mede ~233, então cabe na viewBox de 240 sem cortar.
  const barra = {
    x: -21.5,
    y: 97,
    width: 283,
    height: 46,
  };

  return (
    <svg
      aria-hidden
      viewBox="0 0 240 240"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={className}
      style={style}
    >
      <rect {...barra} transform="rotate(45 120 120)" />
      <rect {...barra} transform="rotate(-45 120 120)" />
    </svg>
  );
}
