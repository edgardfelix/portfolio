import { ambiente } from '@/configuracao/ambiente';
import type { Perfil } from '@/tipos/dominio';

/** "Félix" → "Felix" */
const semAcentos = (texto: string) => texto.normalize('NFD').replace(/\p{Diacritic}/gu, '');

function obterIniciais(nome: string): string {
  const partes = nome.split(/\s+/).filter(Boolean);
  const primeira = partes[0]?.charAt(0) ?? '';
  const ultima = partes.length > 1 ? (partes.at(-1)?.charAt(0) ?? '') : '';
  return semAcentos(primeira + ultima).toUpperCase();
}

/** "Edgard Felix" → "edgard.felix" */
const criarApelido = (nome: string) => semAcentos(nome).trim().toLowerCase().split(/\s+/).join('.');

/**
 * Identidade exibida no site. Nome e cargo vêm do .env; os textos abaixo podem
 * ser editados livremente.
 */
export const perfil: Perfil = {
  nome: ambiente.nome,
  cargo: ambiente.cargo,
  iniciais: obterIniciais(ambiente.nome),
  apelido: criarApelido(ambiente.nome),
  status: 'Disponível para novas oportunidades',
  chamada:
    'Arquitetura limpa, regras de negócio blindadas e interfaces precisas — do back-end ao último pixel.',
  especialidades: ['TypeScript', 'Node.js', 'React', 'Express', 'Arquitetura em camadas'],
};
