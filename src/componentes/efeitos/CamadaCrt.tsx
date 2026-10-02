import styled, { css, keyframes } from 'styled-components';
import { cintilar } from '@/estilos/fragmentos';
import { midia } from '@/estilos/midias';
import { comAlfa } from '@/estilos/tema';

/**
 * Sobreposição lo-fi de monitor CRT: scanlines + grão + vinheta + leve cintilação.
 * Puramente decorativa (pointer-events: none). O grão é tingido de verde via
 * feColorMatrix para não introduzir nenhuma cor fora da paleta.
 */
export function CamadaCrt() {
  return <Camada aria-hidden="true" />;
}

const svgRuido = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>
  <filter id='r'>
    <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/>
    <feColorMatrix values='0 0 0 0 0  0 0 0 0 1  0 0 0 0 0.4  1.6 0 0 0 -0.62'/>
  </filter>
  <rect width='100%' height='100%' filter='url(#r)'/>
</svg>`;

const ruido = `url("data:image/svg+xml,${encodeURIComponent(svgRuido)}")`;

const granular = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  20% { transform: translate3d(-6%, 4%, 0); }
  40% { transform: translate3d(5%, -7%, 0); }
  60% { transform: translate3d(-3%, 8%, 0); }
  80% { transform: translate3d(7%, 2%, 0); }
  100% { transform: translate3d(0, 0, 0); }
`;

const Camada = styled.div`
  ${({ theme: { cores, camadas } }) => css`
    position: fixed;
    inset: 0;
    z-index: ${camadas.crt};
    pointer-events: none;
    background:
      radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, ${comAlfa(cores.fundo, 0.6)} 100%),
      repeating-linear-gradient(to bottom, ${comAlfa(cores.fundo, 0.14)} 0 1px, transparent 1px 3px);
    animation: ${cintilar} 9s linear infinite;

    &::after {
      content: '';
      position: absolute;
      inset: -40%;
      background-image: ${ruido};
      opacity: 0.08;
      animation: ${granular} 1.2s steps(5) infinite;
    }

    ${midia.abaixo('tablet')} {
      background:
        radial-gradient(ellipse 140% 100% at 50% 50%, transparent 60%, ${comAlfa(cores.fundo, 0.5)} 100%),
        repeating-linear-gradient(to bottom, ${comAlfa(cores.fundo, 0.1)} 0 1px, transparent 1px 3px);
    }

    ${midia.movimentoReduzido} {
      animation: none;

      &::after {
        animation: none;
      }
    }
  `}
`;
