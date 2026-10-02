import { Alignment, Fit, Layout, RuntimeLoader, useRive } from '@rive-app/react-webgl2';
import urlWasm from '@rive-app/webgl2/rive.wasm?url';
import urlWasmReserva from '@rive-app/webgl2/rive_fallback.wasm?url';
import { useInView, useReducedMotion } from 'framer-motion';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import styled, { css } from 'styled-components';

/*
 * Por padrão o runtime do Rive baixa o WebAssembly do unpkg (e, como reserva, do jsdelivr).
 * Aqui os dois .wasm passam a sair do próprio site — o Vite os copia para dist/assets com hash.
 * Resultado: nenhuma requisição a terceiros e a CSP segue com connect-src 'self'.
 */
RuntimeLoader.setWasmUrl(urlWasm);
RuntimeLoader.setWasmFallbackUrl(urlWasmReserva);

/** Sem WebGL2, ou com o modo de economia de dados ligado, fica só a reserva estática. */
const PODE_CARREGAR =
  typeof window !== 'undefined' &&
  'WebGL2RenderingContext' in window &&
  (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData !== true;

type Estado = 'carregando' | 'pronta' | 'falhou';

interface Propriedades {
  /** Arquivo .riv servido a partir de public/ (ex.: "/animacao.riv"). */
  src: string;
  /** State machine definida no editor do Rive. */
  stateMachine?: string;
  /** contain = artboard inteiro visível · cover = preenche o contêiner (pode recortar). */
  ajuste?: 'contain' | 'cover';
  /** false para arquivos sem interação: o Rive deixa de processar eventos de ponteiro. */
  interativa?: boolean;
  /** Exibida enquanto carrega, se falhar ou se o dispositivo não puder rodar o Rive. */
  reserva?: ReactNode;
}

/**
 * Animação Rive (WebGL2) que nunca colapsa para 0 px: ocupa 100% do contêiner pai,
 * que DEVE ter position: relative e dimensões explícitas (largura + aspect-ratio).
 *
 * - O runtime (~2 MB de WebAssembly) só é baixado quando o contêiner chega perto da tela.
 * - O canvas entra com fade quando o arquivo termina de carregar; até lá, aparece a reserva.
 * - Com prefers-reduced-motion, o Rive desenha um quadro estático em vez de animar.
 */
export function AnimacaoRive({ src, stateMachine, ajuste = 'contain', interativa = true, reserva }: Propriedades) {
  const refRaiz = useRef<HTMLDivElement>(null);
  const perto = useInView(refRaiz, { once: true, margin: '240px' });
  const [estado, setEstado] = useState<Estado>('carregando');

  return (
    <Raiz ref={refRaiz}>
      {PODE_CARREGAR && perto && estado !== 'falhou' && (
        <Superficie $visivel={estado === 'pronta'}>
          <TelaRive
            src={src}
            stateMachine={stateMachine}
            ajuste={ajuste}
            interativa={interativa}
            aoCarregar={() => setEstado('pronta')}
            aoFalhar={() => setEstado('falhou')}
          />
        </Superficie>
      )}

      {/* Crossfade: a reserva esmaece junto com a entrada do canvas — nunca há um quadro vazio */}
      {reserva && <Reserva $oculta={estado === 'pronta'}>{reserva}</Reserva>}
    </Raiz>
  );
}

interface PropriedadesTela extends Required<Pick<Propriedades, 'src' | 'ajuste' | 'interativa'>> {
  stateMachine?: string;
  aoCarregar: () => void;
  aoFalhar: () => void;
}

/** Componente separado para que o useRive só rode quando a animação de fato for montada. */
function TelaRive({ src, stateMachine, ajuste, interativa, aoCarregar, aoFalhar }: PropriedadesTela) {
  const movimentoReduzido = useReducedMotion() ?? false;
  const layout = useMemo(
    () => new Layout({ fit: ajuste === 'cover' ? Fit.Cover : Fit.Contain, alignment: Alignment.Center }),
    [ajuste],
  );

  const { RiveComponent } = useRive(
    {
      src,
      stateMachine,
      layout,
      autoplay: !movimentoReduzido,
      // Segurança: nada de assets do CDN do Rive nem de eventos que abrem URLs sozinhos.
      enableRiveAssetCDN: false,
      automaticallyHandleEvents: false,
      // No celular, arrastar o dedo sobre a animação continua rolando a página.
      isTouchScrollEnabled: true,
      shouldDisableRiveListeners: !interativa,
      onLoad: aoCarregar,
      onLoadError: aoFalhar,
    },
    // Nitidez: o canvas acompanha o tamanho do contêiner × devicePixelRatio.
    { useDevicePixelRatio: true, shouldResizeCanvasToContainer: true },
  );

  // Sem className: assim o RiveComponent aplica width/height 100% no próprio contêiner.
  return <RiveComponent aria-hidden="true" />;
}

const Raiz = styled.div`
  position: absolute;
  inset: 0;
`;

const DURACAO_FADE = '700ms';

const Superficie = styled.div<{ $visivel: boolean }>`
  ${({ theme: { curvas }, $visivel }) => css`
    position: absolute;
    inset: 0;
    opacity: ${$visivel ? 1 : 0};
    transition: opacity ${DURACAO_FADE} ${curvas.suave};
  `}
`;

const Reserva = styled.div<{ $oculta: boolean }>`
  ${({ theme: { curvas }, $oculta }) => css`
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    opacity: ${$oculta ? 0 : 1};
    /* visibility sai só no fim do fade: tira a reserva da árvore de acessibilidade sem cortar a animação */
    visibility: ${$oculta ? 'hidden' : 'visible'};
    transition:
      opacity ${DURACAO_FADE} ${curvas.suave},
      visibility 0s linear ${$oculta ? DURACAO_FADE : '0s'};
    pointer-events: none;
  `}
`;
