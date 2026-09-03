import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

const handlers = makeRouteHandler({ config });

/**
 * Mesma trava do `src/app/keystatic/layout.tsx`, do lado da API.
 *
 * Esconder a tela não bastaria: as rotas de leitura e escrita do painel ficam
 * aqui, e no modo local elas gravam no disco do servidor sem pedir login. Em
 * produção sem GitHub mode, portanto, a API também não responde — senão a
 * página some e o endereço continua aceitando escrita.
 */
function bloqueado() {
  return (
    process.env.NODE_ENV === "production" && !process.env.KEYSTATIC_GITHUB_REPO
  );
}

export async function GET(...args: Parameters<typeof handlers.GET>) {
  if (bloqueado()) return new Response("Not found", { status: 404 });
  return handlers.GET(...args);
}

export async function POST(...args: Parameters<typeof handlers.POST>) {
  if (bloqueado()) return new Response("Not found", { status: 404 });
  return handlers.POST(...args);
}
