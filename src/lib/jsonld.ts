import { SITE_URL } from "./site-url";

type SiteData = {
  telefoneExibicao: string;
  email: string;
  endereco: string;
  instagram: string | null;
  linkedin: string | null;
};

export function organizationJsonLd(site: SiteData) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nexa Malls",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/og-default.png`,
    email: site.email,
    telephone: site.telefoneExibicao,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Rondon Pacheco, 1444, Loja 04",
      addressLocality: "Uberlândia",
      addressRegion: "MG",
      addressCountry: "BR",
    },
    sameAs: [site.instagram, site.linkedin].filter(Boolean),
  };
}

export function shoppingCenterJsonLd(emp: {
  slug: string;
  nome: string;
  endereco: string;
  localizacao: string;
  resumoCard: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ShoppingCenter",
    name: emp.nome,
    description: emp.resumoCard,
    url: `${SITE_URL}/empreendimentos/${emp.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: emp.endereco || emp.localizacao,
      addressLocality: "Uberlândia",
      addressRegion: "MG",
      addressCountry: "BR",
    },
    branchOf: { "@type": "Organization", name: "Nexa Malls", url: SITE_URL },
  };
}

/**
 * Marcação do FAQ das landing pages de tráfego.
 *
 * O FAQ já está respondido no HTML da página; a marcação só o declara como tal.
 * Vale a pena porque as objeções que a landing responde ("quais metragens",
 * "por que aqui e não em um shopping") são exatamente o que o público pesquisa
 * antes de procurar ponto.
 */
export function faqJsonLd(
  itens: readonly { pergunta: string; resposta: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: itens.map((i) => ({
      "@type": "Question",
      name: i.pergunta,
      acceptedAnswer: { "@type": "Answer", text: i.resposta },
    })),
  };
}
