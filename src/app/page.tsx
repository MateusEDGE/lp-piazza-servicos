import type { Metadata } from "next";
import { BarraFixa } from "@/components/layout/BarraFixa";
import { PaginaLpTrafego } from "@/components/lp-trafego/PaginaLpTrafego";
import { LP_ID, MONTAR } from "@/config/lp";
import { ativoDaLanding } from "@/lib/landing";

/**
 * A landing, na raiz do domínio.
 *
 * Este projeto recebe tráfego pago de um público só, então a página mora em
 * `/`: o anúncio aponta para o domínio e pronto, sem caminho extra.
 */
async function carregar() {
  const ativo = await ativoDaLanding();
  return { ativo, publico: MONTAR(ativo) };
}

export async function generateMetadata(): Promise<Metadata> {
  const { publico } = await carregar();
  return {
    title: publico.seo.title,
    description: publico.seo.description,
    openGraph: {
      title: publico.seo.title,
      description: publico.seo.description,
      images: [{ url: publico.hero.imagem, width: 1200, height: 630 }],
    },
  };
}

export default async function Page() {
  const { ativo, publico } = await carregar();

  return (
    <>
      <PaginaLpTrafego ativo={ativo} publico={publico} lpOrigem={LP_ID} />
      <BarraFixa
        whatsappNumero={ativo.whatsappNumero}
        whatsappMensagem={publico.whatsapp}
        rotuloForm="Ver unidades"
      />
    </>
  );
}
