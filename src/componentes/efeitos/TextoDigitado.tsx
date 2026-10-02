import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { piscar, somenteLeitores } from '@/estilos/fragmentos';
import { comAlfa } from '@/estilos/tema';

interface Propriedades {
  texto: string;
  /** Espera antes de começar a digitar (ms). */
  atraso?: number;
  /** Intervalo médio entre teclas (ms). */
  velocidade?: number;
  className?: string;
}

/**
 * Máquina de escrever com cursor de terminal. O texto completo fica disponível
 * para leitores de tela desde o início; a animação é só visual.
 */
export function TextoDigitado({ texto, atraso = 600, velocidade = 55, className }: Propriedades) {
  const movimentoReduzido = useReducedMotion() ?? false;
  const [digitados, setDigitados] = useState(0);

  useEffect(() => {
    if (movimentoReduzido) return;
    let indice = 0;
    let temporizador: ReturnType<typeof setTimeout>;

    const digitar = () => {
      indice += 1;
      setDigitados(indice);
      // Ritmo levemente irregular, como uma pessoa digitando.
      if (indice < texto.length) temporizador = setTimeout(digitar, velocidade * (0.6 + Math.random() * 0.8));
    };

    temporizador = setTimeout(digitar, atraso);
    return () => clearTimeout(temporizador);
  }, [texto, atraso, velocidade, movimentoReduzido]);

  const concluido = movimentoReduzido || digitados >= texto.length;

  return (
    <Raiz className={className}>
      <Oculto>{texto}</Oculto>
      <span aria-hidden="true">
        {movimentoReduzido ? texto : texto.slice(0, digitados)}
        <Cursor $piscando={concluido} />
      </span>
    </Raiz>
  );
}

const Raiz = styled.span`
  display: inline;
`;

const Oculto = styled.span`
  ${somenteLeitores}
`;

const Cursor = styled.span<{ $piscando: boolean }>`
  ${({ theme: { cores }, $piscando }) => css`
    display: inline-block;
    width: 0.6em;
    height: 1.15em;
    margin-left: 0.12em;
    vertical-align: -0.22em;
    background: ${cores.destaque};
    box-shadow:
      0 0 8px ${comAlfa(cores.destaque, 0.85)},
      0 0 20px ${comAlfa(cores.destaque, 0.4)};
    animation: ${$piscando ? css`${piscar} 1.05s steps(1) infinite` : 'none'};
  `}
`;
