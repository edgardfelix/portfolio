import { sanitizarUrl, validarEmail, validarTelefone } from '@/utilitarios/seguranca';

/**
 * ÚNICO ponto do código que lê `import.meta.env`.
 * Cada valor é validado aqui; o resto da aplicação só recebe dados confiáveis.
 * Valor ausente ou inválido vira `undefined`, e o canal correspondente simplesmente não aparece.
 */

const HOSTS_PERMITIDOS = {
  github: ['github.com'],
  linkedin: ['linkedin.com'],
  instagram: ['instagram.com'],
} as const;

function avisar(chave: string, motivo: string): void {
  if (import.meta.env.DEV) console.warn(`[ambiente] ${chave}: ${motivo}`);
}

function lerTexto(valor: string | undefined): string | undefined {
  const texto = valor?.trim();
  return texto ? texto : undefined;
}

function lerObrigatorio(chave: string, valor: string | undefined, reserva: string): string {
  const texto = lerTexto(valor);
  if (texto) return texto;
  avisar(chave, 'variável obrigatória ausente — usando valor reserva');
  return reserva;
}

function lerValidado(
  chave: string,
  valor: string | undefined,
  validar: (bruto: string) => string | undefined,
  regra: string,
): string | undefined {
  const texto = lerTexto(valor);
  if (!texto) return undefined;
  const validado = validar(texto);
  if (!validado) avisar(chave, `valor ignorado (${regra})`);
  return validado;
}

const env = import.meta.env;

export const ambiente = Object.freeze({
  nome: lerObrigatorio('VITE_NOME', env.VITE_NOME, 'Seu Nome'),
  cargo: lerObrigatorio('VITE_CARGO', env.VITE_CARGO, 'Seu cargo'),
  whatsapp: lerValidado('VITE_WHATSAPP', env.VITE_WHATSAPP, validarTelefone, 'use DDI + DDD + número'),
  mensagemWhatsapp: lerTexto(env.VITE_WHATSAPP_MENSAGEM),
  email: lerValidado('VITE_EMAIL', env.VITE_EMAIL, validarEmail, 'e-mail inválido'),
  github: lerValidado(
    'VITE_GITHUB',
    env.VITE_GITHUB,
    (url) => sanitizarUrl(url, HOSTS_PERMITIDOS.github),
    'use https://github.com/...',
  ),
  linkedin: lerValidado(
    'VITE_LINKEDIN',
    env.VITE_LINKEDIN,
    (url) => sanitizarUrl(url, HOSTS_PERMITIDOS.linkedin),
    'use https://www.linkedin.com/...',
  ),
  instagram: lerValidado(
    'VITE_INSTAGRAM',
    env.VITE_INSTAGRAM,
    (url) => sanitizarUrl(url, HOSTS_PERMITIDOS.instagram),
    'use https://www.instagram.com/...',
  ),
});
