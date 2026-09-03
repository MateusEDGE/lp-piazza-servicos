/**
 * Aviso de imagem ilustrativa, no canto inferior direito da peça.
 *
 * Vale para render, foto de empreendimento e vídeo — material que representa um
 * projeto e não um estado de fato. Fora daí ele não entra: num logo de marca ou
 * no retrato de alguém do organograma o aviso seria falso, porque nenhum dos
 * dois ilustra coisa nenhuma.
 *
 * O pai precisa ser `relative`. O selo não recebe eventos, então continua
 * possível clicar na imagem por baixo dele.
 */
export function SeloIlustrativo({
  className = "",
}: {
  /** ajuste fino de posição quando a peça tem legenda ou borda no caminho */
  className?: string;
}) {
  return (
    // Sem placa: o aviso é só o texto. O que sustenta a leitura sobre foto
    // clara é a sombra, que acompanha as letras em vez de desenhar um retângulo
    // por cima da imagem.
    <span
      className={`pointer-events-none absolute bottom-2 right-3 z-20 select-none text-[8px] font-medium uppercase tracking-[0.14em] text-white/70 [text-shadow:0_1px_3px_rgba(6,10,32,0.95)] md:bottom-3 md:right-4 md:text-[9px] ${className}`}
    >
      Imagem meramente ilustrativa
    </span>
  );
}
