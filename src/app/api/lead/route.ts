import type { Lead } from "@/lib/leads";

/**
 * Encaminha o lead do formulário para o Zaper, do lado do servidor.
 *
 * `registrarLead` (`src/lib/leads.ts`) chama esta rota sem esperar resposta: o
 * WhatsApp já abriu no mesmo gesto do clique, e o registro no CRM do cliente
 * corre por fora, sem segurar a conversão. Aqui dentro, sim, o envio ao Zaper
 * é aguardado — é o servidor quem guarda a URL do webhook, ela nunca vai para
 * o navegador, e só depois de tentar o envio a função pode ser encerrada.
 *
 * Sem `ZAPER_WEBHOOK_URL` configurada, o lead cai só no log do servidor: a
 * página continua funcionando normalmente (o WhatsApp já entregou o lead ao
 * comercial), e falta só a variável de ambiente para o Zaper também recebê-lo.
 *
 * `ZAPER_WEBHOOK_TOKEN` é opcional, para o dia em que o Zaper (ou o Zapier no
 * meio do caminho, se for esse o desenho escolhido) exigir autenticação: com
 * ela definida, viaja como `Authorization: Bearer <token>`; sem ela, a
 * requisição sai sem esse cabeçalho.
 */
export async function POST(request: Request) {
  let lead: unknown;
  try {
    lead = await request.json();
  } catch {
    return new Response("JSON inválido", { status: 400 });
  }

  if (!ehLeadValido(lead)) {
    return new Response("Lead incompleto", { status: 400 });
  }

  const webhook = process.env.ZAPER_WEBHOOK_URL;
  if (!webhook) {
    console.error("ZAPER_WEBHOOK_URL não configurada; lead não encaminhado:", lead);
    return Response.json({ ok: true, encaminhado: false });
  }

  const token = process.env.ZAPER_WEBHOOK_TOKEN;
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (token) headers.authorization = `Bearer ${token}`;

  try {
    const resposta = await fetch(webhook, {
      method: "POST",
      headers,
      body: JSON.stringify(lead),
      // O outro lado processa o lead depois de responder; 8s é folga de sobra
      // para a ida e volta, e evita segurar a function presa a um hook fora do ar.
      signal: AbortSignal.timeout(8000),
    });
    if (!resposta.ok) {
      console.error(`Webhook do Zaper respondeu ${resposta.status} para o lead:`, lead);
    }
  } catch (erro) {
    console.error("Falha ao encaminhar lead para o Zaper:", erro);
  }

  return Response.json({ ok: true, encaminhado: true });
}

/**
 * Guarda mínima antes de repassar ao Zaper.
 *
 * Não valida tudo que `FormLead` já validou no cliente (isso duplicaria regra
 * de UI numa rota de API) — só o suficiente para não encaminhar lixo caso a
 * rota seja chamada fora do formulário: precisa parecer um `Lead`, com nome e
 * telefone preenchidos.
 */
function ehLeadValido(lead: unknown): lead is Lead {
  if (typeof lead !== "object" || lead === null) return false;
  const { nome, telefone } = lead as Record<string, unknown>;
  return (
    typeof nome === "string" &&
    nome.trim().length > 0 &&
    typeof telefone === "string" &&
    telefone.trim().length > 0
  );
}
