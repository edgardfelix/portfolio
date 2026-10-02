import { useId, useMemo } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { midia } from '@/estilos/midias';
import { comAlfa } from '@/estilos/tema';
import type { Projeto } from '@/tipos/dominio';

/** FNV-1a (32 bits): transforma o id em uma semente estável. */
function hash(texto: string): number {
  let resultado = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    resultado ^= texto.charCodeAt(i);
    resultado = Math.imul(resultado, 0x01000193);
  }
  return resultado >>> 0;
}

/** mulberry32: mesma semente → mesma sequência → mesma capa, sempre. */
function criarAleatorio(semente: number): () => number {
  let estado = semente;
  return () => {
    estado = (estado + 0x6d2b79f5) | 0;
    let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Celula {
  x: number;
  y: number;
  ciano: boolean;
  opacidade: number;
}

const LADO = 9;
const TAMANHO_CELULA = 9;
const ESPACO_CELULA = 2.5;

/** Emblema simétrico (como um identicon) derivado do id do projeto. */
function gerarEmblema(id: string): Celula[] {
  const aleatorio = criarAleatorio(hash(id));
  const celulas: Celula[] = [];
  const metade = Math.ceil(LADO / 2);

  for (let y = 0; y < LADO; y++) {
    for (let x = 0; x < metade; x++) {
      if (aleatorio() < 0.46) continue;
      const celula = { ciano: aleatorio() < 0.2, opacidade: 0.4 + aleatorio() * 0.6 };
      celulas.push({ x, y, ...celula });
      const espelho = LADO - 1 - x;
      if (espelho !== x) celulas.push({ x: espelho, y, ...celula });
    }
  }
  return celulas;
}

interface Propriedades {
  projeto: Pick<Projeto, 'id' | 'titulo' | 'capa'>;
}

/** Capa do card: a captura real, se existir; senão, uma arte generativa única para o projeto. */
export function CapaProjeto({ projeto }: Propriedades) {
  if (projeto.capa) {
    return (
      <Moldura>
        <Imagem src={projeto.capa} alt={`Captura de tela do projeto ${projeto.titulo}`} loading="lazy" decoding="async" />
        <Tinta aria-hidden="true" />
        <Varredura aria-hidden="true" />
        <Cantoneiras aria-hidden="true" />
      </Moldura>
    );
  }

  return (
    <Moldura>
      <CapaGerada id={projeto.id} />
      <Varredura aria-hidden="true" />
      <Cantoneiras aria-hidden="true" />
      <Caminho aria-hidden="true">~/projetos/{projeto.id}</Caminho>
    </Moldura>
  );
}

function CapaGerada({ id }: { id: string }) {
  const prefixo = useId();
  const celulas = useMemo(() => gerarEmblema(id), [id]);
  const ladoEmblema = LADO * TAMANHO_CELULA + (LADO - 1) * ESPACO_CELULA;
  const inicioX = (320 - ladoEmblema) / 2;
  const inicioY = (200 - ladoEmblema) / 2;
  const idGrade = `${prefixo}-grade`;
  const idHalo = `${prefixo}-halo`;
  const idBrilho = `${prefixo}-brilho`;

  return (
    <Svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id={idGrade} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" className="linha-grade" strokeWidth="0.5" />
        </pattern>
        <radialGradient id={idHalo}>
          <stop offset="0" className="halo-centro" />
          <stop offset="1" className="halo-borda" />
        </radialGradient>
        <filter id={idBrilho} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="desfoque" />
          <feMerge>
            <feMergeNode in="desfoque" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="320" height="200" className="fundo" />
      <rect width="320" height="200" fill={`url(#${idGrade})`} />
      <ellipse cx="160" cy="100" rx="120" ry="90" fill={`url(#${idHalo})`} />

      <g filter={`url(#${idBrilho})`}>
        {celulas.map((celula) => (
          <rect
            key={`${celula.x}-${celula.y}`}
            x={inicioX + celula.x * (TAMANHO_CELULA + ESPACO_CELULA)}
            y={inicioY + celula.y * (TAMANHO_CELULA + ESPACO_CELULA)}
            width={TAMANHO_CELULA}
            height={TAMANHO_CELULA}
            rx="1.5"
            className={celula.ciano ? 'celula-ciano' : 'celula'}
            opacity={celula.opacidade}
          />
        ))}
      </g>
    </Svg>
  );
}

const Svg = styled.svg`
  ${({ theme: { cores, duracoes, curvas } }) => css`
    width: 100%;
    height: 100%;
    transition: transform ${duracoes.lenta} ${curvas.suave};

    .fundo {
      fill: ${cores.fundo};
    }

    .linha-grade {
      stroke: ${comAlfa(cores.destaque, 0.1)};
    }

    .halo-centro {
      stop-color: ${cores.brilho};
      stop-opacity: 0.2;
    }

    .halo-borda {
      stop-color: ${cores.brilho};
      stop-opacity: 0;
    }

    .celula {
      fill: ${cores.destaque};
    }

    .celula-ciano {
      fill: ${cores.brilho};
    }
  `}
`;

const Imagem = styled.img`
  ${({ theme: { duracoes, curvas } }) => css`
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Duotone na paleta: tons de cinza tingidos de verde; cores reais no hover */
    filter: grayscale(1) contrast(1.1) brightness(0.8);
    transition:
      filter ${duracoes.lenta} ${curvas.suave},
      transform ${duracoes.lenta} ${curvas.suave};
  `}
`;

const Tinta = styled.span`
  ${({ theme: { cores, duracoes, curvas } }) => css`
    position: absolute;
    inset: 0;
    background: ${cores.destaque};
    mix-blend-mode: multiply;
    opacity: 0.85;
    transition: opacity ${duracoes.lenta} ${curvas.suave};
  `}
`;

const varrer = keyframes`
  from { transform: translateY(-10%); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  to { transform: translateY(1100%); opacity: 0; }
`;

/** Reage ao hover do card inteiro (article): zoom suave, cores reais e linha de scanner. */
const Moldura = styled.div`
  ${({ theme: { cores } }) => css`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: ${cores.fundo};

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 9%;
      background: linear-gradient(180deg, transparent, ${comAlfa(cores.brilho, 0.16)} 70%, ${comAlfa(cores.brilho, 0.7)});
      opacity: 0;
      pointer-events: none;
    }

    ${midia.ponteiroFino} {
      article:hover & ${Svg}, article:hover & ${Imagem} {
        transform: scale(1.04);
      }

      article:hover & ${Imagem} {
        filter: none;
      }

      article:hover & ${Tinta} {
        opacity: 0;
      }

      article:hover &::after {
        animation: ${varrer} 1.6s linear infinite;
      }
    }

    ${midia.movimentoReduzido} {
      &::after {
        display: none;
      }
    }
  `}
`;

const Varredura = styled.span`
  ${({ theme: { cores } }) => css`
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      to bottom,
      ${comAlfa(cores.fundo, 0.22)} 0 1px,
      transparent 1px 3px
    );
    pointer-events: none;
  `}
`;

const Cantoneiras = styled.span`
  ${({ theme: { cores } }) => css`
    position: absolute;
    inset: 12px;
    pointer-events: none;
    background:
      linear-gradient(${cores.brilho}, ${cores.brilho}) top left / 14px 1px no-repeat,
      linear-gradient(${cores.brilho}, ${cores.brilho}) top left / 1px 14px no-repeat,
      linear-gradient(${cores.brilho}, ${cores.brilho}) bottom right / 14px 1px no-repeat,
      linear-gradient(${cores.brilho}, ${cores.brilho}) bottom right / 1px 14px no-repeat;
    opacity: 0.7;
  `}
`;

const Caminho = styled.span`
  ${({ theme: { cores, tamanhos } }) => css`
    position: absolute;
    right: 14px;
    bottom: 12px;
    left: 14px;
    overflow: hidden;
    color: ${cores.textoSuave};
    font-size: ${tamanhos.micro};
    letter-spacing: 0.04em;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
`;
