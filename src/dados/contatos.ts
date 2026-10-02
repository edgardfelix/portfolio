import { ambiente } from '@/configuracao/ambiente';
import type { CanalContato, IdCanal } from '@/tipos/dominio';
import { criarLinkEmail, criarLinkWhatsApp, formatarTelefone } from '@/utilitarios/seguranca';

/**
 * Forma curta do perfil — o rótulo ao lado já diz qual é a rede:
 * github.com/edgardfelix → "@edgardfelix" · linkedin.com/in/edgard-felix → "in/edgard-felix"
 */
function exibirPerfil(id: IdCanal, url: string): string {
  const { hostname, pathname } = new URL(url);
  const caminho = pathname.replace(/^\/+|\/+$/g, '');
  if (!caminho) return hostname.replace(/^www\./, '');
  if (id === 'github' || id === 'instagram') return `@${caminho.split('/')[0] ?? caminho}`;
  return caminho;
}

function canalWeb(id: IdCanal, rotulo: string, url: string | undefined): CanalContato | undefined {
  return url ? { id, rotulo, exibicao: exibirPerfil(id, url), href: url } : undefined;
}

function canalEmail(): CanalContato | undefined {
  const href = ambiente.email && criarLinkEmail(ambiente.email, `Contato pelo portfólio — ${ambiente.nome}`);
  return ambiente.email && href ? { id: 'email', rotulo: 'E-mail', exibicao: ambiente.email, href } : undefined;
}

function canalWhatsApp(): CanalContato | undefined {
  if (!ambiente.whatsapp) return undefined;
  const href = criarLinkWhatsApp(ambiente.whatsapp, ambiente.mensagemWhatsapp);
  return href ? { id: 'whatsapp', rotulo: 'WhatsApp', exibicao: formatarTelefone(ambiente.whatsapp), href } : undefined;
}

/** Canal principal (botão de destaque na página de contato). */
export const whatsapp = canalWhatsApp();

/** Demais canais, na ordem em que aparecem. Variável ausente no .env = canal oculto. */
export const redes: readonly CanalContato[] = [
  canalWeb('linkedin', 'LinkedIn', ambiente.linkedin),
  canalWeb('github', 'GitHub', ambiente.github),
  canalEmail(),
  canalWeb('instagram', 'Instagram', ambiente.instagram),
].filter((canal): canal is CanalContato => canal !== undefined);
