import { motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { conteiner, piscar } from '@/estilos/fragmentos';
import { midia } from '@/estilos/midias';
import { comAlfa } from '@/estilos/tema';

export const Cabecalho = styled.header<{ $rolou: boolean }>`
  ${({ theme: { cores, camadas, medidas, desfoques, duracoes, curvas }, $rolou }) => css`
    position: fixed;
    inset: 0 0 auto;
    z-index: ${camadas.navegacao};
    height: ${medidas.alturaNavegacao};
    background-color: ${comAlfa(cores.fundo, $rolou ? 0.78 : 0.38)};
    -webkit-backdrop-filter: ${desfoques.vidro};
    backdrop-filter: ${desfoques.vidro};
    box-shadow: ${$rolou ? `0 14px 36px -22px ${comAlfa(cores.brilho, 0.45)}` : 'none'};
    transition:
      background-color ${duracoes.lenta} ${curvas.suave},
      box-shadow ${duracoes.lenta} ${curvas.suave};

    @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
      background-color: ${cores.veuDenso};
    }

    /* Filete de luz na base da barra */
    &::after {
      content: '';
      position: absolute;
      inset: auto 0 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        ${comAlfa(cores.destaque, 0.6)} 25%,
        ${comAlfa(cores.brilho, 0.75)} 75%,
        transparent
      );
      opacity: ${$rolou ? 1 : 0.3};
      transition: opacity ${duracoes.lenta} ${curvas.suave};
    }
  `}
`;

export const Barra = styled.div`
  ${conteiner}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espacos[6]};
  height: 100%;
`;

export const Monograma = styled.span`
  ${({ theme: { cores, raios, tamanhos, pesos, sombras, duracoes, curvas } }) => css`
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border: 1px solid ${cores.bordaForte};
    border-radius: ${raios.sm};
    background: linear-gradient(135deg, ${comAlfa(cores.destaque, 0.16)}, ${comAlfa(cores.brilho, 0.05)});
    color: ${cores.destaque};
    font-size: ${tamanhos.xs};
    font-weight: ${pesos.extra};
    letter-spacing: 0.06em;
    text-shadow: ${sombras.textoDestaque};
    transition:
      border-color ${duracoes.media} ${curvas.suave},
      box-shadow ${duracoes.media} ${curvas.suave};
  `}
`;

export const Identificador = styled.span`
  ${({ theme: { cores, tamanhos } }) => css`
    font-size: ${tamanhos.sm};
    color: ${cores.texto};
    letter-spacing: 0.02em;
    white-space: nowrap;
  `}
`;

export const Prompt = styled.span`
  color: ${({ theme }) => theme.cores.brilho};
`;

export const Cursor = styled.span`
  ${({ theme: { cores } }) => css`
    display: inline-block;
    width: 0.55em;
    height: 1.05em;
    margin-left: 0.2em;
    vertical-align: -0.18em;
    background: ${cores.destaque};
    box-shadow: 0 0 8px ${comAlfa(cores.destaque, 0.8)};
    animation: ${piscar} 1.1s steps(1) infinite;
  `}
`;

export const Marca = styled(Link)`
  ${({ theme: { cores, espacos, raios, sombras } }) => css`
    display: inline-flex;
    align-items: center;
    gap: ${espacos[3]};
    padding: ${espacos[1]} 0;
    border-radius: ${raios.sm};

    ${midia.ponteiroFino} {
      &:hover ${Monograma} {
        border-color: ${cores.destaque};
        box-shadow: ${sombras.neonDestaque};
      }
    }
  `}
`;

export const NavegacaoDesktop = styled.nav`
  display: none;

  ${midia.acima('tablet')} {
    display: block;
  }
`;

export const ListaLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2.6vw, 2.25rem);
  padding: 0;
  list-style: none;
`;

export const Indice = styled.span`
  ${({ theme: { cores, tamanhos } }) => css`
    font-size: ${tamanhos.micro};
    color: ${cores.brilhoSuave};
    letter-spacing: 0.04em;
  `}
`;

export const LinkNavegacao = styled(NavLink)`
  ${({ theme: { cores, tamanhos, espacos, sombras, duracoes, curvas } }) => css`
    position: relative;
    display: inline-flex;
    align-items: baseline;
    gap: ${espacos[2]};
    padding: ${espacos[2]} ${espacos[1]};
    font-size: ${tamanhos.sm};
    color: ${cores.textoSuave};
    letter-spacing: 0.04em;
    transition:
      color ${duracoes.media} ${curvas.suave},
      text-shadow ${duracoes.media} ${curvas.suave};

    &:hover,
    &.active {
      color: ${cores.destaque};
      text-shadow: ${sombras.textoDestaque};
    }
  `}
`;

export const IndicadorAtivo = styled(motion.span)`
  ${({ theme: { cores } }) => css`
    position: absolute;
    right: 0;
    bottom: -2px;
    left: 0;
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, ${cores.destaque}, ${cores.brilho});
    box-shadow:
      0 0 8px ${comAlfa(cores.destaque, 0.8)},
      0 0 20px ${comAlfa(cores.brilho, 0.5)};
  `}
`;

export const BotaoMenu = styled.button`
  ${({ theme: { cores, raios, duracoes, curvas } }) => css`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 2.75rem;
    height: 2.75rem;
    border: 1px solid ${cores.bordaForte};
    border-radius: ${raios.sm};
    background: ${cores.superficie};
    color: ${cores.destaque};
    transition:
      border-color ${duracoes.media} ${curvas.suave},
      box-shadow ${duracoes.media} ${curvas.suave};

    &[aria-expanded='true'] {
      border-color: ${cores.brilho};
      color: ${cores.brilho};
      box-shadow: 0 0 18px ${comAlfa(cores.brilho, 0.35)};
    }

    ${midia.acima('tablet')} {
      display: none;
    }
  `}
`;

export const LinhaMenu = styled(motion.span)`
  display: block;
  width: 1.25rem;
  height: 1.5px;
  border-radius: 2px;
  background: currentColor;
  box-shadow: 0 0 6px currentColor;
`;
