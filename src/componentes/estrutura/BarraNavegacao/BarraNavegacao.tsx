import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { perfil } from '@/dados/perfil';
import { CAMINHOS, itensNavegacao } from '@/rotas/caminhos';
import {
  Barra,
  BotaoMenu,
  Cabecalho,
  Cursor,
  Identificador,
  IndicadorAtivo,
  Indice,
  LinhaMenu,
  LinkNavegacao,
  ListaLinks,
  Marca,
  Monograma,
  NavegacaoDesktop,
  Prompt,
} from './BarraNavegacao.estilos';
import { MenuMovel } from './MenuMovel';

const ID_MENU_MOVEL = 'menu-movel';
const molaIndicador = { type: 'spring', stiffness: 420, damping: 34 } as const;

export function BarraNavegacao() {
  const { pathname } = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const [caminhoAtual, setCaminhoAtual] = useState(pathname);

  // Trocou de rota → fecha o menu (ajuste durante a renderização, sem efeito extra).
  if (caminhoAtual !== pathname) {
    setCaminhoAtual(pathname);
    setMenuAberto(false);
  }

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (posicao) => setRolou(posicao > 8));

  const fecharMenu = useCallback(() => setMenuAberto(false), []);

  return (
    <>
      <Cabecalho $rolou={rolou || menuAberto}>
        <Barra>
          <Marca to={CAMINHOS.inicio} aria-label={`${perfil.nome} — página inicial`}>
            <Monograma aria-hidden="true">{perfil.iniciais}</Monograma>
            <Identificador aria-hidden="true">
              <Prompt>~/</Prompt>
              {perfil.apelido}
              <Cursor />
            </Identificador>
          </Marca>

          <NavegacaoDesktop aria-label="Principal">
            <ListaLinks>
              {itensNavegacao.map((item, indice) => (
                <li key={item.caminho}>
                  <LinkNavegacao
                    to={item.caminho}
                    end={item.caminho === CAMINHOS.inicio}
                    onPointerEnter={item.preCarregar}
                    onFocus={item.preCarregar}
                  >
                    {({ isActive }) => (
                      <>
                        <Indice aria-hidden="true">{String(indice + 1).padStart(2, '0')}.</Indice>
                        {item.rotulo}
                        {isActive && <IndicadorAtivo layoutId="indicador-navegacao" transition={molaIndicador} />}
                      </>
                    )}
                  </LinkNavegacao>
                </li>
              ))}
            </ListaLinks>
          </NavegacaoDesktop>

          <BotaoMenu
            type="button"
            aria-expanded={menuAberto}
            aria-controls={ID_MENU_MOVEL}
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuAberto((aberto) => !aberto)}
          >
            <LinhaMenu animate={menuAberto ? { y: 3.75, rotate: 45 } : { y: 0, rotate: 0 }} />
            <LinhaMenu animate={menuAberto ? { y: -3.75, rotate: -45 } : { y: 0, rotate: 0 }} />
          </BotaoMenu>
        </Barra>
      </Cabecalho>

      {/* Fora do <header>: o backdrop-filter dele cria um containing block
          e prenderia a gaveta (position: fixed) à altura da barra. */}
      <MenuMovel id={ID_MENU_MOVEL} aberto={menuAberto} aoFechar={fecharMenu} />
    </>
  );
}
