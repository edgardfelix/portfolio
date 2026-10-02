import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { midia } from '@/estilos/midias';
import { comAlfa } from '@/estilos/tema';

interface PropriedadesDestaque {
  $destaque: boolean;
}

export const Cartao = styled(motion.article)<PropriedadesDestaque>`
  ${({ theme: { cores, raios, sombras, duracoes, curvas }, $destaque }) => css`
    --holofote-x: 50%;
    --holofote-y: 0%;

    position: relative;
    isolation: isolate;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    overflow: hidden;
    border: 1px solid ${cores.borda};
    border-radius: ${raios.lg};
    background-color: ${comAlfa(cores.fundo, 0.78)};
    background-image: linear-gradient(180deg, ${comAlfa(cores.destaque, 0.045)}, ${comAlfa(cores.destaque, 0.012)});
    box-shadow: ${sombras.elevacao};
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    transition:
      border-color ${duracoes.lenta} ${curvas.suave},
      box-shadow ${duracoes.lenta} ${curvas.suave};

    ${$destaque &&
    css`
      grid-column: 1 / -1;

      ${midia.acima('notebook')} {
        grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
      }
    `}

    /* Holofote: brilho difuso que acompanha o ponteiro */
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: radial-gradient(
        38rem circle at var(--holofote-x) var(--holofote-y),
        ${comAlfa(cores.brilho, 0.08)},
        transparent 45%
      );
      opacity: 0;
      transition: opacity ${duracoes.lenta} ${curvas.suave};
      pointer-events: none;
    }

    /* Borda viva: só o contorno perto do ponteiro acende */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 2;
      padding: 1px;
      border-radius: inherit;
      background: radial-gradient(
        24rem circle at var(--holofote-x) var(--holofote-y),
        ${comAlfa(cores.brilho, 0.9)},
        transparent 40%
      );
      -webkit-mask:
        linear-gradient(${cores.fundo} 0 0) content-box,
        linear-gradient(${cores.fundo} 0 0);
      -webkit-mask-composite: xor;
      mask:
        linear-gradient(${cores.fundo} 0 0) content-box,
        linear-gradient(${cores.fundo} 0 0);
      mask-composite: exclude;
      opacity: 0;
      transition: opacity ${duracoes.lenta} ${curvas.suave};
      pointer-events: none;
    }

    ${midia.ponteiroFino} {
      &:hover {
        border-color: ${cores.bordaForte};
        box-shadow:
          ${sombras.elevacao},
          0 0 48px -16px ${comAlfa(cores.brilho, 0.4)};
      }

      &:hover::before,
      &:hover::after {
        opacity: 1;
      }
    }
  `}
`;

export const Capa = styled.div<PropriedadesDestaque>`
  ${({ theme: { cores }, $destaque }) => css`
    aspect-ratio: 16 / 10;
    border-bottom: 1px solid ${cores.borda};

    ${$destaque &&
    css`
      ${midia.acima('notebook')} {
        aspect-ratio: auto;
        min-height: 100%;
        border-right: 1px solid ${cores.borda};
        border-bottom: 0;
      }
    `}
  `}
`;

export const Corpo = styled.div`
  ${({ theme: { espacos } }) => css`
    display: flex;
    flex-direction: column;
    gap: ${espacos[4]};
    padding: clamp(${espacos[5]}, 3vw, ${espacos[10]});
  `}
`;

export const Topo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espacos[4]};
`;

export const Categoria = styled.p`
  ${({ theme: { cores, tamanhos } }) => css`
    color: ${cores.brilho};
    font-size: ${tamanhos.xs};
    letter-spacing: 0.1em;
    text-transform: uppercase;
  `}
`;

export const Numero = styled.span`
  ${({ theme: { cores, tamanhos, pesos } }) => css`
    color: ${cores.textoApagado};
    font-size: ${tamanhos.lg};
    font-weight: ${pesos.extra};
    line-height: 1;
  `}
`;

export const Titulo = styled.h2`
  ${({ theme: { cores, tamanhos, pesos, sombras } }) => css`
    color: ${cores.destaque};
    font-size: ${tamanhos.xl};
    font-weight: ${pesos.extra};
    letter-spacing: -0.02em;
    text-shadow: ${sombras.textoDestaque};
  `}
`;

export const Lema = styled.p`
  ${({ theme: { cores, tamanhos } }) => css`
    color: ${cores.brilhoSuave};
    font-size: ${tamanhos.sm};
  `}
`;

export const Resumo = styled.p`
  ${({ theme: { cores, tamanhos } }) => css`
    color: ${cores.textoSuave};
    font-size: ${tamanhos.base};
    line-height: 1.75;
  `}
`;

export const Tecnologias = styled.div`
  ${({ theme: { cores, espacos } }) => css`
    display: grid;
    gap: ${espacos[3]};
    padding-top: ${espacos[4]};
    border-top: 1px dashed ${cores.borda};
  `}
`;

export const Grupo = styled.div`
  ${({ theme: { espacos } }) => css`
    display: grid;
    gap: ${espacos[2]};

    ${midia.acima('tablet')} {
      grid-template-columns: 7.5rem minmax(0, 1fr);
      align-items: baseline;
    }
  `}
`;

export const RotuloGrupo = styled.p`
  ${({ theme: { cores, tamanhos } }) => css`
    color: ${cores.textoApagado};
    font-size: ${tamanhos.micro};
    letter-spacing: 0.12em;
    text-transform: uppercase;
  `}
`;

export const ListaEtiquetas = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.espacos[2]};
  padding: 0;
  list-style: none;
`;

export const Acoes = styled.div`
  ${({ theme: { espacos } }) => css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${espacos[4]} ${espacos[5]};
    margin-top: auto;
    padding-top: ${espacos[3]};
  `}
`;

export const Pendente = styled.span`
  ${({ theme: { cores, raios, tamanhos, espacos } }) => css`
    display: inline-flex;
    align-items: center;
    gap: ${espacos[2]};
    min-height: 2.75rem;
    padding: 0 ${espacos[4]};
    border: 1px dashed ${cores.borda};
    border-radius: ${raios.sm};
    color: ${cores.textoSuave};
    font-size: ${tamanhos.xs};
    letter-spacing: 0.08em;
    text-transform: uppercase;
  `}
`;

export const BotaoDetalhes = styled.button`
  ${({ theme: { cores, tamanhos, espacos, sombras, duracoes, curvas } }) => css`
    display: inline-flex;
    align-items: center;
    gap: ${espacos[2]};
    min-height: 2.75rem;
    padding: 0 ${espacos[1]};
    color: ${cores.texto};
    font-size: ${tamanhos.xs};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-color: ${cores.borda};
    text-underline-offset: 6px;
    transition:
      color ${duracoes.media} ${curvas.suave},
      text-decoration-color ${duracoes.media} ${curvas.suave},
      text-shadow ${duracoes.media} ${curvas.suave};

    &:hover,
    &[aria-expanded='true'] {
      color: ${cores.destaque};
      text-decoration-color: ${cores.destaque};
      text-shadow: ${sombras.textoDestaque};
    }
  `}
`;

export const Detalhes = styled(motion.div)`
  ${({ theme: { cores } }) => css`
    grid-column: 1 / -1;
    overflow: hidden;
    border-top: 1px solid ${cores.borda};
    background: ${comAlfa(cores.fundo, 0.5)};
  `}
`;

export const DetalhesInterno = styled.div`
  ${({ theme: { espacos } }) => css`
    display: grid;
    gap: ${espacos[8]};
    padding: clamp(${espacos[5]}, 3vw, ${espacos[10]});

    ${midia.acima('notebook')} {
      grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    }
  `}
`;

export const Subtitulo = styled.h3`
  ${({ theme: { cores, tamanhos, espacos } }) => css`
    margin-bottom: ${espacos[4]};
    color: ${cores.brilho};
    font-size: ${tamanhos.xs};
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  `}
`;

export const ListaCamadas = styled.ol`
  ${({ theme: { espacos } }) => css`
    display: grid;
    gap: ${espacos[4]};
    padding: 0;
    list-style: none;

    ${midia.acima('tablet')} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  `}
`;

export const Camada = styled.li`
  ${({ theme: { cores, raios, espacos } }) => css`
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: ${espacos[3]};
    padding: ${espacos[4]};
    border: 1px solid ${cores.borda};
    border-radius: ${raios.md};
    background: ${cores.superficie};
  `}
`;

export const NumeroCamada = styled.span`
  ${({ theme: { cores, tamanhos, pesos } }) => css`
    color: ${cores.brilho};
    font-size: ${tamanhos.sm};
    font-weight: ${pesos.negrito};
    line-height: 1.6;
  `}
`;

export const NomeCamada = styled.p`
  ${({ theme: { cores, tamanhos, pesos } }) => css`
    color: ${cores.destaque};
    font-size: ${tamanhos.sm};
    font-weight: ${pesos.negrito};
  `}
`;

export const Metafora = styled.span`
  ${({ theme: { cores, pesos } }) => css`
    color: ${cores.brilhoSuave};
    font-weight: ${pesos.regular};
  `}
`;

export const DescricaoCamada = styled.p`
  ${({ theme: { cores, tamanhos } }) => css`
    color: ${cores.textoSuave};
    font-size: ${tamanhos.sm};
    line-height: 1.65;
  `}
`;

export const ListaDecisoes = styled.ul`
  ${({ theme: { cores, tamanhos, espacos } }) => css`
    display: grid;
    gap: ${espacos[3]};
    padding: 0;
    list-style: none;
    color: ${cores.textoSuave};
    font-size: ${tamanhos.sm};
    line-height: 1.65;

    li {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: ${espacos[3]};
    }

    li::before {
      content: '›';
      color: ${cores.destaque};
      font-weight: 700;
    }
  `}
`;
