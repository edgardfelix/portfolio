import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { IconeCanal, IconeFechar } from '@/componentes/comuns/Icones';
import { LinkExterno } from '@/componentes/comuns/LinkExterno';
import { redes } from '@/dados/contatos';
import { somenteLeitores } from '@/estilos/fragmentos';
import { consulta, midia } from '@/estilos/midias';
import { cascata, surgir } from '@/estilos/movimento';
import { comAlfa } from '@/estilos/tema';
import { useTravarRolagem } from '@/ganchos/useTravarRolagem';
import { CAMINHOS, itensNavegacao } from '@/rotas/caminhos';

const SELETOR_FOCAVEIS = 'a[href], button:not([disabled])';
const DISTANCIA_PARA_FECHAR = 80;
const VELOCIDADE_PARA_FECHAR = 500;

interface Propriedades {
  id: string;
  aberto: boolean;
  aoFechar: () => void;
}

/** Gaveta de navegação para telas pequenas: Esc fecha, foco fica preso no painel e dá para arrastar → para fechar. */
export function MenuMovel({ id, aberto, aoFechar }: Propriedades) {
  const refPainel = useRef<HTMLDivElement>(null);
  useTravarRolagem(aberto);

  useEffect(() => {
    if (!aberto) return;

    const painel = refPainel.current;
    const focoAnterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    painel?.querySelector<HTMLElement>(SELETOR_FOCAVEIS)?.focus();

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        aoFechar();
        return;
      }
      if (evento.key !== 'Tab' || !painel) return;

      const focaveis = Array.from(painel.querySelectorAll<HTMLElement>(SELETOR_FOCAVEIS));
      const primeiro = focaveis[0];
      const ultimo = focaveis.at(-1);
      if (!primeiro || !ultimo) return;

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }

    // Se a janela crescer até o layout desktop, o menu móvel deixa de existir.
    const telaLarga = window.matchMedia(consulta.acima('tablet'));
    const aoRedimensionar = (evento: MediaQueryListEvent) => {
      if (evento.matches) aoFechar();
    };

    document.addEventListener('keydown', aoTeclar);
    telaLarga.addEventListener('change', aoRedimensionar);
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      telaLarga.removeEventListener('change', aoRedimensionar);
      focoAnterior?.focus({ preventScroll: true });
    };
  }, [aberto, aoFechar]);

  function aoSoltar(_evento: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    if (info.offset.x > DISTANCIA_PARA_FECHAR || info.velocity.x > VELOCIDADE_PARA_FECHAR) aoFechar();
  }

  return (
    <AnimatePresence>
      {aberto && (
        <Camada key="menu-movel">
          <Veu initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={aoFechar} />

          <Painel
            ref={refPainel}
            id={id}
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- padrão WAI-ARIA APG: painel animado, foco preso manualmente
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 36 }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.6 }}
            onDragEnd={aoSoltar}
          >
            <Topo>
              <Rotulo aria-hidden="true">{'// navegação'}</Rotulo>
              <BotaoFechar type="button" onClick={aoFechar} aria-label="Fechar menu">
                <IconeFechar />
              </BotaoFechar>
            </Topo>

            <nav aria-label="Principal">
              <Lista variants={cascata(0.07, 0.12)} initial="oculto" animate="visivel">
                {itensNavegacao.map((item, indice) => (
                  <motion.li key={item.caminho} variants={surgir}>
                    <LinkMovel
                      to={item.caminho}
                      end={item.caminho === CAMINHOS.inicio}
                      onClick={aoFechar}
                      onTouchStart={item.preCarregar}
                    >
                      <Indice aria-hidden="true">{String(indice + 1).padStart(2, '0')}</Indice>
                      {item.rotulo}
                    </LinkMovel>
                  </motion.li>
                ))}
              </Lista>
            </nav>

            <Base>
              <Redes aria-label="Redes sociais">
                {redes.map((canal) => (
                  <li key={canal.id}>
                    <LinkRede href={canal.href}>
                      <IconeCanal id={canal.id} />
                      <Oculto>{canal.rotulo}</Oculto>
                    </LinkRede>
                  </li>
                ))}
              </Redes>
              <Dica aria-hidden="true">arraste → para fechar</Dica>
            </Base>
          </Painel>
        </Camada>
      )}
    </AnimatePresence>
  );
}

const Camada = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.camadas.menu};

  ${midia.acima('tablet')} {
    display: none;
  }
`;

const Veu = styled(motion.div)`
  ${({ theme: { cores } }) => css`
    position: absolute;
    inset: 0;
    background: ${comAlfa(cores.fundo, 0.66)};
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
  `}
`;

const Painel = styled(motion.div)`
  ${({ theme: { cores, espacos, desfoques } }) => css`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: ${espacos[8]};
    width: min(86vw, 22rem);
    padding: max(${espacos[5]}, env(safe-area-inset-top)) ${espacos[6]} max(${espacos[6]}, env(safe-area-inset-bottom));
    overflow-y: auto;
    border-left: 1px solid ${cores.bordaForte};
    background-color: ${cores.veuDenso};
    background-image:
      radial-gradient(26rem 18rem at 100% 0%, ${comAlfa(cores.brilho, 0.12)}, transparent 70%),
      linear-gradient(${comAlfa(cores.destaque, 0.04)} 1px, transparent 1px),
      linear-gradient(90deg, ${comAlfa(cores.destaque, 0.04)} 1px, transparent 1px);
    background-size:
      auto,
      40px 40px,
      40px 40px;
    -webkit-backdrop-filter: ${desfoques.denso};
    backdrop-filter: ${desfoques.denso};
    box-shadow: -24px 0 60px -30px ${comAlfa(cores.brilho, 0.45)};
    touch-action: pan-y;

    /* Borda viva à esquerda */
    &::before {
      content: '';
      position: absolute;
      top: 12%;
      bottom: 12%;
      left: -1px;
      width: 1px;
      background: linear-gradient(transparent, ${cores.brilho}, transparent);
      box-shadow: 0 0 12px ${cores.brilho};
    }
  `}
`;

const Topo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Rotulo = styled.span`
  ${({ theme: { cores, tamanhos } }) => css`
    font-size: ${tamanhos.xs};
    color: ${cores.textoApagado};
    letter-spacing: 0.08em;
  `}
`;

const BotaoFechar = styled.button`
  ${({ theme: { cores, raios } }) => css`
    display: grid;
    place-items: center;
    width: 2.75rem;
    height: 2.75rem;
    border: 1px solid ${cores.bordaBrilho};
    border-radius: ${raios.sm};
    color: ${cores.brilho};
    box-shadow: 0 0 16px ${comAlfa(cores.brilho, 0.25)};
  `}
`;

const Lista = styled(motion.ul)`
  display: grid;
  padding: 0;
  list-style: none;
`;

const Indice = styled.span`
  ${({ theme: { cores, tamanhos } }) => css`
    font-size: ${tamanhos.xs};
    font-weight: 400;
    color: ${cores.brilhoSuave};
  `}
`;

const LinkMovel = styled(NavLink)`
  ${({ theme: { cores, tamanhos, pesos, espacos, sombras, duracoes, curvas } }) => css`
    display: flex;
    align-items: baseline;
    gap: ${espacos[4]};
    padding: ${espacos[4]} 0;
    border-bottom: 1px solid ${cores.borda};
    font-size: ${tamanhos.xl};
    font-weight: ${pesos.seminegrito};
    color: ${cores.textoSuave};
    transition:
      color ${duracoes.media} ${curvas.suave},
      padding-left ${duracoes.media} ${curvas.suave},
      text-shadow ${duracoes.media} ${curvas.suave};

    &.active {
      padding-left: ${espacos[2]};
      border-bottom-color: ${cores.bordaForte};
      color: ${cores.destaque};
      text-shadow: ${sombras.textoDestaque};
    }

    &:active {
      color: ${cores.destaque};
    }
  `}
`;

const Base = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.espacos[4]};
  margin-top: auto;
`;

const Redes = styled.ul`
  display: flex;
  gap: ${({ theme }) => theme.espacos[3]};
  padding: 0;
  list-style: none;
`;

const LinkRede = styled(LinkExterno)`
  ${({ theme: { cores, raios } }) => css`
    display: grid;
    place-items: center;
    width: 2.75rem;
    height: 2.75rem;
    border: 1px solid ${cores.borda};
    border-radius: ${raios.sm};
    color: ${cores.texto};

    &:active {
      border-color: ${cores.brilho};
      color: ${cores.brilho};
    }
  `}
`;

const Oculto = styled.span`
  ${somenteLeitores}
`;

const Dica = styled.span`
  ${({ theme: { cores, tamanhos } }) => css`
    font-size: ${tamanhos.micro};
    color: ${cores.textoApagado};
    letter-spacing: 0.06em;
  `}
`;
