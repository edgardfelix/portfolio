import { motion } from 'framer-motion';
import styled, { css, keyframes } from 'styled-components';
import { conteiner, textoNeon } from '@/estilos/fragmentos';
import { midia } from '@/estilos/midias';
import { comAlfa } from '@/estilos/tema';

const ondaPulso = keyframes`
  from { transform: scale(0.6); opacity: 0.9; }
  to { transform: scale(2.4); opacity: 0; }
`;

export const Secao = styled.section`
  ${conteiner}
  display: grid;
  gap: ${({ theme }) => theme.espacos[10]};
  padding-block: clamp(3rem, 7vw, 6rem);
`;

export const Painel = styled(motion.div)`
  ${({ theme: { cores, raios, sombras, espacos } }) => css`
    position: relative;
    isolation: isolate;
    display: grid;
    gap: ${espacos[10]};
    padding: clamp(${espacos[4]}, 4vw, ${espacos[12]});
    overflow: hidden;
    border: 1px solid ${cores.borda};
    border-radius: ${raios.lg};
    background-color: ${comAlfa(cores.fundo, 0.78)};
    background-image:
      radial-gradient(40rem 26rem at 0% 0%, ${comAlfa(cores.brilho, 0.08)}, transparent 60%),
      radial-gradient(30rem 22rem at 100% 100%, ${comAlfa(cores.destaque, 0.06)}, transparent 60%);
    box-shadow: ${sombras.elevacao};
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);

    ${midia.acima('notebook')} {
      grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
      align-items: center;
    }
  `}
`;

export const Perfil = styled.div`
  ${({ theme: { espacos } }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${espacos[5]};
    text-align: center;
  `}
`;

export const Identidade = styled.div`
  display: grid;
  justify-items: center;
  gap: ${({ theme }) => theme.espacos[2]};
`;

export const Nome = styled.h2`
  ${({ theme: { cores, tamanhos, pesos } }) => css`
    font-size: ${tamanhos.xl};
    font-weight: ${pesos.extra};
    letter-spacing: -0.02em;
    text-transform: uppercase;
    ${textoNeon(cores.destaque)}
  `}
`;

export const Cargo = styled.p`
  ${({ theme: { cores, tamanhos, sombras } }) => css`
    color: ${cores.brilho};
    font-size: ${tamanhos.md};
    text-shadow: ${sombras.textoBrilho};
  `}
`;

export const Seta = styled.span`
  margin-right: 0.6ch;
  color: ${({ theme }) => theme.cores.destaque};
`;

export const Status = styled.p`
  ${({ theme: { cores, raios, tamanhos, espacos } }) => css`
    display: inline-flex;
    align-items: center;
    gap: ${espacos[2]};
    margin-top: ${espacos[2]};
    padding: ${espacos[1]} ${espacos[3]};
    border: 1px solid ${cores.borda};
    border-radius: ${raios.pilula};
    color: ${cores.textoSuave};
    font-size: ${tamanhos.micro};
    letter-spacing: 0.08em;
    text-transform: uppercase;
  `}
`;

export const Pulso = styled.span`
  ${({ theme: { cores } }) => css`
    position: relative;
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: ${cores.destaque};
    box-shadow: 0 0 8px ${cores.destaque};

    &::after {
      content: '';
      position: absolute;
      inset: -3px;
      border: 1px solid ${cores.destaque};
      border-radius: 50%;
      animation: ${ondaPulso} 2s ease-out infinite;
    }

    ${midia.movimentoReduzido} {
      &::after {
        display: none;
      }
    }
  `}
`;

/** <address> é itálico por padrão no navegador. */
export const Endereco = styled.address`
  font-style: normal;
`;

export const BlocoWhatsapp = styled(Endereco)`
  ${({ theme: { espacos } }) => css`
    display: grid;
    justify-items: center;
    gap: ${espacos[3]};
    width: min(100%, 22rem);
    margin-top: ${espacos[3]};

    & > a {
      width: 100%;
    }
  `}
`;

export const Telefone = styled.p`
  ${({ theme: { cores, tamanhos } }) => css`
    color: ${cores.textoSuave};
    font-size: ${tamanhos.sm};
    letter-spacing: 0.06em;
  `}
`;

export const Canais = styled(Endereco)`
  ${({ theme: { cores, espacos } }) => css`
    display: grid;
    gap: ${espacos[4]};

    ${midia.acima('notebook')} {
      padding-left: ${espacos[10]};
      border-left: 1px solid ${cores.borda};
    }
  `}
`;

export const RotuloCanais = styled.p`
  ${({ theme: { cores, tamanhos } }) => css`
    color: ${cores.textoApagado};
    font-size: ${tamanhos.xs};
    letter-spacing: 0.08em;
  `}
`;
