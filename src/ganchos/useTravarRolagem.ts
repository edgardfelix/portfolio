import { useEffect } from 'react';

/**
 * Trava a rolagem do documento enquanto `ativo` for verdadeiro (menus, diálogos).
 * Como o <html> reserva o espaço da barra (scrollbar-gutter: stable), nada se desloca.
 */
export function useTravarRolagem(ativo: boolean): void {
  useEffect(() => {
    if (!ativo) return;
    const raiz = document.documentElement;
    const anterior = raiz.style.overflow;
    raiz.style.overflow = 'hidden';
    return () => {
      raiz.style.overflow = anterior;
    };
  }, [ativo]);
}
