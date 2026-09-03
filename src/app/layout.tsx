import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import { RodapeLp } from "@/components/layout/RodapeLp";
import { TopoLp } from "@/components/layout/TopoLp";
import { LpThemeProvider } from "@/components/lp/LpThemeProvider";
import { ativoDaLanding } from "@/lib/landing";
import { getSite } from "@/lib/reader";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const chakra = Chakra_Petch({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-chakra",
  display: "swap",
});

export const metadata: Metadata = {
  // Sem base absoluta a imagem de compartilhamento sai com caminho relativo, e
  // nem o WhatsApp nem o gerenciador de anúncios conseguem buscar a miniatura.
  metadataBase: new URL(SITE_URL),
  title: { default: "Nexa Malls", template: "%s" },
  openGraph: { type: "website", locale: "pt_BR", siteName: "Nexa Malls" },
  twitter: { card: "summary_large_image" },
};

/**
 * A moldura da landing: topo, rodapé e o acento do empreendimento.
 *
 * O acento sobe para cá porque topo e rodapé também o usam, e porque neste
 * projeto ele é constante: um domínio, um empreendimento, uma cor. Quem escolhe
 * continua sendo o CMS, no campo de arte do empreendimento, do mesmo jeito que
 * no site.
 */
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [ativo, site] = await Promise.all([ativoDaLanding(), getSite()]);

  return (
    <html lang="pt-BR" className={chakra.variable}>
      <body className="font-sans">
        <LpThemeProvider accent={ativo.accent}>
          <TopoLp
            whatsappNumero={ativo.whatsappNumero}
            whatsappMensagem={`Olá! Vim pela página do ${ativo.nome} e gostaria de falar com o time.`}
          />
          {children}
          <RodapeLp
            empreendimento={ativo.nome}
            enderecoDoAtivo={ativo.endereco}
            endereco={site.endereco}
            telefone={site.telefoneExibicao}
            email={site.email}
          />
        </LpThemeProvider>
      </body>
    </html>
  );
}
