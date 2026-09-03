import { Reveal } from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/Tilt";
import { Logo } from "@/components/ui/Logo";
import { SectionShell } from "@/components/ui/SectionShell";

export type Entrega = {
  slug: string;
  nome: string;
  cidade: string;
  destaque: string;
};

/**
 * Prova de que a casa entrega — a seção que responde "e se não alugar?".
 *
 * A objeção real de quem compra ponto ou participação em empreendimento na
 * planta não é o projeto: é a chance de inaugurar vazio. A resposta não é
 * adjetivo, é a taxa de ocupação dos ativos que a Nexa já opera, e ela vem do
 * CMS — o `destaque` de cada empreendimento em operação. Se o número mudar lá,
 * muda aqui.
 *
 * A faixa de logos das marcas atendidas fica em seção própria, a seguir: ela
 * precisa de fundo claro (metade dos logos é escura) e o assunto é outro —
 * aqui é ocupação entregue, lá é relacionamento com o varejo.
 */
export function ProvaNexa({
  entregas,
  numeros,
}: {
  entregas: readonly Entrega[];
  numeros: readonly {
    valor: string;
    prefixo: string;
    sufixo: string;
    label: string;
  }[];
}) {
  return (
    <SectionShell tone="none" compacto>
      {/* Rótulo e marca centralizados: os cards abaixo formam uma grade de três
          colunas e os números, uma de seis, as duas simétricas e de largura
          inteira. Com a abertura encostada à esquerda, ela ficava torta em
          relação a tudo que vem depois. */}
      <Reveal>
        <div className="flex flex-col items-center text-center">
          <p className="label-editorial text-lp-accent">Quem está por trás</p>
          {/* A marca no lugar da frase: o h2 continua existindo para a seção não
              ficar sem título, e o nome acessível vem do aria-label do logo. */}
          <h2 className="mt-5">
            <Logo color="white" className="h-9 md:h-11" />
          </h2>
        </div>
      </Reveal>

      {entregas.length > 0 && (
        <ul className="mt-12 grid gap-3.5 md:grid-cols-3">
          {entregas.map((e, i) => (
            <li key={e.slug}>
              <Reveal delay={Math.min(i * 0.07, 0.28)} className="h-full">
                <Tilt className="group/entrega h-full" grau={14} escala={1.03}>
                  <article className="flex h-full flex-col rounded-[var(--radius-brand)] border border-white/12 bg-white/[0.06] p-6 shadow-[0_18px_44px_-26px_rgba(6,10,32,0.95)] transition-[background-color,border-color] duration-300 group-hover/entrega:border-white/30 group-hover/entrega:bg-white/[0.1] motion-reduce:transition-none md:p-7">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
                    Em operação · {e.cidade}
                  </span>
                  <h3 className="heading-nexa mt-3 text-[1.3rem] text-white">
                    {e.nome}
                  </h3>
                  <p className="mt-4 border-l-2 border-lp-accent pl-4 text-[16px] font-semibold leading-snug text-white">
                    {e.destaque}
                  </p>
                  </article>
                </Tilt>
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      {numeros.length > 0 && (
        <Reveal delay={0.16}>
          <dl className="mt-10 grid gap-x-8 gap-y-7 border-t border-white/12 pt-10 sm:grid-cols-3 lg:grid-cols-6">
            {numeros.map((n) => (
              <div key={n.label} className="relative text-center">
                {/* fio descendo da linha de cima até o número: liga cada dado à
                    régua que abre o bloco, em vez de deixá-los soltos */}
                <span
                  aria-hidden
                  className="absolute -top-10 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-white/10 to-lp-accent/70"
                />
                <dd className="heading-nexa-caixa text-[1.9rem] text-lp-accent">
                  {n.prefixo}
                  {n.valor}
                  {n.sufixo}
                </dd>
                <dt className="mt-1.5 text-[11px] font-semibold uppercase leading-snug tracking-[0.12em] text-white/65">
                  {n.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      )}
    </SectionShell>
  );
}
