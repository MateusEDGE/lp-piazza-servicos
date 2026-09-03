const COLORS = {
  white: "text-white",
  blue: "text-nexa-primary",
  navy: "text-nexa-secondary",
  black: "text-black",
} as const;

type LogoProps = {
  color?: keyof typeof COLORS;
  className?: string;
};

export function Logo({ color = "white", className = "h-6" }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="NEXA MALLS"
      className={`mark ${COLORS[color]} ${className}`}
    />
  );
}
