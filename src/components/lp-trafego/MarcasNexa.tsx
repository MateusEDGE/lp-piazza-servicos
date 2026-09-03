import { Reveal } from "@/components/motion/Reveal";
import {
  MarcasCarrossel,
  type Marca,
} from "@/components/portfolio/MarcasCarrossel";
import { SectionShell } from "@/components/ui/SectionShell";

/**
 * A faixa de marcas atendidas, em seção própria.
 *
 * Aqui é relacionamento com o varejo — a razão de a Nexa conseguir ancorar um
 * mix antes da obra —, enquanto a seção anterior fala de ocupação entregue. São
 * argumentos diferentes, e com seção própria a faixa passa a ser argumento, e
 * não enfeite.
 *
 * Logos na cor original, como na home. O fundo claro não é preferência: metade
 * das marcas tem logo escuro, e sobre o azul-noite o do Madero, o da Mercedes e
 * o do GPA sumiriam.
 *
 * O título diz "parceiras da Nexa Malls", não "no empreendimento": são marcas
 * do histórico da casa, não locatários já contratados deste projeto. Essa
 * distinção não pode se perder numa próxima reescrita.
 */
export function MarcasNexa({ marcas }: { marcas: readonly Marca[] }) {
  if (marcas.length === 0) return null;

  return (
    <SectionShell tone="tint" compacto>
      <div className="text-center">
        <Reveal>
          <p className="label-editorial text-lp-accent">
            Relacionamento com o varejo
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="display-editorial mx-auto mt-4 max-w-3xl text-nexa-ink">
            As marcas parceiras da Nexa Malls
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.12}>
        {/* rótulo da faixa desligado: o título da seção já diz do que se trata */}
        <MarcasCarrossel marcas={[...marcas]} variante="cor" rotulo={null} />
      </Reveal>
    </SectionShell>
  );
}
