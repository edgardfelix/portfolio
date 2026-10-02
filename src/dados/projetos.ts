import type { Projeto } from '@/tipos/dominio';
import { sanitizarUrl } from '@/utilitarios/seguranca';

const capas = import.meta.glob<string>('@/recursos/imagens/projetos/*.{avif,webp,png,jpg,jpeg}', {
  eager: true,
  import: 'default',
});

function capaDoProjeto(id: string): string | undefined {
  for (const [caminho, url] of Object.entries(capas)) {
    if (caminho.split('/').pop()?.replace(/\.\w+$/, '') === id) return url;
  }
  return undefined;
}

type ProjetoBase = Omit<Projeto, 'capa'>;

const catalogo: readonly ProjetoBase[] = [
  {
    id: 'api-gestao-contas-bancarias',
    titulo: 'API de Gestão de Contas Bancárias',
    categoria: 'Fintech · Back-end + Front-end',
    lema: 'Do zero. Sem “mágica”, só arquitetura.',
    resumo:
      'Aplicação completa de gestão de contas bancárias, focada em arquitetura limpa, segurança de dados e boas práticas. Em Fintech e Open Finance, o que importa fica escondido: regras de negócio blindadas, resiliência e organização.',
    tecnologias: [
      {
        grupo: 'Back-end',
        itens: ['Node.js', 'TypeScript', 'Express 5', 'Zod', 'Vitest + Supertest', 'Testes de integração'],
      },
      { grupo: 'Front-end', itens: ['React 19', 'TypeScript', 'Vite', 'Hooks customizados'] },
      {
        grupo: 'Arquitetura',
        itens: ['Layered Architecture', 'SOLID', 'Injeção de Dependências', 'In-Memory Repository'],
      },
    ],
    camadas: [
      {
        nome: 'Rotas',
        metafora: 'As placas',
        descricao: 'Dizem para onde cada pedido deve ir: depositar, sacar, abrir conta.',
      },
      {
        nome: 'Validação',
        metafora: 'O porteiro',
        descricao: 'Confere se o CPF é real e se o e-mail é válido, barrando dados errados antes mesmo de entrarem.',
      },
      {
        nome: 'Serviços',
        metafora: 'O gerente',
        descricao:
          'Onde moram as regras do banco: CPF duplicado não entra, saque acima do saldo é negado e conta com saldo não pode ser encerrada.',
      },
      {
        nome: 'Repositório',
        metafora: 'O cofre',
        descricao: 'Guarda e isola os dados para que nada seja alterado “sem querer”.',
      },
      {
        nome: 'Middleware',
        metafora: 'O tradutor de erros',
        descricao: 'Se algo der errado, avisa a tela o motivo exato, sempre no mesmo formato.',
      },
      {
        nome: 'Front-end',
        metafora: 'A tela',
        descricao: 'Simples e funcional: consome a API com estado organizado e sem bugs de sincronização.',
      },
    ],
    decisoes: [
      'Dinheiro em centavos (inteiros): nenhum valor monetário trafega como float.',
      'Inversão de dependência: trocar a memória por PostgreSQL é escrever uma classe e mudar uma linha.',
      'Validação na fronteira com Zod, incluindo os dígitos verificadores do CPF.',
      'Encerramento lógico: a conta passa a ENCERRADA e deixa de aceitar operações.',
    ],
    links: {
      // Ao publicar o repositório: 'https://github.com/edgardfelix/api-gestao-contas-bancarias'
      repositorio: undefined,
      demonstracao: undefined,
    },
    destaque: true,
  },
];

export const projetos: readonly Projeto[] = catalogo.map((projeto) => ({
  ...projeto,
  capa: capaDoProjeto(projeto.id),
  links: {
    repositorio: sanitizarUrl(projeto.links.repositorio, ['github.com']),
    demonstracao: sanitizarUrl(projeto.links.demonstracao),
  },
}));
