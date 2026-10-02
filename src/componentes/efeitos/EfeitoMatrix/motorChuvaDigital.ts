/**
 * Motor da "chuva digital" em <canvas> 2D — puro TypeScript, sem React e sem dependências.
 *
 * Como fica leve:
 * - o rastro nasce de UM fillRect translúcido por quadro (nada de histórico em memória);
 * - só se desenha quando a "cabeça" de uma coluna muda de célula;
 * - ~30 fps por padrão (o ritmo clássico do efeito, com metade do custo de 60 fps);
 * - densidade de pixels limitada a 2×;
 * - pausa sozinho com a aba oculta ou com o canvas fora da tela;
 * - em modo estático (movimento reduzido), desenha um único quadro e para.
 */

export interface OpcoesChuva {
  /** Cores em hexadecimal (#RRGGBB). */
  corFundo: string;
  corRastro: string;
  corCabeca: string;
  /** Pilha de fontes do canvas. */
  fonte: string;
  tamanhoFonte?: number;
  fps?: number;
  /** Intensidade do rastro: quanto maior, mais curto. */
  esmaecimento?: number;
  estatica?: boolean;
}

export interface ChuvaDigital {
  destruir: () => void;
}

interface Coluna {
  x: number;
  /** Posição da cabeça, em células (fracionária). */
  y: number;
  /** Células por quadro. */
  velocidade: number;
  /** 0.35–1: colunas "distantes" são mais lentas e mais apagadas (profundidade). */
  intensidade: number;
  ultimaCelula: number;
}

const GLIFOS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789Z:."=*+-<>¦|';
const CHANCE_REINICIO = 0.025;

const glifoAleatorio = () => GLIFOS.charAt(Math.floor(Math.random() * GLIFOS.length));

function rgba(hex: string, alfa: number): string {
  const valor = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(valor >> 16) & 255}, ${(valor >> 8) & 255}, ${valor & 255}, ${alfa})`;
}

function novaColuna(x: number, linhas: number, dentroDaTela: boolean): Coluna {
  const profundidade = Math.random();
  const y = dentroDaTela ? Math.random() * linhas : -Math.random() * linhas * 0.6;
  return {
    x,
    y,
    velocidade: 0.3 + profundidade * 0.5,
    intensidade: 0.35 + profundidade * 0.65,
    ultimaCelula: Math.floor(y),
  };
}

export function criarChuvaDigital(canvas: HTMLCanvasElement, opcoes: OpcoesChuva): ChuvaDigital {
  const contexto = canvas.getContext('2d', { alpha: false });
  if (!contexto) return { destruir: () => undefined };
  const ctx = contexto;

  const { corFundo, corRastro, corCabeca, fonte, tamanhoFonte = 16, fps = 30, esmaecimento = 0.06 } = opcoes;
  const estatica = opcoes.estatica ?? false;
  const intervalo = 1000 / fps;
  const corVeu = rgba(corFundo, esmaecimento);

  let largura = 0;
  let altura = 0;
  let linhas = 0;
  let colunas: Coluna[] = [];
  let quadro = 0;
  let ultimoQuadro = 0;
  let abaVisivel = !document.hidden;
  let naTela = true;

  function configurarTexto() {
    ctx.font = `${tamanhoFonte}px ${fonte}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
  }

  function redimensionar() {
    const { width, height } = canvas.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    const densidade = Math.min(window.devicePixelRatio || 1, 2);
    largura = width;
    altura = height;
    linhas = Math.ceil(altura / tamanhoFonte);
    canvas.width = Math.round(largura * densidade);
    canvas.height = Math.round(altura * densidade);
    ctx.setTransform(densidade, 0, 0, densidade, 0, 0);
    configurarTexto();

    // Mantém as colunas existentes e cria só as que faltam.
    const total = Math.ceil(largura / tamanhoFonte);
    colunas = Array.from(
      { length: total },
      (_, indice) => colunas[indice] ?? novaColuna(indice * tamanhoFonte, linhas, true),
    );

    ctx.fillStyle = corFundo;
    ctx.fillRect(0, 0, largura, altura);
    // Pré-aquece: a tela já nasce "chovendo".
    for (let passo = 0; passo < linhas; passo++) desenhar();
  }

  function desenhar() {
    ctx.fillStyle = corVeu;
    ctx.fillRect(0, 0, largura, altura);

    for (const coluna of colunas) {
      coluna.y += coluna.velocidade;
      const celula = Math.floor(coluna.y);
      if (celula === coluna.ultimaCelula) continue;

      const centro = coluna.x + tamanhoFonte / 2;

      // A cabeça anterior vira rastro verde (a célula é limpa por inteiro antes)...
      if (coluna.ultimaCelula >= 0) {
        const yAnterior = coluna.ultimaCelula * tamanhoFonte;
        ctx.globalAlpha = 1;
        ctx.fillStyle = corFundo;
        ctx.fillRect(coluna.x, yAnterior, tamanhoFonte, tamanhoFonte);
        ctx.globalAlpha = coluna.intensidade;
        ctx.fillStyle = corRastro;
        ctx.fillText(glifoAleatorio(), centro, yAnterior);
      }

      // ...e a nova cabeça acende em ciano.
      if (celula >= 0) {
        ctx.globalAlpha = coluna.intensidade;
        ctx.fillStyle = corCabeca;
        ctx.fillText(glifoAleatorio(), centro, celula * tamanhoFonte);
      }

      coluna.ultimaCelula = celula;

      if (celula > linhas && Math.random() < CHANCE_REINICIO) {
        Object.assign(coluna, novaColuna(coluna.x, linhas, false));
      }
    }

    ctx.globalAlpha = 1;
  }

  function aoQuadro(agora: number) {
    quadro = requestAnimationFrame(aoQuadro);
    const decorrido = agora - ultimoQuadro;
    if (decorrido < intervalo) return;
    ultimoQuadro = agora - (decorrido % intervalo);
    desenhar();
  }

  function atualizarExecucao() {
    cancelAnimationFrame(quadro);
    if (!estatica && abaVisivel && naTela) quadro = requestAnimationFrame(aoQuadro);
  }

  const observadorTamanho = new ResizeObserver(() => redimensionar());
  const observadorVisibilidade = new IntersectionObserver(([entrada]) => {
    naTela = entrada?.isIntersecting ?? true;
    atualizarExecucao();
  });

  function aoMudarVisibilidade() {
    abaVisivel = !document.hidden;
    atualizarExecucao();
  }

  // O ResizeObserver dispara logo ao observar: é ele quem faz o primeiro dimensionamento.
  observadorTamanho.observe(canvas);
  observadorVisibilidade.observe(canvas);
  document.addEventListener('visibilitychange', aoMudarVisibilidade);
  atualizarExecucao();

  return {
    destruir() {
      cancelAnimationFrame(quadro);
      observadorTamanho.disconnect();
      observadorVisibilidade.disconnect();
      document.removeEventListener('visibilitychange', aoMudarVisibilidade);
    },
  };
}
