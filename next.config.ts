import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone é para deploy em VPS (PM2 + nginx); no Vercel a própria
  // plataforma empacota o output, e o modo standalone não é recomendado lá
  output: process.env.VERCEL ? undefined : "standalone",
  // Sem isto o Next procura a raiz do workspace subindo de pasta em pasta até
  // achar um lockfile, e numa máquina que tenha um package-lock.json solto no
  // diretório do usuário ele elege esse como raiz: o build avisa e o modo
  // standalone sai rastreando os arquivos errados. A raiz é este projeto.
  outputFileTracingRoot: import.meta.dirname,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
