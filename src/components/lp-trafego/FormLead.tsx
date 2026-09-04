"use client";

import { useId, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionShell } from "@/components/ui/SectionShell";
import {
  capturarOrigem,
  empurrarEventoLead,
  linkLead,
  registrarLead,
  type Lead,
} from "@/lib/leads";
import type { AtivoLp, PublicoLp } from "./types";

/**
 * O formulário — o destino de todos os botões da página.
 *
 * Três campos obrigatórios e um opcional. Cada campo a mais é conversão a
 * menos, então só fica de pé o que o comercial precisa para responder com
 * proposta: quem é, como falar e o que a pessoa quer. O e-mail é opcional
 * porque o retorno acontece no WhatsApp.
 *
 * O último campo é o que qualifica o lead, e ele muda de formato conforme a
 * página: nas landings de lojista é texto livre (o nome do negócio), na do
 * investidor é uma lista fechada (o perfil de quem investe). Quem manda é a
 * copy — `form.campo` na configuração do público —, e não um `if` de slug aqui
 * dentro.
 *
 * No envio, a janela do WhatsApp abre no mesmo gesto do clique — sem `await`
 * antes, senão o bloqueador de pop-up derruba a aba — com a mensagem já
 * montada e qualificada. O registro no CRM (ver `src/lib/leads.ts`) corre por
 * fora e não segura nada.
 */
export function FormLead({
  publico,
  ativo,
  lpOrigem = "site-nexamalls",
}: {
  publico: PublicoLp;
  ativo: AtivoLp;
  /**
   * Qual LP publicada é esta, para o Zaper distinguir leads de conteúdo
   * idêntico em domínios diferentes (ver o campo `lpOrigem` em `Lead`).
   *
   * As páginas do site institucional não passam esta prop — o padrão
   * `"site-nexamalls"` já as identifica. Cada projeto gerado por
   * `scripts/gerar-lp.mjs` passa o seu próprio valor, fixo, vindo de
   * `@/config/lp`.
   */
  lpOrigem?: string;
}) {
  const id = useId();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [qualificacao, setQualificacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const { campo } = publico.form;
  const ehLista = Boolean(campo.opcoes?.length);

  function montarLead(): Lead {
    return {
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim(),
      qualificacao: qualificacao.trim(),
      qualificacaoLabel: campo.rotuloLead,
      publico: publico.slug,
      empreendimento: ativo.nome,
      lpOrigem,
      origem: capturarOrigem(),
    };
  }

  function aoEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const digitos = telefone.replace(/\D/g, "");
    if (nome.trim().length < 2) return setErro("Informe o seu nome.");
    if (digitos.length < 10)
      return setErro("Informe um telefone com DDD, por favor.");
    if (!qualificacao.trim()) return setErro(campo.label);
    setErro(null);

    const lead = montarLead();

    // Antes do `window.open`, e não depois: o push é síncrono e não custa
    // nada, mas qualquer coisa entre o clique e a abertura da janela é risco
    // de o navegador tratar o pop-up como não solicitado. O slug do ativo é o
    // que o GTM espera; `ativo.nome` continua sendo o que o comercial lê.
    empurrarEventoLead(lead, ativo.slug);

    window.open(
      linkLead(lead, ativo.whatsappNumero),
      "_blank",
      "noopener,noreferrer",
    );
    registrarLead(lead);
    setEnviado(true);
  }

  const estiloCampo =
    "w-full rounded-[var(--radius-brand)] border border-nexa-ink/15 bg-white px-4 py-3.5 text-[16px] text-nexa-ink outline-none transition-colors duration-200 placeholder:text-nexa-mist focus:border-lp-accent motion-reduce:transition-none";
  const rotulo =
    "block text-[11px] font-bold uppercase tracking-[0.16em] text-nexa-soft";

  return (
    // scroll-mt compensa o cabeçalho fixo: sem isso o salto pela âncora para
    // com o menu cobrindo o primeiro campo do formulário
    <SectionShell id="formulario" tone="light" compacto className="scroll-mt-24">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-center lg:gap-20">
        <div>
          <Reveal>
            <p className="label-editorial text-lp-accent">Fale com o time</p>
            <h2 className="display-editorial mt-4 text-nexa-ink">
              {publico.form.titulo}
            </h2>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-nexa-soft">
              {publico.form.texto}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-9 space-y-3">
              {[
                "Tenha acesso ao nosso time comercial",
                "Planta, metragens e condições desta fase",
                "Sem custo e sem compromisso",
              ].map((linha) => (
                <li
                  key={linha}
                  className="flex items-start gap-3 text-[15px] text-nexa-soft"
                >
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rotate-45 bg-lp-accent"
                  />
                  {linha}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="rounded-[var(--radius-brand)] border border-nexa-ink/10 bg-white p-6 shadow-[0_26px_60px_-30px_rgba(14,20,48,0.5)] md:p-8">
            {enviado ? (
              <div className="py-6 text-center">
                <p className="heading-nexa text-[1.5rem] text-nexa-ink">
                  Pronto, {nome.trim().split(" ")[0]}!
                </p>
                <p className="mt-4 text-[16px] leading-relaxed text-nexa-soft">
                  Abrimos o WhatsApp com a sua mensagem já preenchida. Se a
                  janela não tiver aberto, toque no botão abaixo.
                </p>
                <a
                  href={linkLead(montarLead(), ativo.whatsappNumero)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shine mt-7 inline-flex items-center justify-center rounded-[var(--radius-brand)] bg-lp-accent px-8 py-4 text-[15px] font-semibold uppercase tracking-wider text-lp-accent-contrast transition-[filter] duration-300 hover:brightness-110 motion-reduce:transition-none"
                >
                  Abrir o WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={aoEnviar} noValidate className="space-y-5">
                <div>
                  <label className={rotulo} htmlFor={`${id}-nome`}>
                    Nome
                  </label>
                  <input
                    id={`${id}-nome`}
                    name="nome"
                    autoComplete="name"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Como podemos te chamar"
                    className={`mt-2 ${estiloCampo}`}
                  />
                </div>

                <div>
                  <label className={rotulo} htmlFor={`${id}-tel`}>
                    WhatsApp
                  </label>
                  <input
                    id={`${id}-tel`}
                    name="telefone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={telefone}
                    onChange={(e) =>
                      setTelefone(mascaraTelefone(e.target.value))
                    }
                    placeholder="(34) 99999-9999"
                    className={`mt-2 ${estiloCampo}`}
                  />
                </div>

                <div>
                  <label className={rotulo} htmlFor={`${id}-email`}>
                    E-mail{" "}
                    <span className="normal-case tracking-normal">
                      (opcional)
                    </span>
                  </label>
                  <input
                    id={`${id}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@empresa.com.br"
                    className={`mt-2 ${estiloCampo}`}
                  />
                </div>

                <div>
                  <label className={rotulo} htmlFor={`${id}-qualificacao`}>
                    {campo.label}
                  </label>
                  {ehLista ? (
                    <select
                      id={`${id}-qualificacao`}
                      name="qualificacao"
                      value={qualificacao}
                      onChange={(e) => setQualificacao(e.target.value)}
                      className={`mt-2 appearance-none ${estiloCampo} ${
                        qualificacao ? "" : "text-nexa-mist"
                      }`}
                    >
                      <option value="">Selecione</option>
                      {campo.opcoes?.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`${id}-qualificacao`}
                      name="qualificacao"
                      autoComplete="organization"
                      value={qualificacao}
                      onChange={(e) => setQualificacao(e.target.value)}
                      placeholder={campo.placeholder}
                      className={`mt-2 ${estiloCampo}`}
                    />
                  )}
                </div>

                {erro && (
                  <p
                    role="alert"
                    className="text-[14px] font-semibold text-[#b3261e]"
                  >
                    {erro}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-shine w-full rounded-[var(--radius-brand)] bg-lp-accent px-6 py-[1.15rem] text-[16px] font-semibold uppercase tracking-wider text-lp-accent-contrast transition-[filter] duration-300 hover:brightness-110 motion-reduce:transition-none"
                >
                  {publico.form.botao}
                </button>

                <p className="text-center text-[12px] leading-relaxed text-nexa-mist">
                  Ao enviar, você autoriza o contato do time comercial da Nexa
                  Malls sobre o {ativo.nome}. Seus dados não são compartilhados
                  com terceiros.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

/** Máscara de telefone brasileiro, com 8 ou 9 dígitos depois do DDD. */
function mascaraTelefone(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
