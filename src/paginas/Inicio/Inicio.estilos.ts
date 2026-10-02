import { motion } from 'framer-motion';
import styled, { css, keyframes } from 'styled-components';
import { BrilhoLente } from '@/componentes/efeitos/BrilhoLente';
import { conteiner, gradeFundo, linhasVarredura, piscar, pulsar, textoNeon } from '@/estilos/fragmentos';
import { midia } from '@/estilos/midias';
import { comAlfa } from '@/estilos/tema';

const ondaPulso = keyframes`
  from { transform: scale(0.6); opacity: 0.9; }
  to { transform: scale(2.4); opacity: 0; }
`;

export const Heroi = styled.section`
  ${({ theme: { medidas, espacos } }) => css`
    position: relative;
    isolation: isolate;
    display: flex;
    flex: 1;
    align-items: center;
    min-height: 100svh;
    /* Sobe por baixo da Navbar de vidro: a chuva aparece através do blur */
    margin-top: calc(-1 * ${medidas.alturaNavegacao});
    padding: calc(${medidas.alturaNavegacao} + ${espacos[12]}) 0 ${espacos[16]};
    overflow: hidden;
  `}
`;

export const Fundo = styled.div`
  ${({ theme: { cores } }) => css`
    position: absolute;
    inset: 0;
    z-index: -1;

    canvas {
      opacity: 0.95;
    }

    /* Véu: protege a leitura à esquerda e deixa a chuva viva à direita */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(
          90deg,
          ${comAlfa(cores.fundo, 0.94)} 0%,
          ${comAlfa(cores.fundo, 0.78)} 38%,
          ${comAlfa(cores.fundo, 0.12)} 74%,
          ${comAlfa(cores.fundo, 0.3)} 100%
        ),
        linear-gradient(180deg, ${comAlfa(cores.fundo, 0.5)} 0%, transparent 14%, transparent 74%, ${cores.fundo} 100%);
    }

    ${midia.abaixo('notebook')} {
      &::after {
        background: linear-gradient(
          180deg,
          ${comAlfa(cores.fundo, 0.35)} 0%,
          ${comAlfa(cores.fundo, 0.76)} 30%,
          ${comAlfa(cores.fundo, 0.76)} 74%,
          ${cores.fundo} 100%
        );
      }
    }
  `}
`;

/** O flare principal sai de cima do conteúdo em telas estreitas. */
export const BrilhoPrincipal = styled(BrilhoLente)`
  ${midia.abaixo('tablet')} {
    top: 3%;
    left: 96%;
  }
`;

/** Duas colunas no desktop (texto | janela com a animação); uma coluna no celular. */
export const Conteudo = styled(motion.div)`
  ${conteiner}
  position: relative;
  z-index: 1;
  display: grid;
  align-items: center;
  gap: ${({ theme }) => theme.espacos[12]};

  ${midia.acima('notebook')} {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
    gap: ${({ theme }) => theme.espacos[10]};
  }
`;

/** Coluna de texto. container-type permite que o título escale pela largura da coluna (cqi). */
export const Texto = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  container-type: inline-size;
`;

export const Status = styled(motion.p)`
  ${({ theme: { cores, raios, tamanhos, espacos } }) => css`
    display: inline-flex;
    align-items: center;
    gap: ${espacos[3]};
    margin-bottom: ${espacos[8]};
    padding: ${espacos[2]} ${espacos[4]};
    border: 1px solid ${cores.bordaForte};
    border-radius: ${raios.pilula};
    background: ${comAlfa(cores.destaque, 0.06)};
    color: ${cores.texto};
    font-size: ${tamanhos.xs};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  `}
`;

export const Pulso = styled.span`
  ${({ theme: { cores } }) => css`
    position: relative;
    flex-shrink: 0;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: ${cores.destaque};
    box-shadow: 0 0 10px ${cores.destaque};

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

export const Comando = styled(motion.p)`
  ${({ theme: { cores, tamanhos, espacos } }) => css`
    margin-bottom: ${espacos[3]};
    color: ${cores.textoSuave};
    font-size: ${tamanhos.sm};
  `}
`;

export const Prompt = styled.span`
  margin-right: 1ch;
  color: ${({ theme }) => theme.cores.brilho};
`;

export const Titulo = styled(motion.h1)`
  ${({ theme: { cores, tamanhos, pesos, espacos } }) => css`
    margin-bottom: ${espacos[5]};
    font-size: ${tamanhos.gigante};
    /* Escala pela largura da coluna de texto: nunca estoura, nem no layout de duas colunas */
    font-size: clamp(2.4rem, 14cqi, 6.25rem);
    font-weight: ${pesos.extra};
    line-height: 0.95;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    ${textoNeon(cores.destaque)}
  `}
`;

export const Cargo = styled(motion.p)`
  ${({ theme: { cores, tamanhos, pesos, espacos, sombras } }) => css`
    display: flex;
    align-items: baseline;
    gap: ${espacos[3]};
    min-height: 1.6em;
    margin-bottom: ${espacos[6]};
    color: ${cores.brilho};
    font-size: ${tamanhos.lg};
    font-weight: ${pesos.medio};
    text-shadow: ${sombras.textoBrilho};
  `}
`;

export const Seta = styled.span`
  color: ${({ theme }) => theme.cores.destaque};
`;

export const Chamada = styled(motion.p)`
  ${({ theme: { cores, tamanhos, medidas, espacos } }) => css`
    max-width: ${medidas.larguraTexto};
    margin-bottom: ${espacos[10]};
    color: ${cores.textoSuave};
    font-size: ${tamanhos.md};
    line-height: 1.75;
  `}
`;

export const Acoes = styled(motion.div)`
  ${({ theme: { espacos } }) => css`
    display: flex;
    flex-wrap: wrap;
    gap: ${espacos[5]} ${espacos[6]};
    margin-bottom: ${espacos[12]};

    ${midia.abaixo('celular')} {
      width: 100%;

      & > * {
        flex: 1 1 100%;
      }
    }
  `}
`;

export const Especialidades = styled(motion.ul)`
  ${({ theme: { cores, tamanhos, espacos } }) => css`
    display: flex;
    flex-wrap: wrap;
    gap: ${espacos[2]} ${espacos[5]};
    padding: 0;
    list-style: none;
    color: ${cores.textoSuave};
    font-size: ${tamanhos.xs};
    letter-spacing: 0.06em;

    li::before {
      content: '#';
      margin-right: 0.35ch;
      color: ${cores.brilho};
    }
  `}
`;

/* ── Janela da animação Rive (coluna direita) ────────────────────────────── */

/** Proporção exata do artboard do arquivo .riv (1440 × 929): o Fit.Contain preenche tudo, sem faixas. */
const PROPORCAO_COMPUTADOR = '1440 / 929';

export const Janela = styled(motion.div)`
  ${({ theme: { cores, raios, sombras, desfoques } }) => css`
    position: relative;
    justify-self: center;
    width: 100%;
    max-width: 38rem;
    border: 1px solid ${cores.bordaForte};
    border-radius: ${raios.lg};
    background: ${comAlfa(cores.fundo, 0.72)};
    -webkit-backdrop-filter: ${desfoques.vidro};
    backdrop-filter: ${desfoques.vidro};
    box-shadow:
      ${sombras.elevacao},
      0 0 0 1px ${comAlfa(cores.brilho, 0.12)},
      0 30px 90px -40px ${comAlfa(cores.brilho, 0.55)};

    ${midia.acima('notebook')} {
      justify-self: end;
    }

    /* Cantoneiras de HUD */
    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 1.5px solid ${cores.brilho};
      filter: drop-shadow(0 0 6px ${cores.brilho});
      pointer-events: none;
    }

    &::before {
      top: -7px;
      left: -7px;
      border-right: 0;
      border-bottom: 0;
    }

    &::after {
      right: -7px;
      bottom: -7px;
      border-top: 0;
      border-left: 0;
    }
  `}
`;

export const BarraJanela = styled.div`
  ${({ theme: { cores, tamanhos, espacos } }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${espacos[4]};
    padding: ${espacos[2]} ${espacos[4]};
    border-bottom: 1px solid ${cores.borda};
    background: ${comAlfa(cores.destaque, 0.03)};
    color: ${cores.textoSuave};
    font-size: ${tamanhos.micro};
    letter-spacing: 0.08em;
  `}
`;

export const RotuloJanela = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.espacos[2]};
`;

export const PontoVivo = styled.span`
  ${({ theme: { cores } }) => css`
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: ${cores.destaque};
    box-shadow: 0 0 8px ${cores.destaque};
    animation: ${pulsar} 2.4s ease-in-out infinite;

    ${midia.movimentoReduzido} {
      animation: none;
    }
  `}
`;

/** Área da animação: dimensões explícitas (largura + aspect-ratio) — o canvas WebGL nunca colapsa. */
export const Tela = styled.div`
  ${({ theme: { cores, raios } }) => css`
    position: relative;
    display: grid;
    place-items: center;
    width: 100%;
    aspect-ratio: ${PROPORCAO_COMPUTADOR};
    overflow: hidden;
    border-radius: 0 0 calc(${raios.lg} - 1px) calc(${raios.lg} - 1px);
    background-color: ${cores.fundo};
    ${gradeFundo(24, 0.05)}

    /* Scanlines sutis por cima do render (não bloqueiam o ponteiro) */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      ${linhasVarredura(0.1)}
      pointer-events: none;
    }
  `}
`;

export const Espera = styled.p`
  ${({ theme: { cores, tamanhos } }) => css`
    color: ${cores.textoSuave};
    font-size: ${tamanhos.xs};
    letter-spacing: 0.08em;
  `}
`;

export const CursorEspera = styled.span`
  ${({ theme: { cores } }) => css`
    display: inline-block;
    width: 0.6em;
    height: 1.1em;
    margin-left: 0.3em;
    vertical-align: -0.2em;
    background: ${cores.destaque};
    animation: ${piscar} 1s steps(1) infinite;
  `}
`;
