import { describe, expect, it } from 'vitest';
import {
  criarLinkEmail,
  criarLinkWhatsApp,
  formatarTelefone,
  sanitizarHref,
  sanitizarUrl,
  validarEmail,
  validarTelefone,
} from './seguranca';

describe('sanitizarUrl', () => {
  it('aceita https e normaliza espaços nas pontas', () => {
    expect(sanitizarUrl('  https://github.com/edgardfelix  ')).toBe('https://github.com/edgardfelix');
  });

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'java\tscript:alert(1)',
    'java\nscript:alert(1)',
    '\u0000javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'http://github.com/edgardfelix',
    '//github.com/edgardfelix',
    '/projetos',
    'https://usuario:senha@github.com',
    '',
    '   ',
  ])('rejeita %j', (url) => {
    expect(sanitizarUrl(url)).toBeUndefined();
  });

  it('rejeita valores que não são texto', () => {
    expect(sanitizarUrl(42)).toBeUndefined();
    expect(sanitizarUrl(null)).toBeUndefined();
    expect(sanitizarUrl({ href: 'https://github.com' })).toBeUndefined();
  });

  it('respeita a lista de domínios permitidos', () => {
    const github = ['github.com'];
    expect(sanitizarUrl('https://github.com/edgardfelix', github)).toBeDefined();
    expect(sanitizarUrl('https://gist.github.com/edgardfelix', github)).toBeDefined();
    expect(sanitizarUrl('https://github.com.site-falso.com/x', github)).toBeUndefined();
    expect(sanitizarUrl('https://falsogithub.com/x', github)).toBeUndefined();
    expect(sanitizarUrl('https://site-falso.com/github.com', github)).toBeUndefined();
  });
});

describe('sanitizarHref', () => {
  it('aceita https e mailto válidos', () => {
    expect(sanitizarHref('https://www.linkedin.com/in/edgard-felix')).toBe('https://www.linkedin.com/in/edgard-felix');
    expect(sanitizarHref('mailto:edgard@email.com')).toBe('mailto:edgard@email.com');
    expect(sanitizarHref('mailto:edgard@email.com?subject=Ol%C3%A1')).toBe('mailto:edgard@email.com?subject=Ol%C3%A1');
  });

  it('bloqueia injeção de cabeçalhos no mailto', () => {
    expect(sanitizarHref('mailto:edgard@email.com?bcc=espiao@email.com')).toBeUndefined();
    expect(sanitizarHref('mailto:edgard@email.com?subject=oi&cc=espiao@email.com')).toBeUndefined();
    expect(sanitizarHref('mailto:edgard@email.com,espiao@email.com')).toBeUndefined();
    expect(sanitizarHref('mailto:%E0%A4%A')).toBeUndefined();
  });

  it('bloqueia esquemas perigosos', () => {
    expect(sanitizarHref('javascript:alert(document.cookie)')).toBeUndefined();
    expect(sanitizarHref(' JAVASCRIPT:alert(1)')).toBeUndefined();
    expect(sanitizarHref('data:text/html;base64,PHNjcmlwdD4=')).toBeUndefined();
  });
});

describe('validarEmail', () => {
  it('aceita e-mails comuns', () => {
    expect(validarEmail('edgard.oficiallink05@gmail.com')).toBe('edgard.oficiallink05@gmail.com');
    expect(validarEmail('nome+tag@empresa.com.br')).toBe('nome+tag@empresa.com.br');
  });

  it.each(['sem-arroba.com', 'a@b', 'a@b.c', 'a b@c.com', 'a@b.com?cc=x', '<a@b.com>'])('rejeita %j', (email) => {
    expect(validarEmail(email)).toBeUndefined();
  });
});

describe('WhatsApp e telefone', () => {
  it('normaliza o número e gera o link wa.me', () => {
    expect(validarTelefone('+55 (11) 97983-0653')).toBe('5511979830653');
    expect(criarLinkWhatsApp('+55 (11) 97983-0653')).toBe('https://wa.me/5511979830653');
  });

  it('codifica a mensagem com segurança', () => {
    expect(criarLinkWhatsApp('5511979830653', 'Olá & <tchau>')).toBe(
      'https://wa.me/5511979830653?text=Ol%C3%A1%20%26%20%3Ctchau%3E',
    );
  });

  it('rejeita números curtos ou longos demais', () => {
    expect(criarLinkWhatsApp('12345')).toBeUndefined();
    expect(criarLinkWhatsApp('1234567890123456')).toBeUndefined();
  });

  it('formata números brasileiros', () => {
    expect(formatarTelefone('5511979830653')).toBe('+55 (11) 97983-0653');
    expect(formatarTelefone('551133334444')).toBe('+55 (11) 3333-4444');
    expect(formatarTelefone('14155550100')).toBe('+14155550100');
  });
});

describe('criarLinkEmail', () => {
  it('gera mailto com assunto codificado', () => {
    expect(criarLinkEmail('edgard@email.com', 'Proposta & conversa')).toBe(
      'mailto:edgard@email.com?subject=Proposta%20%26%20conversa',
    );
  });

  it('recusa e-mail inválido', () => {
    expect(criarLinkEmail('javascript:alert(1)')).toBeUndefined();
  });
});
