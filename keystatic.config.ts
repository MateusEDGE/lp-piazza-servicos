/**
 * O CMS desta landing.
 *
 * É o keystatic.config do site com as entradas que a landing lê, recortadas dele
 * sem alteração: as configurações de contato, os números da casa, os
 * empreendimentos e as marcas atendidas. O YAML em `content/` é o mesmo dos
 * dois lados, então uma entrada editada aqui pode ser copiada para lá e
 * vice-versa.
 *
 * Este projeto e o site são independentes desde o primeiro commit: corrigir um
 * número aqui não o corrige em nexamalls.com.br. Quando o dado for do
 * empreendimento (metragem, vagas, operações, fotos), corrija nos dois.
 */
import { config, fields, collection, singleton } from "@keystatic/core";

// Local em dev; GitHub mode quando KEYSTATIC_GITHUB_REPO estiver definida (produção).
const storage = process.env.KEYSTATIC_GITHUB_REPO
  ? {
      kind: "github" as const,
      repo: process.env.KEYSTATIC_GITHUB_REPO as `${string}/${string}`,
    }
  : { kind: "local" as const };

export default config({
  storage,
  ui: {
    brand: { name: "NEXA MALLS · piazza-nicomedes" },
  },

  singletons: {
    site: singleton({
      label: "Configurações do site",
      path: "content/singletons/site/",
      format: { data: "yaml" },
      schema: {
        whatsappNumero: fields.text({
          label: "WhatsApp (somente números, com DDI)",
          description: "Ex.: 5534997378887",
        }),
        whatsappMensagemPadrao: fields.text({
          label: "Mensagem padrão do WhatsApp",
          multiline: true,
        }),
        email: fields.text({ label: "E-mail de contato" }),
        telefoneExibicao: fields.text({ label: "Telefone (como exibir)" }),
        endereco: fields.text({ label: "Endereço da sede", multiline: true }),
        instagram: fields.url({ label: "Instagram da Nexa (URL)" }),
        instagramSocio: fields.url({
          label: "Instagram do sócio (URL)",
          description: "Perfil pessoal exibido ao lado do da Nexa",
        }),
        linkedin: fields.url({ label: "LinkedIn (URL)" }),
        metaDescription: fields.text({
          label: "Meta description padrão",
          multiline: true,
        }),
      },
    }),

    home: singleton({
      label: "Home",
      path: "content/singletons/home/",
      format: { data: "yaml" },
      schema: {
        headline: fields.text({ label: "Headline principal" }),
        subheadline: fields.text({ label: "Subheadline", multiline: true }),
        etapasHero: fields.array(
          fields.object({
            tag: fields.text({ label: "Tag (ex.: Quem somos)" }),
            titulo: fields.text({ label: "Título" }),
            texto: fields.text({
              label: "Texto (curto — 1 a 2 frases)",
              multiline: true,
            }),
          }),
          {
            label: "Etapas do hero (aparecem durante o scroll do 3D)",
            itemLabel: (p) => p.fields.titulo.value || "Etapa",
          },
        ),
        numeros: fields.array(
          fields.object({
            valor: fields.text({ label: "Valor (número)" }),
            prefixo: fields.text({ label: "Prefixo (ex.: +)" }),
            sufixo: fields.text({ label: "Sufixo (ex.: anos, %)" }),
            label: fields.text({ label: "Rótulo" }),
          }),
          {
            label: "Números / provas",
            itemLabel: (p) =>
              `${p.fields.prefixo.value}${p.fields.valor.value}${p.fields.sufixo.value} — ${p.fields.label.value}`,
          },
        ),
        // Fechamento da home. O asterisco marca a palavra que sai em azul, a
        // mesma convenção do hero.
        ctaTitulo: fields.text({
          label: "Fechamento: título",
          description: "Use *asteriscos* para destacar palavras em azul",
        }),
        ctaTexto: fields.text({ label: "Fechamento: texto", multiline: true }),
        pilares: fields.array(
          fields.object({
            titulo: fields.text({ label: "Título" }),
            texto: fields.text({ label: "Texto", multiline: true }),
            icone: fields.select({
              label: "Ícone",
              options: [
                { label: "Desenvolvimento (planta/projeto)", value: "projetos" },
                { label: "Estruturação (conexões)", value: "negocios" },
                { label: "Operação (engrenagem/gestão)", value: "operacao" },
              ],
              defaultValue: "projetos",
            }),
          }),
          {
            label: "Pilares de atuação",
            itemLabel: (p) => p.fields.titulo.value,
          },
        ),
        empreendimentosDestaque: fields.array(
          fields.relationship({
            label: "Empreendimento",
            collection: "empreendimentos",
          }),
          {
            label: "Empreendimentos em destaque na home",
            itemLabel: (p) => p.value ?? "—",
          },
        ),
      },
    }),
  },

  collections: {
    empreendimentos: collection({
      label: "Empreendimentos",
      slugField: "nome",
      path: "content/empreendimentos/*/",
      format: { data: "yaml" },
      columns: ["status", "localizacao"],
      schema: {
        nome: fields.slug({ name: { label: "Nome" } }),
        temLandingPage: fields.checkbox({
          label: "Possui landing page própria?",
          description:
            "Deixe DESMARCADO ao cadastrar. Marcado, o site monta a página completa (copy, ficha técnica, mix, galeria) e as seções sem conteúdo aparecem vazias. Marque só quando esses campos estiverem preenchidos; até lá o empreendimento é servido pela página curta, com foto, segmentos, mapa e contato.",
          // Falso por padrão: um empreendimento recém-criado não tem copy nem
          // ficha, e é a página curta que sustenta esse estado.
          defaultValue: false,
        }),
        status: fields.select({
          label: "Status",
          options: [
            // ATENÇÃO: os valores são históricos e não batem com o rótulo.
            // Ver STATUS_LABEL em src/lib/empreendimentos.ts.
            { label: "Gestão de Ativos", value: "operacao" },
            { label: "Incorporação", value: "comercializacao" },
            { label: "Desenvolvimento", value: "desenvolvimento" },
          ],
          defaultValue: "desenvolvimento",
        }),
        categoria: fields.select({
          label: "Categoria",
          description: "Tipo de empreendimento exibido no card do portfólio",
          options: [
            { label: "Strip Mall", value: "strip-mall" },
            { label: "Lojas Comerciais", value: "lojas-comerciais" },
            { label: "Open Mall", value: "open-mall" },
            { label: "Hub de Conveniência", value: "hub-conveniencia" },
            { label: "Hub de Serviços", value: "hub-servicos" },
            { label: "Shopping", value: "shopping" },
          ],
          defaultValue: "strip-mall",
        }),
        ordem: fields.integer({
          label: "Ordem no portfólio",
          defaultValue: 0,
        }),
        cidade: fields.text({
          label: "Cidade",
          description: "Ex.: Uberlândia/MG",
        }),
        zona: fields.select({
          label: "Zona da cidade",
          description:
            "Usada no filtro da busca de empreendimentos. Vazio: o empreendimento não aparece quando alguém filtra por zona.",
          options: [
            { label: "Não informada", value: "" },
            { label: "Zona Sul", value: "sul" },
            { label: "Zona Norte", value: "norte" },
            { label: "Zona Leste", value: "leste" },
            { label: "Zona Oeste", value: "oeste" },
            { label: "Central", value: "central" },
          ],
          defaultValue: "",
        }),
        tiposOperacao: fields.multiselect({
          label: "Tipos de operação que recebe",
          description:
            "O que se pode abrir aqui. É por isto que a busca filtra quando alguém escolhe um tipo.",
          options: [
            { label: "Academia", value: "academia" },
            { label: "Auto center", value: "auto-center" },
            { label: "Banco e financeira", value: "banco" },
            { label: "Clínica", value: "clinica" },
            { label: "Concessionária", value: "concessionaria" },
            { label: "Conveniência", value: "conveniencia" },
            { label: "Coworking", value: "coworking" },
            { label: "Educação", value: "educacao" },
            { label: "Entretenimento", value: "entretenimento" },
            { label: "Escritório", value: "escritorio" },
            { label: "Farmácia", value: "farmacia" },
            { label: "Fast food", value: "fast-food" },
            { label: "Gastronomia", value: "gastronomia" },
            { label: "Home center", value: "home-center" },
            { label: "Pet shop", value: "pet-shop" },
            { label: "Restaurante", value: "restaurante" },
            { label: "Sala comercial", value: "sala-comercial" },
            { label: "Saúde e bem-estar", value: "saude" },
            { label: "Serviços", value: "servicos" },
            { label: "Supermercado", value: "supermercado" },
            { label: "Varejo", value: "varejo" },
          ],
          defaultValue: [],
        }),
        publicos: fields.multiselect({
          label: "Para quem este ativo é",
          description:
            "Deixe vazio para o site deduzir da fase: em operação procura lojista; em comercialização, lojista e investidor; em desenvolvimento, investidor e âncora. Preencha só quando o ativo fugir da regra.",
          options: [
            { label: "Lojista", value: "lojista" },
            { label: "Investidor", value: "investidor" },
            { label: "Loja âncora", value: "ancora" },
          ],
          defaultValue: [],
        }),
        atuacao: fields.multiselect({
          label: "Atuação da Nexa",
          description:
            "Frentes que a Nexa conduz neste empreendimento — exibidas como tags no card",
          options: [
            { label: "Incorporação", value: "incorporacao" },
            { label: "Masterplan", value: "masterplan" },
            { label: "Desenvolvimento", value: "desenvolvimento" },
            { label: "Mix de operações", value: "curadoria-mix" },
            { label: "Comercialização", value: "comercializacao" },
            { label: "Gestão", value: "gestao" },
          ],
          defaultValue: [],
        }),
        localizacao: fields.text({ label: "Localização (resumo)" }),
        resumoCard: fields.text({
          label: "Frase do card no portfólio",
          multiline: true,
        }),
        destaque: fields.text({
          label: "Destaque comercial",
          description: "Ex.: 98% ocupado em 4 meses de operação",
        }),
        copy: fields.text({ label: "Texto da landing page", multiline: true }),
        ancoras: fields.text({
          label: "Âncoras",
          description: "Ex.: Academia, farmácia e lojas de rede",
        }),
        papelNexa: fields.text({
          label: "Papel da Nexa",
          multiline: true,
        }),
        entregas: fields.array(fields.text({ label: "Entrega" }), {
          label: "Entregas da Nexa",
          description:
            "Lista do que a Nexa entregou neste empreendimento — aparece na visualização expandida",
          itemLabel: (p) => p.value || "Entrega",
        }),
        fichaTecnica: fields.object(
          {
            terreno: fields.text({ label: "Área do terreno" }),
            abl: fields.text({ label: "ABL" }),
            operacoes: fields.text({ label: "Nº de operações" }),
            vagas: fields.text({ label: "Vagas de estacionamento" }),
            mix: fields.text({ label: "Mix / vocação" }),
            // Para o dado que não cabe nos campos fixos. Entra na ficha antes
            // das vagas, que é onde costuma substituir um campo desligado.
            extras: fields.array(
              fields.object({
                label: fields.text({ label: "Rótulo" }),
                valor: fields.text({ label: "Valor" }),
              }),
              {
                label: "Outros dados da ficha",
                itemLabel: (p) => p.fields.label.value || "—",
              },
            ),
          },
          { label: "Ficha técnica" },
        ),
        numerosDestaque: fields.array(
          fields.object({
            valor: fields.text({ label: "Valor (número)" }),
            prefixo: fields.text({ label: "Prefixo (ex.: +)" }),
            sufixo: fields.text({ label: "Sufixo (ex.: %, lojas)" }),
            label: fields.text({ label: "Rótulo" }),
          }),
          {
            label: "Números de destaque",
            itemLabel: (p) =>
              `${p.fields.prefixo.value}${p.fields.valor.value}${p.fields.sufixo.value} — ${p.fields.label.value}`,
          },
        ),
        // Títulos das seções da LP. Vazio mantém o padrão, então só o
        // empreendimento que precisa de outro nome carrega o campo.
        // Como se entra neste empreendimento. Vazio, o bloco não aparece:
        // nem todo projeto tem duas portas de entrada.
        modelosEntrada: fields.array(
          fields.object({
            titulo: fields.text({ label: "Modelo (ex.: Lojista)" }),
            descricao: fields.text({ label: "Como funciona", multiline: true }),
            // Vazio: o card só informa. Com link, ele vira a porta de entrada
            // de uma landing de tráfego (ex.: /empreendimentos/piazza-nicomedes/lojista).
            link: fields.text({
              label: "Link do card (opcional)",
              description:
                "Caminho para onde o card leva, ex.: /empreendimentos/piazza-nicomedes/lojista. Vazio, o card não é clicável.",
            }),
          }),
          {
            label: "Modelos de entrada",
            itemLabel: (p) => p.fields.titulo.value || "—",
          },
        ),
        tituloSobre: fields.text({
          label: "Título da seção do empreendimento (padrão: Feito para performar)",
        }),
        tituloMix: fields.text({
          label: "Título da seção de hubs (padrão: Hubs disponíveis)",
        }),
        mixOperacoes: fields.array(
          fields.object({
            // Opcional: só aparece onde faz sentido. Num strip mall térreo não
            // há pavimento a informar, e um rótulo inventado ali seria
            // informação errada sobre o empreendimento.
            pavimento: fields.text({
              label: "Pavimento (opcional, ex.: Pavimento 1)",
            }),
            categoria: fields.text({ label: "Categoria" }),
            detalhe: fields.text({ label: "Detalhe" }),
          }),
          {
            label: "Mix de operações",
            itemLabel: (p) => p.fields.categoria.value,
          },
        ),
        imagemCard: fields.image({
          label: "Imagem do card",
          directory: "public/images/empreendimentos",
          publicPath: "/images/empreendimentos/",
        }),
        imagemHero: fields.image({
          label: "Imagem do hero da LP",
          directory: "public/images/empreendimentos",
          publicPath: "/images/empreendimentos/",
        }),
        galeria: fields.array(
          fields.object({
            imagem: fields.image({
              label: "Imagem",
              directory: "public/images/empreendimentos",
              publicPath: "/images/empreendimentos/",
            }),
            legenda: fields.text({ label: "Legenda" }),
            /* Preenchido, o item vira vídeo e a imagem acima passa a ser a capa
               dele. Vazio, o item é foto. Um campo só, e não uma segunda lista:
               vídeo e foto entram na mesma ordem da galeria. */
            video: fields.file({
              label: "Vídeo (opcional, mp4)",
              description:
                "Ao preencher, o item vira vídeo e a imagem acima é usada como capa.",
              directory: "public/video",
              publicPath: "/video/",
            }),
          }),
          {
            label: "Galeria",
            itemLabel: (p) =>
              `${p.fields.legenda.value || "Imagem"}${
                p.fields.video.value ? " (vídeo)" : ""
              }`,
          },
        ),
        endereco: fields.text({ label: "Endereço completo" }),
        mapaEmbedUrl: fields.url({ label: "URL de embed do Google Maps" }),
        arte: fields.object(
          {
            accentColor: fields.select({
              label: "Cor de acento",
              description:
                "O azul NEXA sempre domina — o acento colore detalhes (linhas, tags, números)",
              options: [
                { label: "Azul NEXA (padrão)", value: "nexa" },
                { label: "Azul elétrico", value: "eletrico" },
                { label: "Bronze / champagne", value: "bronze" },
                { label: "Petróleo", value: "petroleo" },
                { label: "Grafite", value: "grafite" },
              ],
              defaultValue: "nexa",
            }),
            heroVariant: fields.select({
              label: "Estilo do hero",
              options: [
                { label: "Imersivo (foto em tela cheia)", value: "imersivo" },
                { label: "Split (texto | imagem emoldurada)", value: "split" },
                { label: "Panorâmico (imagem full + overlay)", value: "panoramico" },
              ],
              defaultValue: "imersivo",
            }),
          },
          { label: "Direção de arte da LP" },
        ),
        secoes: fields.object(
          {
            mostrarFicha: fields.checkbox({ label: "Ficha técnica", defaultValue: true }),
            mostrarMix: fields.checkbox({ label: "Mix de operações", defaultValue: true }),
            mostrarGaleria: fields.checkbox({ label: "Galeria", defaultValue: true }),
            mostrarLocalizacao: fields.checkbox({ label: "Localização / mapa", defaultValue: true }),
          },
          { label: "Seções visíveis na LP" },
        ),
        whatsappMensagem: fields.text({
          label: "Mensagem do WhatsApp (CTA da LP)",
          description: "Ex.: Olá! Tenho interesse no Piazza Nicomedes.",
          multiline: true,
        }),
        seo: fields.object(
          {
            metaTitle: fields.text({ label: "Meta title" }),
            metaDescription: fields.text({ label: "Meta description", multiline: true }),
          },
          { label: "SEO" },
        ),
      },
    }),

    marcas: collection({
      label: "Marcas atendidas",
      slugField: "nome",
      path: "content/marcas/*/",
      format: { data: "yaml" },
      columns: ["nome"],
      schema: {
        nome: fields.slug({ name: { label: "Nome" } }),
        logo: fields.image({
          label: "Logo (PNG ou SVG, fundo transparente)",
          directory: "public/images/marcas",
          publicPath: "/images/marcas/",
        }),
        ordem: fields.integer({ label: "Ordem", defaultValue: 0 }),
      },
    }),
  },
});
