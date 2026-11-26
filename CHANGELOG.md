# Changelog

Versões do site americaindustria.com.br. Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), versionamento semântico.

## [2.0.0] — 2026-11-25

### Adicionado
- Design system no site inteiro (home e catálogo): estrutura do "Institucional" com a paleta da marca
  (azul `#1c2f8f`, vermelho `#e03a3e`), títulos em Source Serif 4 e texto em Source Sans 3. [Story 2.1]
- Modo claro/escuro com botão no cabeçalho; padrão = preferência do aparelho. [Story 2.1]
- Otimização mobile (iOS/Android): alvos de toque ≥ 44 px, safe-area do iPhone, catálogo ajustado à largura e nítido em retina. [Story 2.1]
- PDF leve do catálogo (`catalogo-america-2026.pdf`, 9,7 MB, 74 páginas). [Story 0.1]
- Cabeçalhos de segurança: HSTS (1 semana, conservador), anti-iframe, `nosniff`, Referrer-Policy, Permissions-Policy.
- `CHANGELOG.md`.

### Alterado
- `www.americaindustria.com.br` redireciona (301) para `americaindustria.com.br`; canonical sem www.
- PDF antigo (48 MB) redireciona (301) para a versão leve. [Story 0.1]
- PDF.js carregado com SRI e `isEvalSupported: false` (CVE-2024-4367).
- O build não gera mais `squad-tasks.json` (`npm run build` = `vite build`).

### Corrigido
- Link do catálogo dava 404 (`/catalogo-2026`). [Story 0.1]
- Catálogo não carregava desde 04/02/2026 (botão de imprimir inexistente quebrava o script). [Story 0.1]
- Botão de telefone aparecendo no cabeçalho do celular; logo do rodapé virando retângulo branco;
  contador "15.000+" só aparecia ao rolar. [Story 2.1]

### Removido
- Botão flutuante "LIVE" (Squad Live), que levava a uma página 404. [Story 2.1]
- `.DS_Store` e `squad-tasks.json` expostos no servidor; arquivos ocultos agora retornam 403.

## [1.0.0] — 2026-02-04
- Site original: home, catálogo em PDF e contato por WhatsApp.
