import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { criarChuvaDigital } from './motorChuvaDigital';

/** Fontes com katakana de meia largura para o canvas (os dígitos seguem em JetBrains Mono). */
const FONTES_JAPONESAS = "'MS Gothic', 'Yu Gothic UI', 'Hiragino Sans', 'Noto Sans JP'";

interface Propriedades {
  className?: string;
  tamanhoFonte?: number;
  fps?: number;
}

/** Fundo "Matrix Digital Rain": o componente só cuida do ciclo de vida; o desenho vive no motor. */
export function EfeitoMatrix({ className, tamanhoFonte = 16, fps = 30 }: Propriedades) {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const { cores, fontes } = useTheme();
  const movimentoReduzido = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = refCanvas.current;
    if (!canvas) return;

    const chuva = criarChuvaDigital(canvas, {
      corFundo: cores.fundo,
      corRastro: cores.destaque,
      corCabeca: cores.brilho,
      fonte: fontes.mono.replace(/,\s*monospace$/, `, ${FONTES_JAPONESAS}, monospace`),
      tamanhoFonte,
      fps,
      estatica: movimentoReduzido,
    });

    return () => chuva.destruir();
  }, [cores, fontes, tamanhoFonte, fps, movimentoReduzido]);

  return <Tela ref={refCanvas} className={className} aria-hidden="true" />;
}

const Tela = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
`;
