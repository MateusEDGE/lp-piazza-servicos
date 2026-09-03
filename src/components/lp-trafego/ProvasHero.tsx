import { Tilt } from "@/components/motion/Tilt";

/**
 * Os números do ativo, em cards soltos ao lado da promessa do hero.
 *
 * Eram uma faixa única, de largura inteira, colada no rodapé do hero: com o
 * hero em tela cheia ela empurrava a dobra e cobria a foto numa tira. Soltos e
 * à direita, cada número vira uma peça própria, e o hero volta a ser projeto
 * mais texto.
 *
 * O conteúdo é centralizado e o número sai em branco, e não no acento: sobre a
 * foto do hero o dourado disputava com o próprio projeto atrás, e o branco lê
 * de primeira em qualquer enquadramento.
 *
 * O card era quase transparente e sumia contra a foto, que muda de claro para
 * escuro conforme o enquadramento. Agora ele tem corpo próprio: fundo mais
 * fechado, um degradê que o separa do que está atrás, borda mais presente e uma
 * luz interna na aresta superior. Ele lê como peça sobre a foto em vez de
 * mancha dentro dela, sem virar bloco chapado.
 *
 * No celular a coluna não cabe ao lado de nada, então vira uma grade de dois
 * por dois abaixo do texto. É a única diferença entre os dois tamanhos.
 *
 * A mesma peça serve o hero das quatro landings e o da página de hubs, para os
 * cinco não divergirem no dia em que um deles for ajustado.
 */
export function ProvasHero({
  provas,
}: {
  provas: readonly { valor: string; label: string }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-3 lg:w-[19rem] lg:grid-cols-1">
      {provas.map((p) => (
        <Tilt key={p.label} className="group/prova" grau={14} escala={1.04}>
          <div className="rounded-[var(--radius-brand)] border border-white/25 bg-gradient-to-b from-nexa-ink/85 to-nexa-deep/80 px-5 py-4 text-center shadow-[0_18px_44px_-20px_rgba(6,10,32,0.95),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl transition-[background-color,border-color] duration-300 group-hover/prova:border-white/45 motion-reduce:transition-none md:px-6 md:py-5">
            <dd className="heading-nexa-caixa text-[1.7rem] leading-none text-white md:text-[2rem]">
              {p.valor}
            </dd>
            <dt className="mt-2 text-[11px] font-semibold uppercase leading-snug tracking-[0.12em] text-white/75">
              {p.label}
            </dt>
          </div>
        </Tilt>
      ))}
    </dl>
  );
}
