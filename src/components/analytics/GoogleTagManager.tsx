import Script from "next/script";

/**
 * O contêiner do Google Tag Manager, e tudo que o rastreamento precisa do
 * código.
 *
 * Só o GTM entra aqui. O Meta Pixel, o evento de PageView, o de ViewContent e
 * o de Lead são disparados de dentro do contêiner — instalar o snippet do
 * pixel também faria cada evento sair duas vezes, e o Meta contaria duas
 * conversões para um lead só. Da mesma forma, mudança de rastreamento se
 * publica no GTM e vale na hora, sem passar por deploy.
 *
 * O par obrigatório é o script mais o `<noscript>`: o segundo é o que registra
 * a visita de quem navega sem JavaScript, e o Meta o usa para conferir a
 * instalação do contêiner. Nenhum dos dois renderiza nada visível.
 *
 * `afterInteractive` é a estratégia certa para tag manager: o script sobe
 * assim que a página fica interativa, cedo o bastante para o PageView não se
 * perder e tarde o bastante para não competir com a renderização — analytics
 * bloqueando a pintura da página é o jeito mais caro de medir uma conversão.
 * Nenhum `layout.tsx` deste projeto ou das landings renderiza `<head>` à mão
 * (a metadata API cuida disso), e não precisa: o `next/script` posiciona o
 * script sozinho, mesmo declarado aqui dentro do `<body>`.
 */

/** Contêiner "Nexa Malls", já publicado. O mesmo nas landings e no site. */
const GTM_ID = "GTM-WX4QVX4P";

export function GoogleTagManager() {
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
