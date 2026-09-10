import type { Lead } from "@/lib/leads";
import { registrarLeadNoZaper } from "@/lib/zaper";

/**
 * Registra o lead do formulário no Zaper, do lado do servidor.
 *
 * `registrarLead` (`src/lib/leads.ts`) chama esta rota sem esperar resposta: o
 * WhatsApp já abriu no mesmo gesto do clique, e o registro no CRM corre por
 * fora, sem segurar a conversão. Aqui dentro, sim, o envio é aguardado — é o
 * servidor quem guarda o token do Zaper, ele nunca vai para o navegador, e só
 * depois de tentar o registro a função pode ser encerrada.
 *
 * Até 09/2026 esta rota repassava o lead a um webhook do Make, que criava o
 * contato pelo app do wts.chat. Hoje ela fala com a API do Zaper direto — ver
 * `src/lib/zaper.ts` para o porquê e para as armadilhas dessa API.
 *
 * Sem `ZAPER_API_TOKEN` configurada, o lead cai só no log do servidor: a página
 * continua funcionando normalmente (o WhatsApp já entregou o lead ao
 * comercial), e falta só a variável de ambiente para o Zaper também recebê-lo.
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

  if (!process.env.ZAPER_API_TOKEN) {
    console.error("ZAPER_API_TOKEN não configurada; lead não registrado:", lead);
    return Response.json({ ok: true, registrado: false });
  }

  try {
    const resultado = await registrarLeadNoZaper(lead);
    console.log(
      `Lead de ${lead.lpOrigem} registrado no Zaper: contato ${resultado.contatoId}` +
        `${resultado.contatoReaproveitado ? " (já existia)" : ""}` +
        `, card ${resultado.cardId ?? "não criado"}` +
        `, etiqueta ${resultado.etiqueta ?? "nenhuma"}`,
    );
    return Response.json({ ok: true, registrado: true });
  } catch (erro) {
    // Falha aqui não vira erro para o navegador de propósito: o lead já está
    // com o comercial pelo WhatsApp, e devolver 500 só faria o console da
    // página acusar um problema que não é do visitante.
    console.error("Falha ao registrar lead no Zaper:", erro);
    return Response.json({ ok: true, registrado: false });
  }
}

/**
 * Guarda mínima antes de falar com o Zaper.
 *
 * Não valida tudo que `FormLead` já validou no cliente (isso duplicaria regra
 * de UI numa rota de API) — só o suficiente para não registrar lixo caso a
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
