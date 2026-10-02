/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

/**
 * Content Security Policy.
 * - script-src 'self': nenhum script inline ou de terceiros executa.
 *   'wasm-unsafe-eval' libera SÓ a compilação de WebAssembly (runtime do Rive) — eval de
 *   JavaScript continua bloqueado.
 * - style-src 'unsafe-inline': exigido pelo styled-components, que injeta <style> em tempo de
 *   execução; num site estático não há servidor para gerar nonce por requisição.
 * - img-src blob:: o Rive decodifica as imagens embutidas no .riv via URL.createObjectURL.
 * - form-action 'none': o portfólio não tem formulários.
 */
const diretivasCsp: Record<string, readonly string[]> = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'wasm-unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'blob:'],
  'font-src': ["'self'"],
  'connect-src': ["'self'"],
  'object-src': ["'none'"],
  'frame-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'none'"],
};

function montarCsp(extras: Record<string, readonly string[]> = {}): string {
  return Object.entries({ ...diretivasCsp, ...extras })
    .map(([diretiva, valores]) => `${diretiva} ${valores.join(' ')}`)
    .join('; ');
}

/** Cabeçalhos de segurança. No `vite preview` eles simulam o que o servidor de produção deve enviar. */
const cabecalhosSeguranca: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
};

/**
 * Injeta a CSP como <meta> apenas no build: o servidor de desenvolvimento do Vite
 * depende de script inline para o hot reload. (frame-ancestors só funciona via header.)
 */
function injetarCsp(): Plugin {
  return {
    name: 'portfolio:injetar-csp',
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: montarCsp() },
        injectTo: 'head-prepend',
      },
    ],
  };
}

const VARIAVEIS_OBRIGATORIAS = ['VITE_NOME', 'VITE_CARGO'] as const;

/** Estas variáveis vão para o index.html via %VITE_...%, que não escapa HTML. */
const CARACTERES_PROIBIDOS_HTML = /[<>"`]/;

/** Falha o build (e avisa no dev) se faltar variável obrigatória ou se um valor puder quebrar o HTML. */
function verificarAmbiente(): Plugin {
  return {
    name: 'portfolio:verificar-ambiente',
    configResolved({ command, env, logger }) {
      const problemas = VARIAVEIS_OBRIGATORIAS.flatMap((chave) => {
        const valor = String(env[chave] ?? '').trim();
        if (!valor) return [`${chave} está vazia ou ausente no .env`];
        if (CARACTERES_PROIBIDOS_HTML.test(valor)) return [`${chave} contém caracteres proibidos (< > " \`)`];
        return [];
      });
      if (problemas.length === 0) return;

      const mensagem = `[ambiente] ${problemas.join('; ')}`;
      if (command === 'build') throw new Error(mensagem);
      logger.warn(mensagem);
    },
  };
}

export default defineConfig({
  plugins: [react(), verificarAmbiente(), injetarCsp()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    // Fontes nunca viram data: URI — assim a CSP mantém font-src 'self' sem exceções.
    assetsInlineLimit: (arquivo) => (/\.(woff2?|ttf|otf)$/.test(arquivo) ? false : undefined),
  },
  server: {
    headers: cabecalhosSeguranca,
  },
  preview: {
    headers: {
      ...cabecalhosSeguranca,
      'Content-Security-Policy': montarCsp({ 'frame-ancestors': ["'none'"] }),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
