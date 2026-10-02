/**
 * Design system. A paleta é ESTRITA: três cores. Toda variação nasce de opacidade
 * aplicada sobre elas — nenhuma cor nova (nem branco, nem cinza) entra no projeto.
 */
const paleta = {
  fundo: '#05050A',
  destaque: '#00FF66',
  brilho: '#00F0FF',
} as const;

/** "#RRGGBB" + alfa (0–1) → "rgba(r, g, b, a)". */
export function comAlfa(hex: string, alfa: number): string {
  const valor = Number.parseInt(hex.slice(1), 16);
  const r = (valor >> 16) & 255;
  const g = (valor >> 8) & 255;
  const b = valor & 255;
  const a = Math.min(1, Math.max(0, alfa));
  return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
}

const { fundo, destaque, brilho } = paleta;

export const tema = {
  cores: {
    ...paleta,
    /* Contraste sobre o fundo: texto ≈ 10:1 · textoSuave ≈ 6:1 · textoApagado só decorativo */
    texto: comAlfa(destaque, 0.86),
    textoSuave: comAlfa(destaque, 0.64),
    textoApagado: comAlfa(destaque, 0.42),
    brilhoSuave: comAlfa(brilho, 0.74),
    superficie: comAlfa(destaque, 0.035),
    superficieElevada: comAlfa(destaque, 0.07),
    borda: comAlfa(destaque, 0.16),
    bordaForte: comAlfa(destaque, 0.4),
    bordaBrilho: comAlfa(brilho, 0.42),
    veu: comAlfa(fundo, 0.72),
    veuDenso: comAlfa(fundo, 0.92),
  },

  fontes: {
    mono: "'JetBrains Mono Variable', 'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
  },

  tamanhos: {
    micro: '0.6875rem',
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    md: 'clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)',
    lg: 'clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)',
    xl: 'clamp(1.625rem, 1.3rem + 1.4vw, 2.5rem)',
    xxl: 'clamp(2.25rem, 1.5rem + 3.2vw, 4rem)',
    gigante: 'clamp(2.6rem, 1rem + 7vw, 6.75rem)',
  },

  pesos: { regular: 400, medio: 500, seminegrito: 600, negrito: 700, extra: 800 },

  espacos: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },

  raios: { sm: '4px', md: '8px', lg: '14px', pilula: '999px' },

  sombras: {
    neonDestaque: `0 0 0 1px ${comAlfa(destaque, 0.5)}, 0 0 14px ${comAlfa(destaque, 0.32)}, 0 0 42px ${comAlfa(destaque, 0.16)}`,
    neonBrilho: `0 0 0 1px ${comAlfa(brilho, 0.5)}, 0 0 14px ${comAlfa(brilho, 0.32)}, 0 0 42px ${comAlfa(brilho, 0.16)}`,
    textoDestaque: `0 0 4px ${comAlfa(destaque, 0.5)}, 0 0 16px ${comAlfa(destaque, 0.32)}, 0 0 40px ${comAlfa(destaque, 0.16)}`,
    textoBrilho: `0 0 4px ${comAlfa(brilho, 0.5)}, 0 0 16px ${comAlfa(brilho, 0.32)}, 0 0 40px ${comAlfa(brilho, 0.16)}`,
    elevacao: `0 30px 60px -30px ${comAlfa(fundo, 0.95)}, 0 0 0 1px ${comAlfa(destaque, 0.06)}`,
  },

  desfoques: {
    vidro: 'blur(14px) saturate(140%)',
    denso: 'blur(22px) saturate(150%)',
  },

  curvas: {
    suave: 'cubic-bezier(0.22, 1, 0.36, 1)',
    entrada: 'cubic-bezier(0.4, 0, 1, 1)',
  },

  duracoes: { rapida: '160ms', media: '280ms', lenta: '520ms' },

  pontosQuebra: { celular: 480, tablet: 768, notebook: 1024, desktop: 1280, amplo: 1536 },

  camadas: { fundo: 0, conteudo: 1, navegacao: 50, menu: 60, crt: 70, pularConteudo: 100 },

  medidas: {
    alturaNavegacao: '4.5rem',
    larguraConteudo: '72rem',
    larguraTexto: '40rem',
    margemLateral: 'max(clamp(1rem, 4vw, 2.5rem), env(safe-area-inset-left), env(safe-area-inset-right))',
  },
} as const;

export type Tema = typeof tema;
