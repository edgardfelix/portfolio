import { tema } from './tema';

type PontoQuebra = keyof typeof tema.pontosQuebra;

/** Consultas puras — servem tanto ao CSS quanto ao `window.matchMedia`. */
export const consulta = {
  acima: (ponto: PontoQuebra) => `(min-width: ${tema.pontosQuebra[ponto]}px)`,
  abaixo: (ponto: PontoQuebra) => `(max-width: ${tema.pontosQuebra[ponto] - 0.02}px)`,
  toque: '(hover: none) and (pointer: coarse)',
  ponteiroFino: '(hover: hover) and (pointer: fine)',
  movimentoReduzido: '(prefers-reduced-motion: reduce)',
} as const;

/** Uso nos estilos: `${midia.acima('tablet')} { ... }` */
export const midia = {
  acima: (ponto: PontoQuebra) => `@media ${consulta.acima(ponto)}`,
  abaixo: (ponto: PontoQuebra) => `@media ${consulta.abaixo(ponto)}`,
  toque: `@media ${consulta.toque}`,
  ponteiroFino: `@media ${consulta.ponteiroFino}`,
  movimentoReduzido: `@media ${consulta.movimentoReduzido}`,
} as const;
