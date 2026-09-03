import { SLUG } from "@/config/lp";
import { getAtivoLp } from "./ativo-lp";

/**
 * O empreendimento desta landing, ou uma parada com a razão dita.
 *
 * `getAtivoLp` devolve nulo em dois casos, e os dois são problema de conteúdo,
 * não de código: o empreendimento não existe no CMS, ou existe com "Tem landing
 * page?" desmarcado. Aqui isso derruba o build com o motivo escrito, em vez de
 * gerar uma página vazia ou um 404 que ninguém entende no ar.
 */
export async function ativoDaLanding() {
  const ativo = await getAtivoLp(SLUG);
  if (!ativo) {
    throw new Error(
      `Conteúdo ausente: "${SLUG}" não foi encontrado no CMS, ou está com "Tem landing page?" desmarcado. A landing inteira depende dele.`,
    );
  }
  return ativo;
}
