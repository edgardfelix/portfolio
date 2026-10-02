import styled, { css } from 'styled-components';
import { flutuar } from '@/estilos/fragmentos';
import { midia } from '@/estilos/midias';
import { comAlfa } from '@/estilos/tema';

type Cor = 'brilho' | 'destaque';

interface Propriedades {
  /** Centro do brilho, relativo ao contêiner posicionado (ex.: "80%"). */
  x: string;
  y: string;
  /** Diâmetro do halo (ex.: "40rem"). */
  tamanho?: string;
  cor?: Cor;
  /** 0–1 */
  intensidade?: number;
  /** Ponto de luz concentrado no centro. */
  comNucleo?: boolean;
  /** Faixa anamórfica horizontal, como em lentes de cinema. */
  comFaixa?: boolean;
  className?: string;
}

/** Lens flare em CSS puro (radial-gradient): halo difuso, núcleo e faixa anamórfica. */
export function BrilhoLente({
  x,
  y,
  tamanho = '38rem',
  cor = 'brilho',
  intensidade = 1,
  comNucleo = true,
  comFaixa = false,
  className,
}: Propriedades) {
  return (
    <Raiz aria-hidden="true" className={className} $x={x} $y={y} $tamanho={tamanho} $cor={cor} $intensidade={intensidade}>
      <Halo />
      {comNucleo && <Nucleo />}
      {comFaixa && <Faixa />}
    </Raiz>
  );
}

interface PropriedadesRaiz {
  $x: string;
  $y: string;
  $tamanho: string;
  $cor: Cor;
  $intensidade: number;
}

const Raiz = styled.div<PropriedadesRaiz>`
  ${({ theme: { cores }, $x, $y, $tamanho, $cor, $intensidade }) => {
    const base = cores[$cor];
    return css`
      --cor-forte: ${comAlfa(base, 0.9 * $intensidade)};
      --cor-media: ${comAlfa(base, 0.32 * $intensidade)};
      --cor-fraca: ${comAlfa(base, 0.1 * $intensidade)};
      --tamanho: ${$tamanho};

      position: absolute;
      top: ${$y};
      left: ${$x};
      z-index: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    `;
  }}
`;

const Halo = styled.span`
  position: absolute;
  top: calc(var(--tamanho) / -2);
  left: calc(var(--tamanho) / -2);
  width: var(--tamanho);
  height: var(--tamanho);
  border-radius: 50%;
  background: radial-gradient(circle, var(--cor-media) 0%, var(--cor-fraca) 32%, transparent 68%);
  animation: ${flutuar} 16s ease-in-out infinite;
  will-change: transform;

  ${midia.movimentoReduzido} {
    animation: none;
  }
`;

const Nucleo = styled.span`
  position: absolute;
  top: calc(var(--tamanho) * -0.045);
  left: calc(var(--tamanho) * -0.045);
  width: calc(var(--tamanho) * 0.09);
  height: calc(var(--tamanho) * 0.09);
  border-radius: 50%;
  background: radial-gradient(circle, var(--cor-forte) 0%, var(--cor-media) 30%, transparent 70%);
  filter: blur(1px);
`;

const Faixa = styled.span`
  position: absolute;
  top: -1px;
  left: calc(var(--tamanho) * -0.6);
  width: calc(var(--tamanho) * 1.2);
  height: 2px;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--cor-fraca) 25%,
    var(--cor-forte) 50%,
    var(--cor-fraca) 75%,
    transparent
  );
  box-shadow: 0 0 16px 1px var(--cor-fraca);
`;
