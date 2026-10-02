import styled, { css, keyframes } from 'styled-components';
import { midia } from '@/estilos/midias';
import { comAlfa } from '@/estilos/tema';

interface Propriedades {
  texto: string;
  className?: string;
}

/**
 * Efeito glitch: duas cópias fatiadas (ciano e verde) cintilam por instantes sobre o texto.
 * As cópias são aria-hidden — leitores de tela leem o texto uma única vez.
 */
export function TextoInterferencia({ texto, className }: Propriedades) {
  return (
    <Raiz className={className}>
      {texto}
      <Copia aria-hidden="true" $camada="a">
        {texto}
      </Copia>
      <Copia aria-hidden="true" $camada="b">
        {texto}
      </Copia>
    </Raiz>
  );
}

const fatiasA = keyframes`
  0%, 84%, 100% { clip-path: inset(50% 0 50% 0); transform: translate3d(0, 0, 0); }
  85% { clip-path: inset(10% 0 64% 0); transform: translate3d(-0.05em, 0, 0); }
  87% { clip-path: inset(62% 0 10% 0); transform: translate3d(0.045em, 0, 0); }
  89% { clip-path: inset(28% 0 48% 0); transform: translate3d(-0.03em, 0, 0); }
  91% { clip-path: inset(78% 0 4% 0); transform: translate3d(0.04em, 0, 0); }
  93% { clip-path: inset(4% 0 82% 0); transform: translate3d(-0.045em, 0, 0); }
`;

const fatiasB = keyframes`
  0%, 86%, 100% { clip-path: inset(50% 0 50% 0); transform: translate3d(0, 0, 0); }
  87% { clip-path: inset(70% 0 12% 0); transform: translate3d(0.06em, 0, 0); }
  89% { clip-path: inset(18% 0 60% 0); transform: translate3d(-0.04em, 0, 0); }
  91% { clip-path: inset(44% 0 34% 0); transform: translate3d(0.035em, 0, 0); }
  94% { clip-path: inset(86% 0 2% 0); transform: translate3d(-0.05em, 0, 0); }
`;

const Raiz = styled.span`
  position: relative;
  display: inline-block;
`;

const Copia = styled.span<{ $camada: 'a' | 'b' }>`
  ${({ theme: { cores }, $camada }) => {
    const cor = $camada === 'a' ? cores.brilho : cores.destaque;
    return css`
      position: absolute;
      inset: 0;
      color: ${cor};
      text-shadow: 0 0 12px ${comAlfa(cor, 0.6)};
      clip-path: inset(50% 0 50% 0);
      pointer-events: none;
      user-select: none;
      animation: ${$camada === 'a' ? fatiasA : fatiasB} ${$camada === 'a' ? '4.2s' : '5.3s'} steps(1, end) infinite;
      animation-delay: ${$camada === 'a' ? '1.2s' : '2.1s'};

      ${Raiz}:hover > & {
        animation-duration: ${$camada === 'a' ? '1.1s' : '1.4s'};
      }

      ${midia.movimentoReduzido} {
        display: none;
      }
    `;
  }}
`;
