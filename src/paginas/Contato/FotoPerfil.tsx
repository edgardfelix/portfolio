import styled, { css } from 'styled-components';
import { AnimacaoRive } from '@/componentes/efeitos/AnimacaoRive';
import { perfil } from '@/dados/perfil';
import { girar, linhasVarredura, pulsar, textoNeon } from '@/estilos/fragmentos';
import { midia } from '@/estilos/midias';
import { comAlfa, tema } from '@/estilos/tema';

/** Avatar animado (Rive), servido de public/. */
const ARQUIVO_AVATAR = '/5292-10543-boy-nodding.riv';
/** Nome da state machine, definido pelo autor do arquivo: "点头" = "acenar com a cabeça". */
const MAQUINA_AVATAR = '点头';

/**
 * Filtro holográfico: deixa o avatar dentro da paleta estrita de 3 cores
 * (sombras → fundo, meios-tons → verde, luzes → ciano). Com mouse, o hover revela as cores originais.
 * Para manter as cores originais sempre, troque para false.
 */
const USAR_HOLOGRAMA = true;
const ID_FILTRO = 'filtro-holograma-avatar';

/** Foto real (opcional): src/recursos/imagens/perfil/foto.webp. Vira a reserva do avatar. */
const fotos = import.meta.glob<string>('@/recursos/imagens/perfil/foto.{avif,webp,png,jpg,jpeg}', {
  eager: true,
  import: 'default',
});
const foto = Object.values(fotos)[0];

/** "#RRGGBB" → valores de 0 a 1, no formato do filtro SVG. */
function canal(hex: string, indice: 0 | 1 | 2): string {
  const valor = Number.parseInt(hex.slice(1 + indice * 2, 3 + indice * 2), 16);
  return (valor / 255).toFixed(3);
}

const paletaTritom = [tema.cores.fundo, tema.cores.destaque, tema.cores.brilho];
const tabelaTritom = (indice: 0 | 1 | 2) => paletaTritom.map((cor) => canal(cor, indice)).join(' ');

export function FotoPerfil() {
  const reserva = foto ? (
    <Imagem src={foto} alt={`Foto de ${perfil.nome}`} decoding="async" />
  ) : (
    <Iniciais aria-hidden="true">{perfil.iniciais}</Iniciais>
  );

  return (
    <Moldura $holograma={USAR_HOLOGRAMA}>
      {USAR_HOLOGRAMA && (
        <SvgFiltro aria-hidden="true" focusable="false">
          <filter id={ID_FILTRO} colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="table" tableValues={tabelaTritom(0)} />
              <feFuncG type="table" tableValues={tabelaTritom(1)} />
              <feFuncB type="table" tableValues={tabelaTritom(2)} />
            </feComponentTransfer>
          </filter>
        </SvgFiltro>
      )}

      <Anel aria-hidden="true" />
      <Disco>
        <AnimacaoRive
          src={ARQUIVO_AVATAR}
          stateMachine={MAQUINA_AVATAR}
          ajuste="cover"
          interativa={false}
          reserva={reserva}
        />
        <Varredura aria-hidden="true" />
      </Disco>
      <Online aria-hidden="true" />
    </Moldura>
  );
}

/** Dimensões explícitas e responsivas: o canvas WebGL nunca colapsa nem distorce. */
const Moldura = styled.div<{ $holograma: boolean }>`
  ${({ $holograma }) => css`
    position: relative;
    flex-shrink: 0;
    width: clamp(9.5rem, 22vw + 4rem, 12.5rem);
    aspect-ratio: 1 / 1;

    ${$holograma &&
    css`
      canvas {
        filter: url(#${ID_FILTRO});
      }

      ${midia.ponteiroFino} {
        &:hover canvas {
          filter: none;
        }
      }
    `}
  `}
`;

const SvgFiltro = styled.svg`
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
`;

/** Moldura neon: anel cônico verde → ciano girando, recortado por máscara radial. */
const Anel = styled.span`
  ${({ theme: { cores } }) => css`
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      ${cores.destaque},
      ${cores.brilho} 30%,
      transparent 45%,
      transparent 60%,
      ${comAlfa(cores.destaque, 0.6)} 80%,
      ${cores.destaque}
    );
    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), ${cores.fundo} calc(100% - 2px));
    mask: radial-gradient(farthest-side, transparent calc(100% - 3px), ${cores.fundo} calc(100% - 2px));
    filter: drop-shadow(0 0 8px ${comAlfa(cores.brilho, 0.7)});
    animation: ${girar} 7s linear infinite;

    ${midia.movimentoReduzido} {
      animation: none;
    }
  `}
`;

/** Disco central: posição relativa ao anel (5%), então escala junto com a moldura. */
const Disco = styled.div`
  ${({ theme: { cores } }) => css`
    position: absolute;
    inset: 5%;
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 1px solid ${cores.borda};
    border-radius: 50%;
    background:
      radial-gradient(circle at 50% 35%, ${comAlfa(cores.brilho, 0.16)}, transparent 65%),
      ${cores.fundo};
    box-shadow:
      inset 0 0 30px ${comAlfa(cores.destaque, 0.12)},
      0 0 40px -10px ${comAlfa(cores.destaque, 0.35)};
  `}
`;

const Imagem = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.3) contrast(1.05);
`;

const Iniciais = styled.span`
  ${({ theme: { cores, pesos } }) => css`
    font-size: clamp(2.6rem, 5vw + 1.4rem, 3.5rem);
    font-weight: ${pesos.extra};
    letter-spacing: -0.02em;
    ${textoNeon(cores.destaque)}
  `}
`;

const Varredura = styled.span`
  position: absolute;
  inset: 0;
  ${linhasVarredura(0.3)}
  pointer-events: none;
`;

const Online = styled.span`
  ${({ theme: { cores } }) => css`
    position: absolute;
    right: 10%;
    bottom: 10%;
    width: 16px;
    height: 16px;
    border: 3px solid ${cores.fundo};
    border-radius: 50%;
    background: ${cores.destaque};
    box-shadow: 0 0 12px ${cores.destaque};
    animation: ${pulsar} 2.4s ease-in-out infinite;

    ${midia.movimentoReduzido} {
      animation: none;
    }
  `}
`;
