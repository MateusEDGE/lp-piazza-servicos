# lp-piazza-servicos

Landing page de tráfego pago do Piazza Nicomedes — hub de serviços.

Projeto Next independente, com domínio próprio, gerado a partir do site
`site-nexamalls` por `scripts/gerar-lp.mjs`. A mesma landing continua no ar
dentro do site, em `nexamalls.com.br/empreendimentos/piazza-nicomedes/lojista/servicos`:
este repositório não a substitui, ele a coloca num endereço só dela, para o
tráfego pago.

## Rotas

```
/                    a landing
```

Não há menu, home, portfólio nem rodapé institucional. Em página que recebe
clique pago, todo link que não leva à conversão é uma porta de saída paga: aqui
sobram a marca, a página, o formulário e um link para o site no rodapé, que é
onde quem quer pesquisar a empresa antes de responder vai olhar.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

O conteúdo é editado em `/keystatic`, que em desenvolvimento abre sem login e
grava direto nos arquivos de `content/`. Em produção o painel só existe com
`KEYSTATIC_GITHUB_REPO` configurada, e aí a edição vira commit neste
repositório, com login do GitHub. Sem ela, `/keystatic` e a API dele respondem
404 em produção, de propósito.

## Variáveis de ambiente

Estão comentadas uma a uma em `.env.example`. A única obrigatória em produção
é `NEXT_PUBLIC_SITE_URL`, com o domínio real.

## O que este projeto compartilha com o site, e o que não

Compartilha o **código**: os componentes da landing e a copy foram copiados de
`site-nexamalls` e são os mesmos, arquivo por arquivo.

Compartilha o **formato do conteúdo**: o `keystatic.config.ts` daqui é um
recorte do de lá, então o YAML de `content/empreendimentos/piazza-nicomedes/` é
lido igual nos dois.

**Não** compartilha o conteúdo em si. Os dois repositórios têm cópias do mesmo
YAML, e a partir do primeiro commit elas seguem vidas separadas. Quando o dado
for do empreendimento (metragem, vagas, número de operações, fotos da galeria,
percentual comercializado), corrija nos dois lugares: é o mesmo imóvel, e o
visitante pode ver as duas páginas na mesma pesquisa.

## Regras de copy herdadas

1. Nenhuma projeção de rentabilidade, VGV ou ticket de entrada em página aberta.
2. Escassez só com fato verificável, e vindo do CMS.
3. Nenhum travessão em texto que a pessoa lê: em dois pontos, vírgula ou
   parênteses, conforme a frase pedir.
