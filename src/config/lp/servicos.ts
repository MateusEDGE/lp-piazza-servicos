import type { MontarPublico } from "@/components/lp-trafego/types";
import { FAQ_COMO_RESERVAR, FAQ_QUEM_ESTA_ATRAS, foto } from "./comum";

/**
 * A copy da landing de conveniência e serviços.
 *
 * Revisão de 18/08/2026 (documento escrito sobre a LP de gastronomia e
 * replicado aqui): a voz ficou mais institucional e o pavimento intermediário
 * (hoje Térreo) passou a se chamar "Serviços".
 *
 * Revisão de 19/08/2026 (documento próprio desta página): hero novo, e a lista
 * de pavimentos passou a seguir a ordem do prédio, de baixo para cima. Confirmou
 * que o bloco de dor e os cards de vagas, mix e fase de comercialização, que
 * tinham vindo replicados de gastronomia, ficam como estão.
 */
export const servicos: MontarPublico = (a) => ({
  slug: "servicos",
  rotulo: "Para operações de conveniência e serviços",
  hero: {
    titulo: "Mais que um endereço.",
    acento: "Parte da rotina",
    subtitulo: `O ${a.nome} reúne mais de 30 operações em um mix pensado para fazer parte da rotina de quem passa por ali.`,
    cta: "Ver as unidades disponíveis",
    imagem: foto(a, "Lojas no térreo"),
  },
  provas: [
    { valor: a.vagas, label: "vagas de estacionamento" },
    { valor: a.operacoes, label: "operações no mix" },
    { valor: a.construcao, label: "de área construída" },
    { valor: a.comercializado, label: "de ancoragem antes da obra" },
  ],
  dor: {
    rotulo: "O problema real",
    titulo: "Um grande negócio no endereço errado.",
    paragrafos: [
      "Uma boa operação pode ter produto, marca, atendimento e público. Mas, quando está em um ponto que não acompanha essa qualidade, parte do seu potencial fica para trás.",
    ],
    virada: `O ${a.nome} nasce justamente dessa lógica: reunir localização estratégica, operações complementares e um público compatível com negócios que querem crescer.`,
  },
  beneficios: {
    rotulo: "Por que funciona para serviços",
    titulo: "Recorrência não se compra em mídia. Se compra em ponto.",
    itens: [
      {
        dado: `${a.vagas} vagas`,
        titulo: "Conforto e facilidade para o cliente.",
        texto: `Chegar, estacionar e acessar a operação com facilidade também faz parte da experiência. O Piazza conta com ${a.vagas} vagas de estacionamento, trazendo mais comodidade para quem visita, retira pedidos ou utiliza os serviços do empreendimento. Mais facilidade para chegar. Mais motivos para ficar.`,
      },
      {
        dado: `${a.operacoes} operações`,
        titulo: "Cada vizinho traz cliente para você",
        texto:
          "Mais de 30 operações no mesmo endereço são mais de 30 motivos diferentes para alguém vir até aqui. Todo mundo divide o mesmo fluxo, e ele não custa mídia nenhuma para você.",
      },
      {
        dado: "Gastronomia logo abaixo",
        titulo: "Movimento que não acaba às 18h",
        texto:
          "A praça gastronômica sustenta o fluxo à noite e no fim de semana, quando o comércio de rua já fechou. A sua operação decide até que horas quer aproveitar isso.",
      },
      {
        dado: "Mix curado",
        titulo: "Mix curado e complementar",
        texto:
          "A Nexa encontra o mix por vocação, não por ordem de chegada. Cada segmento tem um número definido de operações.",
      },
      {
        dado: "Av. Nicomedes Alves dos Santos",
        titulo: "Fachada em corredor nobre",
        texto:
          "Visibilidade diária para o trânsito de um dos endereços mais valorizados de Uberlândia. A sua placa trabalha 24 horas, inclusive para quem nunca entrou.",
      },
      {
        dado: "Fase de comercialização",
        titulo: "Você chega primeiro",
        texto:
          "Quem entra agora tem uma série de benefícios que podem potencializar o seu negócio como: metragem, posição e outros.",
      },
    ],
  },
  // Ordem numérica do prédio, e não a do público primeiro: pedido de
  // 19/08/2026. O destaque segue no Térreo, que é o andar de quem lê.
  pavimentos: [
    {
      pavimento: "Semi-enterrado",
      categoria: "Gastronomia",
      detalhe: "Praça ativa, puxando fluxo à noite e no fim de semana",
      destaque: false,
    },
    {
      pavimento: "Térreo",
      categoria: "Serviços",
      detalhe: "Operações do dia a dia da região: o andar da sua operação",
      destaque: true,
    },
    {
      pavimento: "Primeiro Pavimento",
      categoria: "Saúde e bem-estar",
      detalhe: "Clínicas, consultórios e studios: o mesmo cliente toda semana",
      destaque: false,
    },
  ],
  imagemPavimentos: foto(a, "Lojas no térreo"),
  ficha: {
    titulo: "O ativo em números",
    itens: [
      { label: "Terreno", valor: a.terreno },
      { label: "Área construída", valor: a.construcao },
      { label: "Operações comerciais", valor: a.operacoes },
      { label: "Vagas", valor: a.vagas },
      { label: "Ancoragem antes da obra", valor: a.comercializado },
      { label: "Serviços", valor: "Térreo" },
      { label: "Status", valor: "Em comercialização" },
      { label: "Endereço", valor: a.enderecoCurto },
    ],
  },
  faq: {
    titulo: "Perguntas frequentes",
    itens: [
      {
        pergunta: "Quais metragens estão disponíveis?",
        resposta:
          "As unidades têm metragens diferentes e a disponibilidade muda de semana para semana, porque metade do empreendimento já foi comercializada. O time envia a planta com as unidades livres e as metragens exatas no mesmo dia do seu contato.",
      },
      {
        pergunta: "O meu segmento já está no mix?",
        resposta:
          "O mix tem número definido de operações por segmento, para não colocar concorrentes diretos lado a lado. Informe o seu segmento no formulário e você recebe a resposta direta: livre, em negociação ou encerrado.",
      },
      {
        pergunta: "Por que aqui e não em um ponto de rua?",
        resposta:
          "Em rua você paga por fluxo de passagem e concorre por vaga com o quarteirão inteiro. Aqui o fluxo é gerado por mais de 30 operações vizinhas, o estacionamento é do empreendimento e a segurança, a limpeza e a manutenção são de condomínio, não do seu tempo.",
      },
      {
        pergunta: "Qual o horário de funcionamento?",
        resposta:
          "Um hub de conveniência não impõe o horário obrigatório de shopping. Cada operação define o seu funcionamento dentro das regras de condomínio do empreendimento, o que permite acompanhar o pico do seu próprio segmento.",
      },
      FAQ_QUEM_ESTA_ATRAS,
      FAQ_COMO_RESERVAR,
    ],
  },
  form: {
    titulo: "Receba a planta com as unidades livres",
    texto: "Entenda como o seu negócio pode fazer parte do Piazza.",
    campo: {
      label: "Qual o nome do seu negócio?",
      rotuloLead: "Negócio",
      placeholder: "Como o seu negócio se chama",
    },
    botao: "Quero as unidades disponíveis",
  },
  fechamento: {
    titulo: "Grande parte do Piazza já foi",
    acento: "comercializado.",
    texto:
      "Cada segmento tem um número limitado de operações no mix, por isso, entre em contato e garanta o seu espaço!",
    cta: "Falar com o time agora",
  },
  whatsapp: `Olá! Vim pela página do ${a.nome} e quero abrir uma operação de serviços. Podem me enviar as unidades disponíveis?`,
  seo: {
    title: "Ponto comercial em Uberlândia | Piazza Nicomedes",
    description:
      "Hub de conveniência com mais de 30 operações e 134 vagas na Av. Nicomedes Alves dos Santos. 50% de ancoragem antes da obra. Veja as unidades disponíveis.",
  },
});
