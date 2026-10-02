import type { MouseEvent } from 'react';
import styled, { css } from 'styled-components';
import { CamadaCrt } from '@/componentes/efeitos/CamadaCrt';
import { gradeFundo } from '@/estilos/fragmentos';
import { comAlfa } from '@/estilos/tema';
import { Roteador } from '@/rotas/Roteador';
import { BarraNavegacao } from './BarraNavegacao/BarraNavegacao';
import { Rodape } from './Rodape';

/** Leva o foco ao <main> sem acrescentar "#conteudo" à URL. */
function pularParaConteudo(evento: MouseEvent<HTMLAnchorElement>) {
  evento.preventDefault();
  const principal = document.getElementById('conteudo');
  principal?.focus({ preventScroll: true });
  principal?.scrollIntoView({ block: 'start' });
}

/** Casca da aplicação: fundo ambiente, link de acessibilidade, Navbar, conteúdo, rodapé e camada CRT. */
export function LayoutBase() {
  return (
    <>
      <FundoAmbiente aria-hidden="true" />
      <LinkPular href="#conteudo" onClick={pularParaConteudo}>
        Pular para o conteúdo
      </LinkPular>
      <BarraNavegacao />
      <Principal id="conteudo" tabIndex={-1}>
        <Roteador />
      </Principal>
      <Rodape />
      <CamadaCrt />
    </>
  );
}

const FundoAmbiente = styled.div`
  ${({ theme: { cores, camadas } }) => css`
    position: fixed;
    inset: 0;
    z-index: ${camadas.fundo};
    pointer-events: none;
    background:
      radial-gradient(60rem 42rem at 88% -12%, ${comAlfa(cores.brilho, 0.09)}, transparent 62%),
      radial-gradient(52rem 38rem at -8% 108%, ${comAlfa(cores.destaque, 0.07)}, transparent 60%);

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      ${gradeFundo(56, 0.04)}
      -webkit-mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, ${cores.fundo} 25%, transparent 80%);
      mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, ${cores.fundo} 25%, transparent 80%);
    }
  `}
`;

const LinkPular = styled.a`
  ${({ theme: { cores, camadas, raios, tamanhos, pesos, sombras, espacos, duracoes, curvas } }) => css`
    position: fixed;
    top: ${espacos[3]};
    left: ${espacos[3]};
    z-index: ${camadas.pularConteudo};
    padding: ${espacos[3]} ${espacos[4]};
    border: 1px solid ${cores.destaque};
    border-radius: ${raios.sm};
    background: ${cores.fundo};
    color: ${cores.destaque};
    font-size: ${tamanhos.sm};
    font-weight: ${pesos.seminegrito};
    box-shadow: ${sombras.neonDestaque};
    transform: translateY(-200%);
    transition: transform ${duracoes.rapida} ${curvas.suave};

    &:focus-visible {
      transform: translateY(0);
    }
  `}
`;

const Principal = styled.main`
  ${({ theme: { camadas, medidas } }) => css`
    position: relative;
    z-index: ${camadas.conteudo};
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-top: ${medidas.alturaNavegacao};

    &:focus {
      outline: none;
    }
  `}
`;
