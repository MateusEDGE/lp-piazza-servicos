import { LpThemeProvider } from "@/components/lp/LpThemeProvider";
import { NexaBackdrop } from "@/components/ui/NexaBackdrop";
import { faqJsonLd, shoppingCenterJsonLd } from "@/lib/jsonld";
import { getEmpreendimentos, getMarcasColoridas, reader } from "@/lib/reader";
import { Beneficios } from "./Beneficios";
import { BlocoDor } from "./BlocoDor";
import { Checklist } from "./Checklist";
import { Faq } from "./Faq";
import { FechamentoLp } from "./FechamentoLp";
import { FichaAtivo } from "./FichaAtivo";
import { FormLead } from "./FormLead";
import { GaleriaProva } from "./GaleriaProva";
import { LocalizacaoLp } from "./LocalizacaoLp";
import { HeroLpTrafego } from "./HeroLpTrafego";
import { MarcasNexa } from "./MarcasNexa";
import { Pavimentos } from "./Pavimentos";
import { ProvaNexa, type Entrega } from "./ProvaNexa";
import type { AtivoLp, PublicoLp } from "./types";

/**
 * A landing page de tráfego, montada.
 *
 * A ordem das seções é a de uma página de resposta direta, e não é arbitrária:
 * promessa e prova (hero) → a dor de quem chegou (por que continuar lendo) →
 * os argumentos → o ativo (pavimentos, ficha, imagens) → por que confiar na
 * casa → as objeções → o formulário → o último chamado. Quem já decidiu no hero
 * converte no primeiro botão; quem precisa de mais razão desce e encontra a
 * dela pelo caminho.
 *
 * Os tons de fundo alternam a cada seção, a mesma regra do resto do site:
 * branco → azul → claro → azul → branco → azul → claro → azul → branco → azul.
 * Nenhum tom se repete em seguida, senão duas seções viram um bloco só e a
 * página perde o ritmo de leitura.
 */
export async function PaginaLpTrafego({
  ativo,
  publico,
  lpOrigem,
}: {
  ativo: AtivoLp;
  publico: PublicoLp;
  /** Repassado ao formulário; ver a prop de mesmo nome em `FormLead`. */
  lpOrigem?: string;
}) {
  const [marcas, entregas, numeros] = await Promise.all([
    getMarcasColoridas(),
    getEntregas(),
    getNumerosNexa(),
  ]);
  const ehInvestidor = publico.slug === "investidor";

  /**
   * A alternância de fundos depende do **número** de seções, e não da ordem.
   *
   * Uma corrente alternada com um elo a menos produz sempre exatamente um par
   * de fundos iguais colados, e não existe conserto local: seria preciso
   * inverter um lado inteiro do buraco. Por isso o lugar da galeria nunca fica
   * vazio: o ativo sem fotos cadastradas recebe ali a localização, que é clara
   * como ela, cabe na página de quem procura ponto e não depende de foto
   * nenhuma. A corrente segue com o mesmo tamanho, e nenhuma seção precisa
   * mudar de tom.
   */

  return (
    <LpThemeProvider accent={ativo.accent}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            shoppingCenterJsonLd({
              slug: ativo.slug,
              nome: ativo.nome,
              endereco: ativo.endereco,
              localizacao: ativo.cidade,
              resumoCard: publico.seo.description,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(publico.faq.itens)),
        }}
      />

      <main className="relative isolate bg-nexa-deep">
        {/* fundo de marca fixo e parado; as seções azuis são transparentes */}
        <NexaBackdrop estatico />

        <HeroLpTrafego publico={publico} ativo={ativo} />

        {/* A REGRA DOS FUNDOS: claro e escuro se alternam, seção a seção, e
            duas vizinhas nunca repetem o tom. Cada componente tem tom fixo, e a
            ordem é o que faz a conta fechar.

            As páginas de lojista têm dez seções e alternam sozinhas começando
            pelo claro. A do investidor tem onze, por causa da checagem do
            ativo, e com número ímpar a alternância só fecha se ela começar pelo
            escuro: por isso o bloco de dor entra escuro ali, e os pavimentos
            sobem para logo depois dele. Mexer na ordem de uma delas sem refazer
            esta conta reintroduz dois fundos iguais colados.

            Investidor: escuro, claro, escuro, claro, escuro, claro, escuro,
            claro, escuro, claro, escuro. Todo escuro aqui é `none`, o fundo
            fixo da página, para os azuis da landing serem sempre o mesmo. */}
        {ehInvestidor ? (
          <>
            <BlocoDor publico={publico} tone="none" />
            <Pavimentos publico={publico} ativo={ativo} />
            <FichaAtivo publico={publico} />
            <Checklist publico={publico} />
            <Beneficios publico={publico} />
            {ativo.temGaleria ? (
              <GaleriaProva ativo={ativo} />
            ) : (
              <LocalizacaoLp ativo={ativo} />
            )}
          </>
        ) : (
          <>
            <BlocoDor publico={publico} />
            <Beneficios publico={publico} />
            <Pavimentos publico={publico} ativo={ativo} />
            <FichaAtivo publico={publico} />
            {ativo.temGaleria ? (
              <GaleriaProva ativo={ativo} />
            ) : (
              <LocalizacaoLp ativo={ativo} />
            )}
          </>
        )}

        <ProvaNexa entregas={entregas} numeros={numeros} />
        <MarcasNexa marcas={marcas} />
        <Faq publico={publico} />
        <FormLead publico={publico} ativo={ativo} lpOrigem={lpOrigem} />
        <FechamentoLp publico={publico} ativo={ativo} />
      </main>
    </LpThemeProvider>
  );
}

/**
 * Os ativos que a Nexa já opera, com a ocupação que cada um entregou.
 *
 * É a resposta à objeção de quem compra na planta: o risco não é o projeto, é
 * inaugurar vazio. Vem do CMS, do `destaque` de cada empreendimento em gestão —
 * se o número mudar lá, muda aqui.
 *
 * **Só entra quem tem número.** A seção existe para provar entrega, e um card
 * com nome e cidade e mais nada não prova coisa nenhuma: enfraquece os que
 * provam, por diluição. Quando o portfólio passou de 6 para 20 ativos, a lista
 * encheu de cards mudos, e a prova virou catálogo.
 *
 * **E são três.** É a largura da grade, e uma fileira cheia se lê de uma vez.
 * Se o cliente preencher o destaque de um quarto ativo, ele entra na fila pela
 * ordem editorial do CMS e o quarto colocado espera a próxima vaga.
 */
const ENTREGAS_NA_PROVA = 3;

async function getEntregas(): Promise<Entrega[]> {
  const todos = await getEmpreendimentos();
  return todos
    .filter(
      ({ entry }) => entry.status === "operacao" && entry.destaque.trim(),
    )
    .slice(0, ENTREGAS_NA_PROVA)
    .map(({ slug, entry }) => ({
      slug,
      nome: entry.nome,
      cidade: entry.cidade,
      destaque: entry.destaque,
    }));
}

/** O histórico da casa em números, os mesmos que a home publica. */
async function getNumerosNexa() {
  const home = await reader.singletons.home.read();
  return home?.numeros ?? [];
}
