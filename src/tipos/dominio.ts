export interface Perfil {
  readonly nome: string;
  readonly cargo: string;
  /** Ex.: "EF" */
  readonly iniciais: string;
  /** Ex.: "edgard.felix" */
  readonly apelido: string;
  readonly status: string;
  /** Frase de impacto do hero. */
  readonly chamada: string;
  readonly especialidades: readonly string[];
}

export type IdCanal = 'whatsapp' | 'email' | 'github' | 'linkedin' | 'instagram';

export interface CanalContato {
  readonly id: IdCanal;
  readonly rotulo: string;
  /** Texto visível: "github.com/edgardfelix", "+55 (11) 9...". */
  readonly exibicao: string;
  /** Já validado: https ou mailto. */
  readonly href: string;
}

export interface GrupoTecnologias {
  readonly grupo: string;
  readonly itens: readonly string[];
}

export interface CamadaProjeto {
  readonly nome: string;
  readonly metafora: string;
  readonly descricao: string;
}

export interface LinksProjeto {
  readonly repositorio?: string;
  readonly demonstracao?: string;
}

export interface Projeto {
  /** Slug único; também nomeia a capa: src/recursos/imagens/projetos/<id>.webp */
  readonly id: string;
  readonly titulo: string;
  readonly categoria: string;
  readonly lema?: string;
  readonly resumo: string;
  readonly tecnologias: readonly GrupoTecnologias[];
  readonly camadas?: readonly CamadaProjeto[];
  readonly decisoes?: readonly string[];
  readonly links: LinksProjeto;
  /** Preenchida automaticamente quando existe imagem com o mesmo id. */
  readonly capa?: string;
  /** Ocupa a largura inteira do grid. */
  readonly destaque?: boolean;
}
