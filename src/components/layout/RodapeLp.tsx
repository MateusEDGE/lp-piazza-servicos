import { Logo } from "@/components/ui/Logo";
import { PAGINA_NO_SITE } from "@/config/lp";

/**
 * Rodapé mínimo da landing.
 *
 * Não é o rodapé do site: sem menu, sem sitemap, sem redes. Fica só o que uma
 * página de anúncio precisa carregar: identificação de quem está anunciando,
 * contato, o aviso de material publicitário e um caminho para o site
 * institucional, que é onde quem quer pesquisar a empresa antes de responder
 * vai olhar.
 */
export function RodapeLp({
  empreendimento,
  enderecoDoAtivo,
  endereco,
  telefone,
  email,
}: {
  empreendimento: string;
  enderecoDoAtivo: string;
  endereco: string;
  telefone: string;
  email: string;
}) {
  return (
    <footer className="border-t border-white/10 bg-nexa-deep py-12 text-white/60">
      <div className="container-wide">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo color="white" className="h-6" />
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed">
              {endereco}
            </p>
            <p className="mt-3 text-[14px]">
              {telefone} · {email}
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
              {empreendimento}
            </p>
            <p className="mt-3 text-[14px]">{enderecoDoAtivo}</p>
            {/* O único link para fora da landing, e é de propósito: quem quer
                pesquisar a empresa antes de responder procura isso, e é sinal
                de confiança para as plataformas de anúncio. */}
            <a
              href={PAGINA_NO_SITE}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-[14px] font-semibold text-white/80 underline-offset-4 hover:underline"
            >
              Página do empreendimento no site
            </a>
          </div>
        </div>

        <p className="mt-10 border-t border-white/10 pt-7 text-[12px] leading-relaxed text-white/40">
          Material publicitário sem valor contratual. Imagens meramente
          ilustrativas, sujeitas a alterações de projeto. Disponibilidade de
          unidades, metragens e condições comerciais sujeitas a confirmação pelo
          time comercial no momento da negociação. © {new Date().getFullYear()}{" "}
          Nexa Malls.
        </p>
      </div>
    </footer>
  );
}
