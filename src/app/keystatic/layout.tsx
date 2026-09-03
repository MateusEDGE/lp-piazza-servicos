import { notFound } from "next/navigation";

/**
 * Porta do painel de administração.
 *
 * O Keystatic tem dois modos. Em `local` ele grava direto nos arquivos e **não
 * pede login nenhum** — é o modo de desenvolvimento, e é o certo enquanto a
 * edição acontece nesta máquina. Em `github` a edição vira commit no
 * repositório, e quem entra precisa autenticar no GitHub e ter permissão de
 * escrita: é esse o "usuário admin".
 *
 * O risco que este arquivo fecha: um deploy em servidor próprio (o
 * `output: standalone` do next.config) sem `KEYSTATIC_GITHUB_REPO` subiria o
 * painel no modo local, e aí `/keystatic` ficaria aberto na internet, sem
 * senha, com permissão de escrever no conteúdo do site. Em produção sem GitHub
 * mode a rota simplesmente não existe.
 *
 * Para liberar o painel em produção, ver `deploy/ADMIN.md`.
 */
export default function KeystaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const modoLocal = !process.env.KEYSTATIC_GITHUB_REPO;
  if (process.env.NODE_ENV === "production" && modoLocal) notFound();
  return children;
}
