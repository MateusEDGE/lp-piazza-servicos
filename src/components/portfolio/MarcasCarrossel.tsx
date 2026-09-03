import Image from "next/image";

export type Marca = {
  slug: string;
  nome: string;
  logo: string | null;
};

type Variante = "tinta" | "cor";

/**
 * Faixa de logos das marcas atendidas, em carrossel automático e lento.
 *
 * Os arquivos são versões no azul-tinta da marca, transparentes e já
 * normalizadas opticamente numa moldura de 600×192 (200×64 em tela): quanto
 * mais largo o logo, mais baixo ele é desenhado dentro da moldura. Como todas as
 * artes chegam com a mesma dimensão, um slot de largura fixa basta para o ritmo
 * da faixa ficar uniforme — sem vãos irregulares causados por larguras
 * diferentes.
 *
 * A lista é renderizada duas vezes: a animação desloca exatamente uma cópia
 * (-50%), então o laço não tem costura. A segunda cópia é `aria-hidden` para o
 * leitor de tela não ouvir tudo em dobro. O vão fica no padding do item, nunca
 * em `gap`: com gap as duas metades não medem 50% exatos e a volta salta.
 */
function Logo({ marca, variante }: { marca: Marca; variante: Variante }) {
  if (!marca.logo) {
    return (
      <span className="text-center text-[12.5px] font-semibold uppercase tracking-[0.1em] text-nexa-soft">
        {marca.nome}
      </span>
    );
  }
  return (
    <Image
      src={marca.logo}
      alt={marca.nome}
      width={600}
      height={192}
      sizes="200px"
      /* eager de propósito: em lazy-load o navegador só busca o arquivo quando
         a animação já trouxe o logo para a vista, e ele aparece de estalo no
         meio da faixa. São 18 WebP de poucos KB, então carregar tudo de uma vez
         é mais barato que o salto visual. */
      loading="eager"
      className={
        variante === "cor"
          ? "h-auto w-full"
          : "h-auto w-full opacity-60 transition-opacity duration-500 hover:opacity-100 motion-reduce:transition-none"
      }
    />
  );
}

/**
 * @param variante `tinta` é a silhueta em azul-tinta; `cor` mantém o logo
 * original. Nas duas o logo entra solto, sem placa nem moldura.
 */
export function MarcasCarrossel({
  marcas,
  variante = "tinta",
  rotulo = "Parceiros estratégicos",
}: {
  marcas: Marca[];
  variante?: Variante;
  rotulo?: string | null;
}) {
  if (marcas.length === 0) return null;

  // Slot de largura fixa: o ritmo da faixa não depende da largura de cada arte.
  //
  // No celular passam quatro por tela. Seis chegaram a caber, mas cada arte
  // ficava com 48px e a assinatura das marcas de nome comprido virava um
  // traço; com quatro sobram 76px, e aí as artes se parecem entre si.
  const slot =
    "flex w-[96px] shrink-0 items-center px-2.5 sm:w-[132px] sm:px-3 md:w-[200px] md:px-4";

  return (
    <div className="mt-12">
      {rotulo && (
        <p className="text-center">
          <span className="inline-block rounded-full border border-nexa-ink/12 bg-nexa-ink/[0.04] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-nexa-soft">
            {rotulo}
          </span>
        </p>
      )}

      {/* Sangra até as bordas da janela: as margens negativas cobrem a distância
          entre a borda do container e a do viewport, seja qual for a largura. */}
      <div
        className="mt-10 mx-[calc(50%-50vw)] overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <ul className="marquee-track">
          {marcas.map((m) => (
            <li key={m.slug} className={slot}>
              <Logo marca={m} variante={variante} />
            </li>
          ))}
          {marcas.map((m) => (
            <li key={`dup-${m.slug}`} aria-hidden className={slot}>
              <Logo marca={m} variante={variante} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
