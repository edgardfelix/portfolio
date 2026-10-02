import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { midia } from '@/estilos/midias';
import { comAlfa } from '@/estilos/tema';

/** Tag de tecnologia. Renderiza um <li>: use dentro de uma lista. */
export function EtiquetaTecnologia({ children }: { children: ReactNode }) {
  return <Etiqueta>{children}</Etiqueta>;
}

const Etiqueta = styled.li`
  ${({ theme: { cores, raios, tamanhos, espacos, duracoes, curvas } }) => css`
    display: inline-flex;
    align-items: center;
    padding: ${espacos[1]} ${espacos[3]};
    border: 1px solid ${cores.borda};
    border-radius: ${raios.sm};
    background: ${cores.superficie};
    color: ${cores.texto};
    font-size: ${tamanhos.xs};
    letter-spacing: 0.02em;
    white-space: nowrap;
    transition:
      color ${duracoes.media} ${curvas.suave},
      border-color ${duracoes.media} ${curvas.suave},
      box-shadow ${duracoes.media} ${curvas.suave};

    ${midia.ponteiroFino} {
      &:hover {
        border-color: ${cores.bordaBrilho};
        color: ${cores.brilho};
        box-shadow: 0 0 14px ${comAlfa(cores.brilho, 0.22)};
      }
    }
  `}
`;
