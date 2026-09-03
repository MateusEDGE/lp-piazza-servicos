export type AccentKey = "nexa" | "eletrico" | "bronze" | "petroleo" | "grafite";
export type Tone = "light" | "tint" | "dark" | "none";

export const ACCENTS: Record<
  AccentKey,
  { accent: string; accentSoft: string; accentContrast: string }
> = {
  nexa: { accent: "#3b54c9", accentSoft: "#e8ecfb", accentContrast: "#ffffff" },
  eletrico: { accent: "#2a40c0", accentSoft: "#e4e9fc", accentContrast: "#ffffff" },
  bronze: { accent: "#a8823c", accentSoft: "#f4ecdb", accentContrast: "#ffffff" },
  petroleo: { accent: "#0f6b74", accentSoft: "#dff0f1", accentContrast: "#ffffff" },
  grafite: { accent: "#46506b", accentSoft: "#e7e9f0", accentContrast: "#ffffff" },
};

/** Classes de texto adequadas ao tom de fundo da seção. */
export function toneText(tone: Tone) {
  // "none" é transparente sobre o fundo escuro fixo da página
  const isDark = tone === "dark" || tone === "none";
  return {
    isDark,
    title: isDark ? "text-white" : "text-nexa-ink",
    body: isDark ? "text-white/80" : "text-nexa-soft",
    muted: isDark ? "text-white/55" : "text-nexa-mist",
    border: isDark ? "border-white/15" : "border-nexa-ink/10",
    card: isDark ? "bg-white/[0.06] border-white/12" : "bg-white border-nexa-ink/8",
  };
}
