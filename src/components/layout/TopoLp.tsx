import { Logo } from "@/components/ui/Logo";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";

/**
 * Topo da landing de tráfego.
 *
 * Não é o header do site: aqui não há menu, nem link para o portfólio, nem
 * caminho de volta para a home. Numa página que recebe clique pago, todo link
 * que não leva à conversão é uma porta de saída paga. Sobram a marca, que dá
 * confiança, e um botão.
 */
export function TopoLp({
  whatsappNumero,
  whatsappMensagem,
}: {
  whatsappNumero: string;
  whatsappMensagem: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-nexa-deep/85 backdrop-blur-md">
      <div className="container-wide flex items-center justify-between gap-4 py-3.5">
        <Logo color="white" className="h-5 md:h-6" />

        <WhatsAppCTA
          numero={whatsappNumero}
          mensagem={whatsappMensagem}
          variant="knock"
          className="!px-5 !py-2.5 !text-[13px] md:!px-6 md:!py-3 md:!text-[14px]"
        >
          Falar no WhatsApp
        </WhatsAppCTA>
      </div>
    </header>
  );
}
