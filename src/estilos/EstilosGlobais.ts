import { createGlobalStyle, css } from 'styled-components';
import { midia } from './midias';
import { comAlfa } from './tema';

export const EstilosGlobais = createGlobalStyle`
  ${({ theme: { cores, fontes, tamanhos } }) => css`
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    * {
      margin: 0;
    }

    html {
      color-scheme: dark;
      background: ${cores.fundo};
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
      scroll-behavior: smooth;
      /* Reserva o espaço da barra de rolagem: nada "pula" ao trocar de página ou abrir o menu */
      scrollbar-gutter: stable;
      scrollbar-width: thin;
      scrollbar-color: ${comAlfa(cores.destaque, 0.35)} ${cores.fundo};
    }

    body {
      min-height: 100dvh;
      background: ${cores.fundo};
      color: ${cores.texto};
      font-family: ${fontes.mono};
      font-size: ${tamanhos.base};
      line-height: 1.7;
      /* calt = ligaduras de código do JetBrains Mono; zero = zero cortado */
      font-feature-settings: 'calt' 1, 'zero' 1;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    #raiz {
      isolation: isolate;
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
      overflow-x: clip;
    }

    img,
    picture,
    svg,
    video,
    canvas {
      display: block;
      max-width: 100%;
    }

    input,
    button,
    textarea,
    select {
      font: inherit;
      color: inherit;
    }

    button {
      padding: 0;
      background: none;
      border: 0;
      cursor: pointer;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    h1,
    h2,
    h3,
    h4 {
      line-height: 1.1;
      text-wrap: balance;
      overflow-wrap: break-word;
    }

    p {
      text-wrap: pretty;
      overflow-wrap: break-word;
    }

    ::selection {
      background: ${cores.destaque};
      color: ${cores.fundo};
    }

    :focus-visible {
      outline: 2px solid ${cores.brilho};
      outline-offset: 3px;
    }

    :focus:not(:focus-visible) {
      outline: none;
    }

    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    ::-webkit-scrollbar-track {
      background: ${cores.fundo};
    }

    ::-webkit-scrollbar-thumb {
      background: ${comAlfa(cores.destaque, 0.25)};
      border: 2px solid ${cores.fundo};
      border-radius: 999px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${comAlfa(cores.destaque, 0.5)};
    }

    ${midia.movimentoReduzido} {
      html {
        scroll-behavior: auto;
      }

      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `}
`;
