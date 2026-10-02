import type { BezierDefinition, Variants } from 'framer-motion';

/**
 * Linguagem de movimento do portfólio (Framer Motion).
 * Os nomes de estado são sempre `oculto` → `visivel` → `saida`, para que os filhos
 * herdem a orquestração do pai sem precisar repetir initial/animate.
 */

export const curvaSuave: BezierDefinition = [0.22, 1, 0.36, 1];
export const curvaEntrada: BezierDefinition = [0.4, 0, 1, 1];

export const transicaoPagina: Variants = {
  oculto: { opacity: 0, y: 14 },
  visivel: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: curvaSuave, delayChildren: 0.06 },
  },
  saida: { opacity: 0, y: -10, transition: { duration: 0.24, ease: curvaEntrada } },
};

export const surgir: Variants = {
  oculto: { opacity: 0, y: 22 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.6, ease: curvaSuave } },
};

export const cascata = (intervalo = 0.08, atraso = 0): Variants => ({
  oculto: {},
  visivel: { transition: { staggerChildren: intervalo, delayChildren: atraso } },
});

/** Dispara a animação uma única vez, quando ~20% do elemento entra na tela. */
export const aoEntrarNaTela = {
  initial: 'oculto',
  whileInView: 'visivel',
  viewport: { once: true, amount: 0.2 },
} as const;
