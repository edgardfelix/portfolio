import type { AnchorHTMLAttributes, Ref } from 'react';
import styled from 'styled-components';
import { somenteLeitores } from '@/estilos/fragmentos';
import { sanitizarHref } from '@/utilitarios/seguranca';

type Propriedades = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'> & {
  href: string;
  ref?: Ref<HTMLAnchorElement>;
};

/**
 * Âncora externa segura:
 * - só renderiza https (sem credenciais) ou mailto válido; javascript:, data: e afins são descartados;
 * - links web abrem em nova aba com rel="noopener noreferrer" (sem acesso a window.opener, sem vazar referrer);
 * - avisa leitores de tela que o link abre em nova aba.
 */
export function LinkExterno({ href, children, ref, ...resto }: Propriedades) {
  const seguro = sanitizarHref(href);

  if (!seguro) {
    if (import.meta.env.DEV) console.warn(`[LinkExterno] href bloqueado: ${href}`);
    return null;
  }

  if (seguro.startsWith('mailto:')) {
    return (
      <a ref={ref} href={seguro} {...resto}>
        {children}
      </a>
    );
  }

  return (
    <a ref={ref} href={seguro} target="_blank" rel="noopener noreferrer" {...resto}>
      {children}
      <AvisoNovaAba> (abre em nova aba)</AvisoNovaAba>
    </a>
  );
}

const AvisoNovaAba = styled.span`
  ${somenteLeitores}
`;
