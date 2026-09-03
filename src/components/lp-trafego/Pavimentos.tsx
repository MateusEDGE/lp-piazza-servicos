import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/Tilt";
import { SectionShell } from "@/components/ui/SectionShell";
import { SeloIlustrativo } from "@/components/ui/SeloIlustrativo";
import { VideoPavimentos } from "./VideoPavimentos";
import type { AtivoLp, PublicoLp } from "./types";
import { altFoto } from "@/lib/empreendimentos";

/**
 * Os três pavimentos do empreendimento, lidos pelo interesse do público.
 *
 * A ordem vem da copy, em `publico.pavimentos`, e não é a mesma nas quatro
 * páginas: em gastronomia e saúde o andar do público abre a lista, e em
 * serviços e investidor a lista segue a numeração do prédio. O destaque é
 * independente da ordem: na página do investidor nenhum pavimento é destacado,
 * porque ali os três valem igual.
 */
export function Pavimentos({
  publico,
  ativo,
  tone = "tint",
}: {
  publico: PublicoLp;
  ativo: AtivoLp;
  tone?: "tint" | "none";
}) {
  const escuro = tone === "none";
  return (
    <SectionShell tone={tone} compacto>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
        <div>
          <Reveal>
            <p className="label-editorial text-lp-accent">O empreendimento</p>
            <h2
              className={`display-editorial mt-4 ${escuro ? "text-white" : "text-nexa-ink"}`}
            >
              {publico.tituloPavimentos ?? "Três pavimentos, três vocações"}
            </h2>
            <p
              className={`mt-6 max-w-xl text-[17px] leading-relaxed ${escuro ? "text-white/80" : "text-nexa-soft"}`}
            >
              {publico.textoPavimentos ??
                `Cada pavimento do ${ativo.nome} tem uma vocação definida no masterplan, e é a soma delas que faz o mesmo cliente vir mais de uma vez por semana.`}
            </p>
          </Reveal>

          <ul className="mt-10 space-y-3">
            {publico.pavimentos.map((p, i) => (
              <li key={p.pavimento}>
                <Reveal delay={0.08 + i * 0.06}>
                  <Tilt grau={10} escala={1.02}>
                    <div
                      className={`flex flex-wrap items-baseline gap-x-4 gap-y-2 rounded-[var(--radius-brand)] border p-5 shadow-[0_14px_36px_-26px_rgba(14,20,48,0.8)] transition-colors duration-300 motion-reduce:transition-none md:p-6 ${
                        p.destaque
                          ? "border-lp-accent bg-lp-accent-soft"
                          : escuro
                            ? "border-white/12 bg-white/[0.06]"
                            : "border-nexa-ink/10 bg-white"
                      }`}
                    >
                      <span
                        className={`text-[11px] font-bold uppercase tracking-[0.18em] ${escuro ? "text-white/50" : "text-nexa-mist"}`}
                      >
                        {p.pavimento}
                      </span>
                      <h3
                        className={`heading-nexa text-[1.4rem] md:text-[1.6rem] ${escuro ? "text-white" : "text-nexa-ink"}`}
                      >
                        {p.categoria}
                      </h3>
                      {p.destaque && (
                        <span className="rounded-full bg-lp-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-lp-accent-contrast">
                          Seu andar
                        </span>
                      )}
                      <p
                        className={`w-full text-[15px] leading-relaxed ${escuro ? "text-white/75" : "text-nexa-soft"}`}
                      >
                        {p.detalhe}
                      </p>
                    </div>
                  </Tilt>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={0.12}>
          {/* Na página do investidor este espaço mostra o vídeo do projeto, e
              não uma foto: quem avalia o ativo quer ver o conjunto, e o vídeo
              entrega em segundos o que três fotos não dão. Ele tem visor
              próprio, sempre vertical (ver VideoPavimentos). */}
          {publico.videoPavimentos && ativo.video ? (
            <VideoPavimentos
              src={ativo.video.src}
              capa={ativo.video.capa}
              nome={ativo.nome}
            />
          ) : (
            <div className={`relative overflow-hidden rounded-[var(--radius-brand)] border-4 ${escuro ? "border-white/20" : "border-white"} shadow-[0_22px_54px_rgba(14,20,48,0.3)]`}>
              <Image
                src={publico.imagemPavimentos}
                alt={altFoto(ativo.nome, legendaDa(ativo, publico.imagemPavimentos))}
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="h-full w-full object-cover"
              />
              <SeloIlustrativo />
            </div>
          )}
        </Reveal>
      </div>
    </SectionShell>
  );
}

/**
 * A legenda que o CMS deu a esta foto.
 *
 * O texto alternativo era fixo, e ficou errado quando serviços e saúde trocaram
 * a imagem desta seção. Buscar pela fonte mantém os dois sempre juntos.
 */
function legendaDa(ativo: AtivoLp, src: string): string {
  return ativo.galeria.find((g) => g.src === src)?.legenda ?? "projeto";
}
