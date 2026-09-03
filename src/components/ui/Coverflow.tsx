"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Quantos cards de cada lado continuam visíveis, em profundidade. */
const VISIVEIS = 2;

/**
 * Posição de cada anel: deslocamento lateral em % da largura do card, recuo em
 * pixels, giro em graus, escala e opacidade.
 *
 * O passo lateral abre a cada anel (58 → 128) enquanto o recuo quase não cresce.
 * É isso que muda a leitura da saída: com recuo grande o card encolhia em
 * direção ao fundo e sumia no meio da cena, dando a impressão de passar por
 * trás. Andando mais para o lado e recuando pouco, ele sai pela borda e o
 * seguinte entra pela borda oposta, que é o que faz o giro parecer sem fim.
 */
const ANEIS = [
  { x: 0, z: 0, giro: 0, escala: 1, opacidade: 1 },
  { x: 58, z: -104, giro: 30, escala: 0.9, opacidade: 0.72 },
  { x: 128, z: -164, giro: 44, escala: 0.76, opacidade: 0.3 },
];
/** Onde o card fica enquanto está fora de vista: bem além da borda. */
const FORA = { x: 210, z: -190, giro: 52, escala: 0.7, opacidade: 0 };

/**
 * No celular o passo lateral encolhe.
 *
 * A tela é pouco mais larga que o card, então com o passo do desktop o primeiro
 * vizinho já cai inteiro fora da vista: sobra um card sozinho, sem nada
 * indicando que há mais para o lado. Encolhido, ele aparece pela borda. É a
 * única diferença entre celular e desktop, e é de espaço, não de mecanismo.
 */
const APERTO_ESTREITO = 0.62;

/** Quanto tempo o avanço automático fica parado depois de uma interação. */
const ESPERA = 8_000;

/**
 * Carrossel em perspectiva: o card central fica de frente e os vizinhos giram,
 * criando profundidade sem competir com o foco.
 *
 * Três decisões que fazem o mecanismo funcionar:
 *
 * 1. O deslocamento de cada card é a distância *circular* até o ativo, então
 *    passando do fim ele reaparece do outro lado — o giro é infinito e nunca
 *    salta de volta ao começo.
 * 2. Quem dá a volta troca de lado sem animar o percurso; fora de vista, a
 *    mudança não é percebida.
 * 3. A mola é frouxa e pesada de propósito: o percurso dura mais que o intervalo
 *    entre trocas, então cada avanço interrompe a mola ainda em movimento e ela
 *    aproveita a velocidade que já tinha. O resultado é deriva contínua, não
 *    disparo-e-parada.
 *
 * O mecanismo é o mesmo em qualquer tela: avança sozinho, aceita arrasto,
 * clique nos laterais e teclado. Qualquer interação — cursor em cima, foco
 * dentro, toque, seta — para o avanço, e ele só volta 8s depois de a interação
 * terminar.
 *
 * As setas só aparecem do tablet para cima. Sobre um card que já ocupa quase a
 * tela inteira elas ficavam por cima da foto, e ali o arrasto já resolve a
 * navegação sem pedir espaço nenhum.
 */
export function Coverflow<T>({
  itens,
  chave,
  children,
  rotulo,
  automatico = true,
  pausado: pausadoExterno = false,
  setas = true,
  // O piso do clamp é a medida do celular: 300px num aparelho de 390 dá 77%
  // da tela, contra 62% de antes, e é o que tira o card daquele tamanho de
  // miniatura. O topo continua governando o desktop.
  alturaClasse = "h-[clamp(310px,50vw,440px)]",
  larguraClasse = "w-[clamp(300px,62vw,600px)]",
  aspecto = "aspect-[4/3]",
  // Quanto os cards laterais desbotam. Sobre fundo escuro o desbote lê como
  // profundidade; sobre fundo claro ele lava a foto e parece desfoque. Por isso
  // é ajustável, em vez de a galeria clara ter de reimplementar o carrossel.
  opacidadeLateral = [1, 0.72, 0.3],
  onCentral,
  aoTrocar,
}: {
  itens: T[];
  chave: (item: T) => string;
  children: (item: T, estado: { central: boolean; oculto: boolean }) => ReactNode;
  rotulo: string;
  automatico?: boolean;
  /** pausa imposta de fora, ex.: um modal aberto */
  pausado?: boolean;
  alturaClasse?: string;
  larguraClasse?: string;
  aspecto?: string;
  /** opacidade do card central e dos dois anéis laterais */
  opacidadeLateral?: readonly [number, number, number];
  /** setas laterais, no desktop, para adiantar o avanço automático */
  setas?: boolean;
  /** clique no card central; sem isso, o clique chega ao próprio conteúdo */
  onCentral?: (item: T, indice: number) => void;
  aoTrocar?: (indice: number) => void;
}) {
  const [ativo, setAtivo] = useState(0);
  const [estreito, setEstreito] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [retomarEm, setRetomarEm] = useState(0);
  const arrastoRef = useRef<number | null>(null);
  const reduce = useReducedMotion();
  const total = itens.length;

  /**
   * Marca o fim de uma interação. O avanço automático só volta 8s depois, para
   * quem estava lendo um card não ser atropelado assim que solta o cursor.
   */
  const interagiu = useCallback(() => setRetomarEm(Date.now() + ESPERA), []);

  useEffect(() => {
    if (retomarEm === 0) return;
    const restante = retomarEm - Date.now();
    if (restante <= 0) {
      setRetomarEm(0);
      return;
    }
    const id = setTimeout(() => setRetomarEm(0), restante);
    return () => clearTimeout(id);
  }, [retomarEm]);

  /**
   * `ativo` é um contador contínuo, não um índice: ele passa de total-1 para
   * total, e não de volta a zero. É isso que dá referência para contar as
   * voltas de cada card lá embaixo — com o módulo aqui, dar a volta e andar
   * uma casa ficavam indistinguíveis. O índice de verdade sai do módulo só
   * onde é preciso.
   */
  const ir = useCallback(
    (proximo: number) => {
      setAtivo(proximo);
      aoTrocar?.(((proximo % total) + total) % total);
      interagiu();
    },
    [total, aoTrocar, interagiu],
  );

  // lista nova (ex.: filtro) recomeça do primeiro
  useEffect(() => {
    setAtivo(0);
  }, [total]);

  // a consulta que resta é só de largura: o passo lateral encolhe em tela
  // estreita, mas o mecanismo é o mesmo em todo lugar
  useEffect(() => {
    const celular = window.matchMedia("(max-width: 767px)");
    const aplicar = () => setEstreito(celular.matches);
    aplicar();
    celular.addEventListener("change", aplicar);
    return () => celular.removeEventListener("change", aplicar);
  }, []);

  useEffect(() => {
    if (!automatico || pausado || pausadoExterno || reduce) return;
    if (retomarEm > 0) return;
    if (total < 2) return;
    const id = setInterval(() => setAtivo((a) => a + 1), 2160);
    return () => clearInterval(id);
  }, [automatico, pausado, pausadoExterno, reduce, retomarEm, total]);

  if (total === 0) return null;

  // no celular o passo lateral encolhe, para o vizinho aparecer pela borda
  const aperto = estreito ? APERTO_ESTREITO : 1;

  const seta =
    "absolute top-1/2 z-[60] hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-current/25 bg-current/5 text-lg backdrop-blur-md transition-colors duration-300 hover:border-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current motion-reduce:transition-none md:flex";

  return (
    <div className="relative">
      {setas && total > 1 && (
        <>
          <button
            type="button"
            onClick={() => ir(ativo - 1)}
            aria-label="Anterior"
            className={`${seta} -left-2 lg:-left-5`}
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            onClick={() => ir(ativo + 1)}
            aria-label="Próximo"
            className={`${seta} -right-2 lg:-right-5`}
          >
            <span aria-hidden>→</span>
          </button>
        </>
      )}

      {/* O trilho sangra até as bordas da janela e corta ali.
          Os cards fora de vista ficam a 210% da própria largura do centro, bem
          além da tela, e sem este corte eles somam largura à página: no celular
          isso vira rolagem lateral. Cortar na largura do container tiraria os
          laterais que aparecem de propósito nas margens, então o corte é na
          janela. Como os cards são centralizados, centralizar na janela ou no
          container dá no mesmo — os dois têm o mesmo centro. */}
      <div className="mx-[calc(50%-50vw)] overflow-hidden">
      <ul
        tabIndex={0}
        aria-label={rotulo}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") ir(ativo + 1);
          if (e.key === "ArrowLeft") ir(ativo - 1);
        }}
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => {
          setPausado(false);
          interagiu();
        }}
        onFocusCapture={() => setPausado(true)}
        onBlurCapture={() => {
          setPausado(false);
          interagiu();
        }}
        onPointerDown={(e) => {
          setPausado(true);
          arrastoRef.current = e.clientX;
        }}
        onPointerUp={(e) => {
          setPausado(false);
          interagiu();
          const inicio = arrastoRef.current;
          arrastoRef.current = null;
          if (inicio === null) return;
          const dx = e.clientX - inicio;
          if (Math.abs(dx) > 40) ir(ativo + (dx < 0 ? 1 : -1));
        }}
        className={`relative touch-pan-y [perspective:1400px] [transform-style:preserve-3d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${alturaClasse}`}
      >
      {itens.map((item, i) => {
        // Distância circular até o ativo, com a volta contada à parte.
        //
        // `voltas` é quantas voltas completas o card já deu, e é o que muda no
        // exato passo em que ele reaparece do outro lado. Antes a normalização
        // era feita com dois ifs e essa informação se perdia: só sobrava o
        // deslocamento novo, e não dava para distinguir "andou uma casa" de
        // "trocou de extremidade".
        // Com dois cards não existe extremidade oposta: eles só trocam de
        // lugar, um passo de cada vez. Contar volta aí remontaria a cada passo,
        // trocando uma animação boa por um piscar.
        const voltas = total > 2 ? Math.round((ativo - i) / total) : 0;
        const desloc =
          total > 2
            ? i - ativo + voltas * total
            : (((i - ativo) % total) + total) % total;
        const dist = Math.abs(desloc);
        const oculto = dist > VISIVEIS;
        const central = desloc === 0;
        const lado = Math.sign(desloc);
        const anel = oculto
          ? FORA
          : { ...ANEIS[dist], opacidade: opacidadeLateral[dist] };

        return (
          // A volta entra na chave: quando o card troca de extremidade, a chave
          // muda, o React remonta o elemento e ele nasce já na posição nova.
          // Sem isso o motion animava do lugar antigo até o novo, e era essa
          // animação que se via cruzando a tela por trás dos outros — o
          // `duration: 0` de baixo não pegava, porque ele só vale enquanto o
          // card está oculto, e no quadro em que ele reaparece a transição já
          // voltou a ser a mola.
          <li
            key={`${chave(item)}#${voltas}`}
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 50 - dist, pointerEvents: oculto ? "none" : "auto" }}
          >
            <motion.div
              // Recém-montado, o card já está no lugar certo e só a opacidade
              // anima: ele aparece onde tem de aparecer, sem percurso.
              initial={{
                x: `${lado * anel.x * aperto}%`,
                rotateY: lado * -anel.giro,
                scale: anel.escala,
                z: anel.z,
                opacity: 0,
              }}
              // num card lateral o clique traz ele para o centro em vez de
              // acionar o conteúdo (que pode ser um link)
              onClickCapture={(e) => {
                if (!central) {
                  e.preventDefault();
                  e.stopPropagation();
                  // pelo deslocamento, e não pelo índice: assim o contador
                  // avança o mínimo e continua contínuo
                  ir(ativo + desloc);
                  return;
                }
                if (onCentral) {
                  e.preventDefault();
                  e.stopPropagation();
                  onCentral(item, i);
                }
              }}
              aria-hidden={oculto}
              className={`${larguraClasse} ${aspecto} [backface-visibility:hidden]`}
              style={{ transformPerspective: 1400 }}
              animate={
                reduce
                  ? { opacity: central ? 1 : 0.4 }
                  : {
                      x: `${lado * anel.x * aperto}%`,
                      rotateY: lado * -anel.giro,
                      scale: anel.escala,
                      z: anel.z,
                      opacity: oculto ? 0 : anel.opacidade,
                    }
              }
              transition={{
                // Era rigidez 18, amortecimento 11 e massa 1,6: uma mola de
                // 1,2s para assentar. Durante todo esse tempo cinco cards
                // grandes ficam em voo, girados em 3D e sobrepostos, e é essa
                // travessia longa que se lê como travamento, ainda mais em
                // máquina que não é a de desenvolvimento. Com 0,44s o gesto
                // continua sendo mola, e não corte seco, mas termina antes de
                // a pessoa reparar que ele está acontecendo.
                type: "spring",
                stiffness: 90,
                damping: 18,
                mass: 1,
                // Fora de vista tudo salta, inclusive a opacidade. Antes só a
                // posição saltava e a opacidade levava 1,1s: durante esse tempo o
                // card já estava do outro lado e ainda visível, dando para ver a
                // peça atravessando a tela.
                //
                // Voltando à vista a opacidade corre bem à frente da posição: em
                // 0,4s o card já está visível, e passa o resto do percurso
                // entrando pela borda. Com os dois no mesmo tempo ele aparecia
                // do nada já quase no lugar, em vez de surgir de fora.
                ...(oculto
                  ? {
                      x: { duration: 0 },
                      rotateY: { duration: 0 },
                      z: { duration: 0 },
                      scale: { duration: 0 },
                      opacity: { duration: 0 },
                    }
                  : { opacity: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
              }}
            >
              {children(item, { central, oculto })}
            </motion.div>
          </li>
        );
      })}
      </ul>
      </div>
    </div>
  );
}
