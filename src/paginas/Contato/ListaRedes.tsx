import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { IconeCanal, IconeConfirmar, IconeCopiar, IconeSetaExterna } from '@/componentes/comuns/Icones';
import { LinkExterno } from '@/componentes/comuns/LinkExterno';
import { somenteLeitores } from '@/estilos/fragmentos';
import { midia } from '@/estilos/midias';
import { cascata, surgir } from '@/estilos/movimento';
import { comAlfa } from '@/estilos/tema';
import type { CanalContato } from '@/tipos/dominio';

interface Propriedades {
  canais: readonly CanalContato[];
}

/** Canais de contato em linhas de terminal; o e-mail ganha um botão de copiar. */
export function ListaRedes({ canais }: Propriedades) {
  return (
    <Lista variants={cascata(0.07, 0.15)}>
      {canais.map((canal) => (
        <motion.li key={canal.id} variants={surgir}>
          <Linha>
            <LinkCanal href={canal.href}>
              <Icone>
                <IconeCanal id={canal.id} />
              </Icone>
              <Rotulo>{canal.rotulo}</Rotulo>
              <Valor>{canal.id === 'email' ? <EmailQuebravel email={canal.exibicao} /> : canal.exibicao}</Valor>
              <Seta aria-hidden="true">
                <IconeSetaExterna />
              </Seta>
            </LinkCanal>
            {canal.id === 'email' && <BotaoCopiar texto={canal.exibicao} />}
          </Linha>
        </motion.li>
      ))}
    </Lista>
  );
}

/** Se faltar espaço, o e-mail quebra logo após o "@" (e não no meio de uma palavra). */
function EmailQuebravel({ email }: { email: string }) {
  const arroba = email.indexOf('@');
  if (arroba === -1) return email;
  return (
    <>
      {email.slice(0, arroba + 1)}
      <wbr />
      {email.slice(arroba + 1)}
    </>
  );
}

function BotaoCopiar({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return;
    const temporizador = setTimeout(() => setCopiado(false), 2200);
    return () => clearTimeout(temporizador);
  }, [copiado]);

  // A Clipboard API só existe em contexto seguro (https/localhost).
  if (typeof navigator === 'undefined' || !navigator.clipboard) return null;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
    } catch {
      // Permissão negada: o link mailto continua disponível ao lado.
    }
  }

  return (
    <Copiar type="button" onClick={() => void copiar()} $copiado={copiado}>
      {copiado ? <IconeConfirmar /> : <IconeCopiar />}
      <TextoCopiar>{copiado ? 'copiado' : 'copiar'}</TextoCopiar>
      <Oculto> e-mail</Oculto>
      <Oculto as="output">{copiado ? 'E-mail copiado para a área de transferência.' : ''}</Oculto>
    </Copiar>
  );
}

const Lista = styled(motion.ul)`
  display: grid;
  gap: ${({ theme }) => theme.espacos[2]};
  padding: 0;
  list-style: none;
`;

const Linha = styled.div`
  display: flex;
  align-items: stretch;
  gap: ${({ theme }) => theme.espacos[2]};
`;

const Icone = styled.span`
  ${({ theme: { cores, raios, duracoes, curvas } }) => css`
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid ${cores.borda};
    border-radius: ${raios.sm};
    color: ${cores.destaque};
    transition:
      color ${duracoes.media} ${curvas.suave},
      border-color ${duracoes.media} ${curvas.suave},
      box-shadow ${duracoes.media} ${curvas.suave};
  `}
`;

const Rotulo = styled.span`
  ${({ theme: { cores, tamanhos, pesos } }) => css`
    color: ${cores.texto};
    font-size: ${tamanhos.sm};
    font-weight: ${pesos.seminegrito};
  `}
`;

const Valor = styled.span`
  ${({ theme: { cores, tamanhos } }) => css`
    min-width: 0;
    color: ${cores.textoSuave};
    font-size: ${tamanhos.xs};
    overflow-wrap: anywhere;

    ${midia.acima('tablet')} {
      font-size: ${tamanhos.sm};
    }
  `}
`;

const Seta = styled.span`
  ${({ theme: { cores, duracoes, curvas } }) => css`
    display: inline-flex;
    color: ${cores.textoApagado};
    transition:
      transform ${duracoes.media} ${curvas.suave},
      color ${duracoes.media} ${curvas.suave};
  `}
`;

const LinkCanal = styled(LinkExterno)`
  ${({ theme: { cores, raios, espacos, sombras, duracoes, curvas } }) => css`
    position: relative;
    display: grid;
    flex: 1;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      'icone rotulo seta'
      'icone valor seta';
    align-items: center;
    column-gap: ${espacos[3]};
    min-width: 0;
    padding: ${espacos[3]};
    border: 1px solid ${cores.borda};
    border-radius: ${raios.md};
    background: ${cores.superficie};
    transition:
      border-color ${duracoes.media} ${curvas.suave},
      background-color ${duracoes.media} ${curvas.suave},
      box-shadow ${duracoes.media} ${curvas.suave};

    ${Icone} {
      grid-area: icone;
    }

    ${Rotulo} {
      grid-area: rotulo;
    }

    ${Valor} {
      grid-area: valor;
    }

    ${Seta} {
      grid-area: seta;
    }

    ${midia.acima('tablet')} {
      grid-template-columns: auto 6.5rem minmax(0, 1fr) auto;
      grid-template-areas: 'icone rotulo valor seta';
      column-gap: ${espacos[4]};
      padding: ${espacos[3]} ${espacos[4]};
    }

    &:active {
      background: ${cores.superficieElevada};
    }

    ${midia.ponteiroFino} {
      &:hover {
        border-color: ${cores.bordaBrilho};
        background: ${comAlfa(cores.brilho, 0.05)};
        box-shadow: inset 3px 0 0 ${cores.brilho}, 0 0 24px -8px ${comAlfa(cores.brilho, 0.45)};
      }

      &:hover ${Icone} {
        border-color: ${cores.brilho};
        color: ${cores.brilho};
        box-shadow: ${sombras.neonBrilho};
      }

      &:hover ${Seta} {
        color: ${cores.brilho};
        transform: translate(2px, -2px);
      }
    }
  `}
`;

const Copiar = styled.button<{ $copiado: boolean }>`
  ${({ theme: { cores, raios, tamanhos, espacos, duracoes, curvas }, $copiado }) => css`
    display: inline-flex;
    flex-shrink: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${espacos[1]};
    min-width: 2.75rem;
    padding: ${espacos[2]};

    ${midia.acima('tablet')} {
      min-width: 4.25rem;
    }
    border: 1px solid ${$copiado ? cores.destaque : cores.borda};
    border-radius: ${raios.md};
    background: ${$copiado ? comAlfa(cores.destaque, 0.1) : cores.superficie};
    color: ${$copiado ? cores.destaque : cores.textoSuave};
    font-size: ${tamanhos.micro};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition:
      color ${duracoes.media} ${curvas.suave},
      border-color ${duracoes.media} ${curvas.suave},
      background-color ${duracoes.media} ${curvas.suave};

    ${midia.ponteiroFino} {
      &:hover {
        border-color: ${cores.bordaForte};
        color: ${cores.destaque};
      }
    }
  `}
`;

/** No celular o botão fica só com o ícone (o nome acessível continua completo). */
const TextoCopiar = styled.span`
  ${somenteLeitores}

  ${midia.acima('tablet')} {
    position: static !important;
    width: auto;
    height: auto;
    margin: 0;
    overflow: visible;
    clip-path: none;
    white-space: normal;
  }
`;

const Oculto = styled.span`
  ${somenteLeitores}
`;
