import type { CSSProperties, ReactNode } from "react";
import { ACCENTS, type AccentKey } from "./theme";

export function LpThemeProvider({
  accent,
  children,
}: {
  accent: AccentKey;
  children: ReactNode;
}) {
  const a = ACCENTS[accent] ?? ACCENTS.nexa;
  return (
    <div
      style={
        {
          "--lp-accent": a.accent,
          "--lp-accent-soft": a.accentSoft,
          "--lp-accent-contrast": a.accentContrast,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
