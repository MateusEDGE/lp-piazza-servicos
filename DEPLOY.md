# Deploy na Vercel — LPs do Piazza Nicomedes

Guia para quem vai publicar. Cinco landing pages, cinco repositórios, cinco
projetos Vercel — um para cada. Não há build especial: é Next.js 15 (App
Router), a Vercel detecta sozinha.

## Os cinco repositórios (GitHub, conta MateusEDGE, privados)

| Landing page | Repositório | Rotas |
|---|---|---|
| Lojista (página de hubs) | `MateusEDGE/lp-piazza-lojista` | `/`, `/saude`, `/servicos`, `/gastronomia` |
| Investidor | `MateusEDGE/lp-piazza-investidor` | `/` |
| Saúde e bem-estar | `MateusEDGE/lp-piazza-saude` | `/` |
| Serviços | `MateusEDGE/lp-piazza-servicos` | `/` |
| Gastronomia | `MateusEDGE/lp-piazza-gastronomia` | `/` |

Todos na branch `main`. Cada push em `main` deve virar deploy de produção.

## Passo a passo (repetir para cada um dos 5)

1. Vercel → **Add New… → Project** → **Import** o repositório do GitHub
   (autorize o app da Vercel na conta MateusEDGE na primeira vez).
2. Framework: **Next.js** (detectado). Build e output: **deixar o padrão**.
   Root directory: a raiz do repositório.
3. **Environment Variables** (Production): as da tabela abaixo.
4. **Deploy.** O primeiro build leva ~2 min.
5. **Settings → Domains**: adicionar o domínio daquela LP e apontar o DNS
   conforme a Vercel indicar (CNAME `cname.vercel-dns.com` para subdomínio;
   A `76.76.21.21` para domínio raiz).
6. Rodar o teste da seção "Depois do deploy".

## Variáveis de ambiente

| Variável | Valor | Onde |
|---|---|---|
| `ZAPER_WEBHOOK_URL` | a URL do webhook do Make (está no documento interno de entrega e no painel do Make → cenário "Integration Webhooks" → módulo Webhooks). Não fica neste repositório porque ele é público. | nos 5 |
| `NEXT_PUBLIC_SITE_URL` | o domínio final da LP, com `https://` e sem barra no fim | nos 5 (valor diferente em cada) |
| `NEXT_PUBLIC_URL_INVESTIDOR` | o domínio final da LP de investidor | só no `lp-piazza-lojista` |

- `ZAPER_WEBHOOK_URL` é o que liga o formulário ao CRM. **Mesma URL nos 5** —
  cada LP já se identifica no payload (`lpOrigem`). Trate como semi-sigilosa:
  quem tiver a URL consegue injetar leads.
- `NEXT_PUBLIC_SITE_URL` alimenta sitemap, robots e imagem de compartilhamento.
  Sem ela o build usa o endereço `*.vercel.app`, o que só importa até o domínio
  final estar no ar — mas configure já.
- Opcionais, só se quiserem editar conteúdo pelo painel `/keystatic` em
  produção: `KEYSTATIC_GITHUB_REPO=MateusEDGE/<repo>` e as credenciais do
  GitHub App (ver `.env.example` no repositório). Sem elas o painel simplesmente
  não existe em produção, de propósito.
- Nunca commitar `.env` — o `.gitignore` já bloqueia.

## Depois do deploy: teste de ponta a ponta (por LP)

1. Abra a LP no domínio final, preencha o formulário com um lead de teste
   (nome começando com **TESTE**), envie.
2. O WhatsApp deve abrir com a mensagem pronta — essa parte não depende do CRM.
3. No Zaper (CRM → Contatos), em até 1 minuto deve existir o contato com:
   - **etiqueta** `LP-PIAZZA-SAUDE` / `-SERVICOS` / `-GASTRONOMIA` /
     `-INVESTIDOR` / `-LOJISTA`, conforme a LP;
   - anotação `LP: <lpOrigem> | Público: … | … | Campanha: …`;
   - campos **Segmento** e **Nome Loja** preenchidos.
4. Confira `https://<dominio>/sitemap.xml` — as URLs devem usar o domínio
   final, não `vercel.app`.
5. Apague o contato de teste no Zaper.

Se o contato não aparecer: o formulário continua funcionando (o lead chegou
pelo WhatsApp); o erro fica no log do projeto na Vercel (Functions → `/api/lead`)
e no histórico do cenário no Make.

## O que fica de pé por trás (não mexer sem avisar)

- **Make.com** — conta `leads.nexamalls@gmail.com` (usuário "NEXA"), cenário
  **"Integration Webhooks"**, precisa estar **ativo**. É ele que recebe o webhook
  e cria o contato no Zaper (módulo wts.chat → Create Contact).
- **Zaper** — a conexão do Make usa um token de API do Zaper. Revogar esse token
  derruba a integração. As 5 etiquetas `LP-PIAZZA-*` precisam existir no Zaper
  (já existem); o cenário manda o nome exato.
- Plano grátis do Make: 2 créditos por lead, ~500 leads/mês. Se o tráfego
  passar disso, é o primeiro limite a bater.

## Se precisar mudar o código

O código das 5 LPs é gerado a partir do site institucional
(`site-nexamalls`, script `scripts/gerar-lp.mjs`). Ajuste pontual pode ser
feito direto no repositório da LP; mudança de conteúdo do empreendimento
(metragens, fotos, textos do CMS) deve ser feita nos dois lados, porque os
repositórios não se sincronizam sozinhos.
