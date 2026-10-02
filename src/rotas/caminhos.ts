/**
 * Fonte única das rotas: o Roteador e a BarraNavegacao leem daqui.
 * Páginas secundárias são carregadas sob demanda; a Navbar usa o mesmo carregador
 * para pré-carregá-las assim que o usuário demonstra intenção (hover, foco ou toque).
 */

export const CAMINHOS = {
  inicio: '/',
  projetos: '/projetos',
  contato: '/contato',
} as const;

export interface Carregador<T> {
  /** Baixa o módulo (uma única vez) e devolve a mesma promessa nas chamadas seguintes. */
  carregar: () => Promise<T>;
  /** O módulo, se já estiver carregado. */
  obter: () => T | undefined;
}

export function criarCarregador<T>(importar: () => Promise<T>): Carregador<T> {
  let modulo: T | undefined;
  let promessa: Promise<T> | undefined;

  return {
    carregar() {
      promessa ??= importar().then(
        (resultado) => (modulo = resultado),
        (erro: unknown) => {
          promessa = undefined; // falha de rede: permite nova tentativa
          throw erro;
        },
      );
      return promessa;
    },
    obter: () => modulo,
  };
}

export const paginas = {
  projetos: criarCarregador(() => import('@/paginas/Projetos/Projetos')),
  contato: criarCarregador(() => import('@/paginas/Contato/Contato')),
};

/** Pré-carregamento é oportunista: se falhar, a navegação real tenta de novo. */
const preCarregar = (carregador: Carregador<unknown>) => () => {
  carregador.carregar().catch(() => undefined);
};

export interface ItemNavegacao {
  readonly caminho: string;
  readonly rotulo: string;
  readonly preCarregar?: () => void;
}

export const itensNavegacao: readonly ItemNavegacao[] = [
  { caminho: CAMINHOS.inicio, rotulo: 'Início' },
  { caminho: CAMINHOS.projetos, rotulo: 'Projetos', preCarregar: preCarregar(paginas.projetos) },
  { caminho: CAMINHOS.contato, rotulo: 'Contato', preCarregar: preCarregar(paginas.contato) },
];
