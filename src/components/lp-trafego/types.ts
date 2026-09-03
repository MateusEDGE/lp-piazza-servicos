/**
 * O contrato das landing pages de tráfego pago.
 *
 * São páginas de resposta direta, diferentes das páginas de empreendimento em
 * `src/components/lp`: ali a página apresenta o ativo a quem já chegou pelo
 * site, aqui ela conversa com um público só e termina num formulário.
 *
 * `AtivoLp` é o empreendimento vindo do CMS. `PublicoLp` é a copy da página,
 * escrita para um público. A copy é uma função do ativo (`MontarPublico`) para
 * que número nenhum precise ser repetido à mão: quando o CMS diz que são 134
 * vagas, é isso que a página escreve.
 */

import type { AccentKey } from "@/components/lp/theme";

export type AtivoLp = {
  slug: string;
  nome: string;
  cidade: string;
  /** endereço completo, com a cidade no fim */
  endereco: string;
  /** rua e número, sem a cidade: cabe na ficha e no hero */
  enderecoCurto: string;
  terreno: string;
  construcao: string;
  operacoes: string;
  vagas: string;
  /** fatia já comercializada, ex.: "50%" */
  comercializado: string;
  /** acento de marca escolhido para este empreendimento no CMS */
  accent: AccentKey;
  /** o item em vídeo da galeria, quando o empreendimento tem um */
  video: { src: string; capa: string } | null;
  /**
   * Fotos do projeto, sem os itens em vídeo.
   *
   * Nunca vem vazia: sem galeria cadastrada ela cai na imagem do hero, para que
   * a busca por legenda das páginas não devolva string vazia. Quem precisa
   * saber se há galeria de verdade lê `temGaleria`, e não o tamanho desta lista.
   */
  galeria: readonly { src: string; legenda: string }[];
  /** false quando a lista acima é só o retrato do hero servindo de tapa-buraco */
  temGaleria: boolean;
  /** embed do Google Maps, quando cadastrado */
  mapaEmbedUrl: string | null;
  whatsappNumero: string;
};

export type PublicoLp = {
  slug: string;
  /** quem é este público, em uma linha; vai no texto alternativo da foto do hero */
  rotulo: string;
  hero: {
    titulo: string;
    /** parte final da headline, pintada com o acento */
    acento: string;
    subtitulo: string;
    cta: string;
    imagem: string;
  };
  /** números da faixa de prova, ainda dentro do hero */
  provas: readonly { valor: string; label: string }[];
  dor: {
    rotulo: string;
    titulo: string;
    paragrafos: readonly string[];
    virada: string;
  };
  beneficios: {
    rotulo: string;
    titulo: string;
    itens: readonly { dado: string; titulo: string; texto: string }[];
  };
  /** leitura dos três pavimentos a partir do interesse deste público */
  pavimentos: readonly {
    pavimento: string;
    categoria: string;
    detalhe: string;
    destaque: boolean;
  }[];
  /**
   * Cabeçalho da seção de pavimentos, quando "pavimento" não serve.
   *
   * O texto padrão fala em três pavimentos porque nasceu no Piazza, onde os
   * hubs são andares de verdade. No hub do Uberlândia Shopping são cinco
   * segmentos dividindo o mesmo piso, e afirmar andar ali é informação errada
   * sobre o imóvel. Vazio, vale o texto do Piazza.
   */
  tituloPavimentos?: string;
  textoPavimentos?: string;
  /** foto que acompanha a leitura dos pavimentos */
  imagemPavimentos: string;
  /** com isto, aquele espaço mostra o vídeo do projeto no lugar da foto */
  videoPavimentos?: boolean;
  /** exclusivo do investidor: a checagem de ativo, item a item */
  checklist?: {
    rotulo: string;
    titulo: string;
    itens: readonly { criterio: string; resposta: string }[];
  };
  ficha: {
    titulo: string;
    itens: readonly { label: string; valor: string }[];
  };
  faq: {
    titulo: string;
    itens: readonly { pergunta: string; resposta: string }[];
  };
  form: {
    titulo: string;
    texto: string;
    /**
     * O campo que qualifica o lead deste público.
     *
     * Com `opcoes` ele vira lista de seleção; sem elas, campo de texto livre
     * com `placeholder`. `rotuloLead` é como a resposta aparece na mensagem que
     * chega ao comercial — precisa ser curto, porque `label` é uma pergunta e
     * pergunta não cabe no meio de uma ficha de lead.
     */
    campo: {
      label: string;
      rotuloLead: string;
      placeholder?: string;
      opcoes?: readonly string[];
    };
    botao: string;
  };
  fechamento: { titulo: string; acento: string; texto: string; cta: string };
  whatsapp: string;
  seo: { title: string; description: string };
};

/** A copy de um público, escrita sobre os dados do ativo. */
export type MontarPublico = (ativo: AtivoLp) => PublicoLp;
