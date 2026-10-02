/**
 * Tudo que vira `href` passa por aqui.
 * Regra: só https (sem credenciais embutidas) ou mailto com e-mail válido.
 * Qualquer outra coisa — javascript:, data:, vbscript:, http:, caminhos relativos — é rejeitada.
 */

const PADRAO_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const PARAMETROS_MAILTO_PERMITIDOS = new Set(['subject', 'body']);

function correspondeHost(host: string, permitidos: readonly string[]): boolean {
  const alvo = host.toLowerCase();
  return permitidos.some((base) => alvo === base || alvo.endsWith(`.${base}`));
}

/** URL externa segura: https, sem usuário/senha e, se informado, de um dos domínios permitidos. */
export function sanitizarUrl(valor: unknown, hostsPermitidos?: readonly string[]): string | undefined {
  if (typeof valor !== 'string') return undefined;
  const bruto = valor.trim();
  if (!bruto) return undefined;

  let url: URL;
  try {
    url = new URL(bruto);
  } catch {
    return undefined;
  }

  if (url.protocol !== 'https:' || url.username || url.password) return undefined;
  if (hostsPermitidos && !correspondeHost(url.hostname, hostsPermitidos)) return undefined;
  return url.href;
}

export function validarEmail(valor: unknown): string | undefined {
  if (typeof valor !== 'string') return undefined;
  const email = valor.trim();
  return email.length <= 254 && PADRAO_EMAIL.test(email) ? email : undefined;
}

export const apenasDigitos = (valor: string): string => valor.replace(/\D/g, '');

/** Número completo (DDI + DDD + número): de 10 a 15 dígitos, como no padrão E.164. */
export function validarTelefone(valor: unknown): string | undefined {
  if (typeof valor !== 'string') return undefined;
  const digitos = apenasDigitos(valor);
  return digitos.length >= 10 && digitos.length <= 15 ? digitos : undefined;
}

export function criarLinkEmail(email: string, assunto?: string): string | undefined {
  const valido = validarEmail(email);
  if (!valido) return undefined;
  return assunto ? `mailto:${valido}?subject=${encodeURIComponent(assunto)}` : `mailto:${valido}`;
}

export function criarLinkWhatsApp(numero: string, mensagem?: string): string | undefined {
  const digitos = validarTelefone(numero);
  if (!digitos) return undefined;
  const texto = mensagem?.trim();
  return texto ? `https://wa.me/${digitos}?text=${encodeURIComponent(texto)}` : `https://wa.me/${digitos}`;
}

/** 5511979830653 → "+55 (11) 97983-0653". Números de outros países ficam como "+<dígitos>". */
export function formatarTelefone(numero: string): string {
  const digitos = apenasDigitos(numero);
  const brasil = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(digitos);
  if (!brasil) return `+${digitos}`;
  const [, ddd, prefixo, sufixo] = brasil;
  return `+55 (${ddd}) ${prefixo}-${sufixo}`;
}

/** mailto só com destinatário válido e, no máximo, assunto e corpo — bloqueia injeção de cc/bcc. */
function sanitizarMailto(bruto: string): string | undefined {
  const corpo = bruto.slice('mailto:'.length);
  const separador = corpo.indexOf('?');
  const destinatario = separador === -1 ? corpo : corpo.slice(0, separador);
  const consulta = separador === -1 ? '' : corpo.slice(separador + 1);

  let email: string | undefined;
  try {
    email = validarEmail(decodeURIComponent(destinatario));
  } catch {
    return undefined;
  }
  if (!email) return undefined;

  for (const chave of new URLSearchParams(consulta).keys()) {
    if (!PARAMETROS_MAILTO_PERMITIDOS.has(chave.toLowerCase())) return undefined;
  }
  return consulta ? `mailto:${email}?${consulta}` : `mailto:${email}`;
}

/** Última barreira antes de um href externo. */
export function sanitizarHref(valor: unknown): string | undefined {
  if (typeof valor !== 'string') return undefined;
  const bruto = valor.trim();
  return /^mailto:/i.test(bruto) ? sanitizarMailto(bruto) : sanitizarUrl(bruto);
}
