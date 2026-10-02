# Portfólio · Edgard Felix

Portfólio pessoal com estética cyberpunk / Matrix, construído com React 19, TypeScript, Vite, React Router, styled-components e Framer Motion.

## Rodando localmente

Requisito: Node.js 22.12 ou superior.

```bash
npm install
cp .env.example .env   # preencha com seus dados
npm run dev            # http://localhost:5173
```

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Checagem de tipos + build de produção em `dist/` |
| `npm run preview` | Serve o build com os cabeçalhos de segurança de produção (http://localhost:4173) |
| `npm run lint` | Oxlint com regras de segurança, React e acessibilidade; falha em qualquer aviso |
| `npm test` | Testes unitários (Vitest) |
| `npm run verificar` | Lint + testes + build. Rode antes de publicar |

## Atualizando o conteúdo

| O quê | Onde |
|---|---|
| Nome, cargo, WhatsApp, e-mail e redes | `.env` (variável vazia = canal oculto) |
| Status, frase do hero e especialidades | `src/dados/perfil.ts` |
| Projetos | `src/dados/projetos.ts` |
| Capa de um projeto | `src/recursos/imagens/projetos/<id-do-projeto>.webp` |
| Animações Rive | arquivos `.riv` em `public/` + constantes no topo de `src/paginas/Inicio/Inicio.tsx` e `src/paginas/Contato/FotoPerfil.tsx` |
| Foto de perfil (reserva do avatar) | `src/recursos/imagens/perfil/foto.webp` |

**Novo projeto:** copie o objeto existente em `src/dados/projetos.ts` e ajuste os campos. A capa é opcional: sem imagem, o card gera uma arte única a partir do `id`. Os campos `camadas` e `decisoes` também são opcionais; quando existem, o card ganha o botão "Ver arquitetura".

## Segurança

- **`.env` não guarda segredos.** Toda variável `VITE_*` vai para o JavaScript público. O `.env` serve para tirar os dados do código e do Git, não para escondê-los.
- **Um único leitor do ambiente.** `src/configuracao/ambiente.ts` valida tudo (URLs `https` do domínio esperado, e-mail, telefone). Valor inválido é descartado e o canal não aparece.
- **Links blindados.** Todo link externo passa por `LinkExterno`, que só aceita `https:` (sem credenciais) e `mailto:` válido (sem injeção de cc/bcc) e abre com `rel="noopener noreferrer"`. Os testes em `src/utilitarios/seguranca.test.ts` cobrem `javascript:`, `data:`, domínios falsos e afins.
- **Lint como barreira.** `dangerouslySetInnerHTML`, `eval`, `new Function` e URLs `javascript:` quebram o lint.
- **CSP no build.** O `index.html` de produção recebe uma Content Security Policy estrita (`script-src 'self'`, `object-src 'none'`, `form-action 'none'`, `font-src 'self'`…). Concessões, todas justificadas no `vite.config.ts`:
  - `style-src 'unsafe-inline'`: exigida pelo styled-components em site estático;
  - `script-src 'wasm-unsafe-eval'`: libera só a compilação de WebAssembly do Rive (eval de JavaScript continua bloqueado);
  - `img-src blob:`: o Rive decodifica as imagens embutidas no `.riv` via `URL.createObjectURL`.
- **Cabeçalhos HTTP.** `npm run preview` aplica os que só funcionam como header (`frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`). Replique-os no servidor ao publicar; a lista está em `vite.config.ts`.
- **Sem terceiros.** A fonte (JetBrains Mono) e o WebAssembly do Rive são servidos pelo próprio site; o CDN de assets do Rive fica desligado (`enableRiveAssetCDN: false`).

## Animações Rive

As duas animações (`public/28579-54143-computer.riv` na Início e `public/5292-10543-boy-nodding.riv` no avatar do Contato) passam pelo componente `src/componentes/efeitos/AnimacaoRive.tsx`, que concentra o `useRive` de `@rive-app/react-webgl2`:

- **Dimensões:** o contêiner pai precisa de `position: relative` e dimensões explícitas (largura + `aspect-ratio`). O `RiveComponent` é renderizado **sem** `className`, para que ele mesmo aplique `width/height: 100%`; com uma classe, o contêiner do canvas colapsaria para 0 px.
- **Nitidez:** o canvas acompanha o contêiner × `devicePixelRatio` (2× em telas retina). A janela da Início usa a proporção exata do artboard (1440 × 929), então o `Fit.Contain` preenche tudo, sem faixas.
- **State machines:** `State Machine 1` (computador) e `点头` ("acenar com a cabeça", no avatar). Os nomes vêm do editor do Rive e precisam ser idênticos.
- **Carregamento:** o JS do Rive fica num chunk separado; o WebAssembly (~945 KB gzip) só é baixado quando a animação chega perto da tela, e nunca com o modo de economia de dados ligado ou sem WebGL2. Até carregar (ou se falhar), aparece a reserva, com crossfade para a animação.
- **Movimento reduzido:** com `prefers-reduced-motion`, o Rive desenha um quadro estático.
- **Avatar holográfico:** um filtro SVG tritom (fundo → verde → ciano) mantém o avatar dentro da paleta; o hover revela as cores originais. Para usar as cores originais sempre, mude `USAR_HOLOGRAMA` para `false` em `FotoPerfil.tsx`.
- **Licença:** confira no Rive Community a licença dos dois arquivos; muitos exigem atribuição (CC BY).

## Acessibilidade e desempenho

- Link "Pular para o conteúdo", foco visível, `aria-current` na rota ativa e foco levado ao conteúdo a cada troca de página.
- Menu móvel como diálogo: foco preso, `Esc` fecha, rolagem travada e gesto de arrastar para fechar.
- `prefers-reduced-motion` respeitado: animações viram transições de opacidade e a chuva Matrix vira um quadro estático.
- A chuva roda a ~30 fps e pausa com a aba oculta ou fora da tela.
- Páginas carregadas sob demanda e pré-carregadas por intenção (hover, foco ou toque) e com o navegador ocioso.

## Estrutura

```
src/
├── configuracao/   leitura e validação do .env
├── dados/          perfil, contatos e projetos (conteúdo editável)
├── estilos/        design system: tema, estilos globais, mídias, fragmentos, movimento
├── rotas/          caminhos e roteador (transições + carregamento sob demanda)
├── componentes/
│   ├── estrutura/  layout, barra de navegação, menu móvel, rodapé
│   ├── efeitos/    chuva Matrix (canvas), animações Rive, CRT, lens flare, glitch, digitação
│   └── comuns/     botão neon, link externo seguro, ícones, título de seção, etiqueta
├── paginas/        Início, Projetos, Contato e 404
├── ganchos/        hooks reutilizáveis
├── utilitarios/    segurança (com testes)
├── tipos/          tipos de domínio, do tema e das variáveis de ambiente
└── recursos/       imagens opcionais (capas de projetos e foto)
```
