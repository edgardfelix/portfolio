import { AnimatePresence, motion } from 'framer-motion';
import { Component, lazy, Suspense, useEffect, type ComponentType, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { piscar } from '@/estilos/fragmentos';
import { transicaoPagina } from '@/estilos/movimento';
import { Inicio } from '@/paginas/Inicio/Inicio';
import { NaoEncontrada } from '@/paginas/NaoEncontrada/NaoEncontrada';
import { CAMINHOS, paginas, type Carregador } from './caminhos';

/**
 * Página sob demanda. Se o módulo já foi pré-carregado, renderiza na hora —
 * sem passar pelo Suspense e sem "piscar" o indicador de carregamento.
 */
function paginaSobDemanda<M>(carregador: Carregador<M>, escolher: (modulo: M) => ComponentType) {
  const Preguicosa = lazy(() => carregador.carregar().then((modulo) => ({ default: escolher(modulo) })));

  return function PaginaSobDemanda() {
    const modulo = carregador.obter();
    const Pagina = modulo ? escolher(modulo) : Preguicosa;
    return <Pagina />;
  };
}

const Projetos = paginaSobDemanda(paginas.projetos, (modulo) => modulo.Projetos);
const Contato = paginaSobDemanda(paginas.contato, (modulo) => modulo.Contato);

/** Com o navegador ocioso, baixa as demais páginas (exceto no modo de economia de dados). */
function usePreCarregamentoOcioso(): void {
  useEffect(() => {
    const conexao = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conexao?.saveData) return;

    const carregarTudo = () => {
      for (const carregador of Object.values(paginas)) carregador.carregar().catch(() => undefined);
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(carregarTudo, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(carregarTudo, 2500);
    return () => clearTimeout(id);
  }, []);
}

/** Após a saída da página anterior: volta ao topo e leva o foco ao conteúdo (leitores de tela anunciam a troca). */
function aoConcluirSaida(): void {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.getElementById('conteudo')?.focus({ preventScroll: true });
}

export function Roteador() {
  const localizacao = useLocation();
  usePreCarregamentoOcioso();

  return (
    <AnimatePresence mode="wait" onExitComplete={aoConcluirSaida}>
      <Pagina key={localizacao.pathname} variants={transicaoPagina} initial="oculto" animate="visivel" exit="saida">
        <LimiteErro>
          <Suspense fallback={<Carregando />}>
            <Routes location={localizacao}>
              <Route path={CAMINHOS.inicio} element={<Inicio />} />
              <Route path={CAMINHOS.projetos} element={<Projetos />} />
              <Route path={CAMINHOS.contato} element={<Contato />} />
              <Route path="*" element={<NaoEncontrada />} />
            </Routes>
          </Suspense>
        </LimiteErro>
      </Pagina>
    </AnimatePresence>
  );
}

/** Falha ao baixar uma página (ex.: rede caiu, deploy novo): oferece recarregar em vez de tela vazia. */
class LimiteErro extends Component<{ children: ReactNode }, { falhou: boolean }> {
  state = { falhou: false };

  static getDerivedStateFromError() {
    return { falhou: true };
  }

  render() {
    if (!this.state.falhou) return this.props.children;
    return (
      <Aviso role="alert">
        <p>{'> falha ao carregar este módulo.'}</p>
        <BotaoRecarregar type="button" onClick={() => window.location.reload()}>
          Recarregar página
        </BotaoRecarregar>
      </Aviso>
    );
  }
}

function Carregando() {
  return (
    <Aviso as="output">
      <p>
        {'> carregando módulo'}
        <Cursor aria-hidden="true" />
      </p>
    </Aviso>
  );
}

const Pagina = styled(motion.div)`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Aviso = styled.div`
  ${({ theme: { cores, espacos, tamanhos } }) => css`
    display: grid;
    flex: 1;
    place-content: center;
    justify-items: center;
    gap: ${espacos[4]};
    min-height: 50vh;
    padding: ${espacos[8]};
    color: ${cores.textoSuave};
    font-size: ${tamanhos.sm};
  `}
`;

const Cursor = styled.span`
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

const BotaoRecarregar = styled.button`
  ${({ theme: { cores, espacos, raios } }) => css`
    padding: ${espacos[3]} ${espacos[5]};
    border: 1px solid ${cores.bordaBrilho};
    border-radius: ${raios.sm};
    color: ${cores.brilho};
  `}
`;
