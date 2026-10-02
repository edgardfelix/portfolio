import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { brilhoNeon } from '@/estilos/fragmentos';
import { midia } from '@/estilos/midias';
import { comAlfa } from '@/estilos/tema';
import { LinkExterno } from './LinkExterno';

type Variante = 'primario' | 'secundario';
type Tamanho = 'md' | 'lg';

interface PropriedadesBase {
  variante?: Variante;
  tamanho?: Tamanho;
  /** Ícone à direita do rótulo (decorativo). */
  icone?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Rota interna (`para`), link externo validado (`href`) ou ação (`aoClicar`) — exatamente um. */
type Destino =
  | { para: string; href?: never; aoClicar?: never }
  | { href: string; para?: never; aoClicar?: never }
  | { aoClicar: () => void; para?: never; href?: never };

type Propriedades = PropriedadesBase & Destino;

export function BotaoNeon({ variante = 'primario', tamanho = 'md', icone, children, className, ...destino }: Propriedades) {
  const estilo = { $variante: variante, $tamanho: tamanho, className };
  const conteudo = (
    <>
      <span>{children}</span>
      {icone && <Icone aria-hidden="true">{icone}</Icone>}
    </>
  );

  if (destino.para !== undefined) {
    return (
      <BotaoRota to={destino.para} {...estilo}>
        {conteudo}
      </BotaoRota>
    );
  }

  if (destino.href !== undefined) {
    return (
      <BotaoExterno href={destino.href} {...estilo}>
        {conteudo}
      </BotaoExterno>
    );
  }

  return (
    <BotaoAcao type="button" onClick={destino.aoClicar} {...estilo}>
      {conteudo}
    </BotaoAcao>
  );
}

interface PropriedadesEstilo {
  $variante: Variante;
  $tamanho: Tamanho;
}

const Icone = styled.span`
  display: inline-flex;
  transition: transform ${({ theme }) => `${theme.duracoes.media} ${theme.curvas.suave}`};
`;

const estiloBotao = css<PropriedadesEstilo>`
  ${({ theme, $variante, $tamanho }) => {
    const { cores } = theme;
    const primario = $variante === 'primario';
    const transicao = `${theme.duracoes.media} ${theme.curvas.suave}`;

    return css`
      position: relative;
      isolation: isolate;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: ${theme.espacos[3]};
      min-height: ${$tamanho === 'lg' ? '3.25rem' : '2.75rem'};
      padding: 0 ${$tamanho === 'lg' ? theme.espacos[6] : theme.espacos[5]};
      border: 1px solid ${primario ? cores.destaque : cores.bordaBrilho};
      border-radius: ${theme.raios.sm};
      font-size: ${$tamanho === 'lg' ? theme.tamanhos.sm : theme.tamanhos.xs};
      font-weight: ${theme.pesos.negrito};
      letter-spacing: 0.1em;
      line-height: 1;
      text-transform: uppercase;
      white-space: nowrap;
      cursor: pointer;
      user-select: none;
      touch-action: manipulation;
      transition:
        transform ${theme.duracoes.rapida} ${theme.curvas.suave},
        box-shadow ${transicao},
        background-color ${transicao},
        color ${transicao};

      ${primario
        ? css`
            background-color: ${cores.destaque};
            color: ${cores.fundo};
            ${brilhoNeon(cores.destaque, 0.85)}
          `
        : css`
            background-color: ${comAlfa(cores.brilho, 0.04)};
            color: ${cores.brilho};
            box-shadow:
              inset 0 0 18px ${comAlfa(cores.brilho, 0.08)},
              0 0 18px ${comAlfa(cores.brilho, 0.1)};
          `}

      /* Cantoneiras de HUD */
      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 10px;
        border: 1.5px solid ${primario ? cores.brilho : cores.destaque};
        pointer-events: none;
        transition: transform ${transicao};
      }

      &::before {
        top: -6px;
        left: -6px;
        border-right: 0;
        border-bottom: 0;
      }

      &::after {
        right: -6px;
        bottom: -6px;
        border-top: 0;
        border-left: 0;
      }

      ${midia.ponteiroFino} {
        &:hover {
          ${primario
            ? brilhoNeon(cores.destaque, 1.6)
            : css`
                background-color: ${comAlfa(cores.brilho, 0.1)};
                ${brilhoNeon(cores.brilho, 1.1)}
              `}
        }

        &:hover::before {
          transform: translate(-3px, -3px);
        }

        &:hover::after {
          transform: translate(3px, 3px);
        }

        &:hover ${Icone} {
          transform: translateX(3px);
        }
      }

      &:active {
        transform: scale(0.97);
      }

      &:focus-visible {
        outline-offset: 7px;
      }
    `;
  }}
`;

const BotaoRota = styled(Link)<PropriedadesEstilo>`
  ${estiloBotao}
`;

const BotaoExterno = styled(LinkExterno)<PropriedadesEstilo>`
  ${estiloBotao}
`;

const BotaoAcao = styled.button<PropriedadesEstilo>`
  ${estiloBotao}
`;
