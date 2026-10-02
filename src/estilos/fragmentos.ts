import { css, keyframes } from 'styled-components';
import { comAlfa, tema } from './tema';

const { cores } = tema;

/** Contêiner centralizado com margens laterais fluidas (respeita o notch). */
export const conteiner = css`
  width: min(${tema.medidas.larguraConteudo}, calc(100% - 2 * ${tema.medidas.margemLateral}));
  margin-inline: auto;
`;

/** Brilho neon em camadas: contorno + halo + brilho interno. */
export const brilhoNeon = (cor: string = cores.destaque, intensidade = 1) => css`
  box-shadow:
    0 0 0 1px ${comAlfa(cor, 0.55)},
    0 0 ${Math.round(12 * intensidade)}px ${comAlfa(cor, 0.32 * intensidade)},
    0 0 ${Math.round(38 * intensidade)}px ${comAlfa(cor, 0.16 * intensidade)},
    inset 0 0 ${Math.round(14 * intensidade)}px ${comAlfa(cor, 0.1 * intensidade)};
`;

/** Texto com brilho neon. */
export const textoNeon = (cor: string = cores.destaque) => css`
  color: ${cor};
  text-shadow:
    0 0 4px ${comAlfa(cor, 0.5)},
    0 0 16px ${comAlfa(cor, 0.32)},
    0 0 40px ${comAlfa(cor, 0.16)};
`;

/** Vidro fosco com fallback para navegadores sem backdrop-filter. */
export const vidroFosco = css`
  background-color: ${cores.veu};
  background-image: linear-gradient(180deg, ${comAlfa(cores.destaque, 0.05)}, ${comAlfa(cores.destaque, 0.012)});
  -webkit-backdrop-filter: ${tema.desfoques.vidro};
  backdrop-filter: ${tema.desfoques.vidro};

  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    background-color: ${cores.veuDenso};
  }
`;

/** Linhas de varredura de monitor CRT. */
export const linhasVarredura = (opacidade = 0.16) => css`
  background-image: repeating-linear-gradient(
    to bottom,
    ${comAlfa(cores.fundo, opacidade)} 0 1px,
    transparent 1px 3px
  );
`;

/** Grade fina de "papel milimetrado". */
export const gradeFundo = (tamanho = 48, opacidade = 0.05) => css`
  background-image:
    linear-gradient(${comAlfa(cores.destaque, opacidade)} 1px, transparent 1px),
    linear-gradient(90deg, ${comAlfa(cores.destaque, opacidade)} 1px, transparent 1px);
  background-size: ${tamanho}px ${tamanho}px;
`;

/** Esconde visualmente, mas mantém o conteúdo para leitores de tela. */
export const somenteLeitores = css`
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

export const piscar = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

export const pulsar = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
`;

export const cintilar = keyframes`
  0%, 40%, 44%, 76%, 80%, 100% { opacity: 1; }
  42% { opacity: 0.82; }
  78% { opacity: 0.9; }
`;

export const girar = keyframes`
  to { transform: rotate(1turn); }
`;

export const flutuar = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(2%, -3%, 0) scale(1.06); }
`;
