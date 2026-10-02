import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { conteiner, pulsar } from '@/estilos/fragmentos';
import { midia } from '@/estilos/midias';

export const Secao = styled.section`
  ${conteiner}
  display: grid;
  gap: ${({ theme }) => theme.espacos[8]};
  padding-block: clamp(3rem, 7vw, 6rem);
`;

export const Contagem = styled(motion.p)`
  ${({ theme: { cores, tamanhos, espacos } }) => css`
    display: inline-flex;
    align-items: center;
    gap: ${espacos[3]};
    color: ${cores.textoSuave};
    font-size: ${tamanhos.xs};
    letter-spacing: 0.08em;
    text-transform: uppercase;
  `}
`;

export const Ponto = styled.span`
  ${({ theme: { cores } }) => css`
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: ${cores.brilho};
    box-shadow: 0 0 10px ${cores.brilho};
    animation: ${pulsar} 2.4s ease-in-out infinite;

    ${midia.movimentoReduzido} {
      animation: none;
    }
  `}
`;

export const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
  gap: ${({ theme }) => theme.espacos[6]};
`;
