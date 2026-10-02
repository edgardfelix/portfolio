import { useEffect, useRef } from 'react';
import { consulta } from '@/estilos/midias';

/**
 * Holofote que segue o ponteiro: grava a posição em variáveis CSS
 * (--holofote-x / --holofote-y) direto no elemento — zero re-renderizações.
 * Só é ativado em dispositivos com mouse (em toque não há "hover").
 */
export function useHolofote<T extends HTMLElement>() {
  const referencia = useRef<T>(null);

  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento || !window.matchMedia(consulta.ponteiroFino).matches) return;

    let quadro = 0;
    function aoMover(evento: PointerEvent) {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        if (!elemento) return;
        const { left, top } = elemento.getBoundingClientRect();
        elemento.style.setProperty('--holofote-x', `${evento.clientX - left}px`);
        elemento.style.setProperty('--holofote-y', `${evento.clientY - top}px`);
      });
    }

    elemento.addEventListener('pointermove', aoMover);
    return () => {
      elemento.removeEventListener('pointermove', aoMover);
      cancelAnimationFrame(quadro);
    };
  }, []);

  return referencia;
}
