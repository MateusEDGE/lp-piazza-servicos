"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/whatsapp";

/**
 * Barra fixa de conversão no rodapé do celular.
 *
 * A maior parte do tráfego pago chega pelo celular, onde o botão do herói sai
 * da tela nos primeiros segundos de rolagem. A barra devolve a ação a qualquer
 * altura da página, com as duas vias: o formulário, para quem quer receber a
 * planta, e o WhatsApp, para quem quer falar agora.
 *
 * Só aparece depois do herói (antes disso o botão já está na tela e a barra
 * seria ruído) e some quando o formulário está à vista, para não cobrir o campo
 * que a pessoa está preenchendo. No desktop não existe.
 *
 * Não entra na página de hubs: lá não há formulário, e o botão levaria a uma
 * âncora que não existe.
 */
export function BarraFixa({
  whatsappNumero,
  whatsappMensagem,
  rotuloForm,
}: {
  whatsappNumero: string;
  whatsappMensagem: string;
  rotuloForm: string;
}) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const aoRolar = () => {
      const passouHero = window.scrollY > window.innerHeight * 0.7;
      const form = document.getElementById("formulario");
      const formAVista = form
        ? form.getBoundingClientRect().top < window.innerHeight * 0.85
        : false;
      setVisivel(passouHero && !formAVista);
    };
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/12 bg-nexa-deep/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none lg:hidden ${
        visivel ? "translate-y-0" : "translate-y-full"
      }`}
      // fora de vista a barra não recebe foco por teclado nem leitura de tela
      inert={!visivel}
    >
      <div className="flex items-center gap-2.5 pb-[env(safe-area-inset-bottom)]">
        <a
          href="#formulario"
          className="flex-1 rounded-[var(--radius-brand)] bg-lp-accent px-4 py-3.5 text-center text-[14px] font-semibold uppercase tracking-wider text-lp-accent-contrast"
        >
          {rotuloForm}
        </a>
        <a
          href={waLink(whatsappNumero, whatsappMensagem)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[var(--radius-brand)] border border-white/45 px-4 py-3.5 text-[14px] font-semibold uppercase tracking-wider text-white"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
