# AIOS Workflow Guide - América Recondicionadora

**Last Updated**: February 2, 2026

## Como Trabalhar com AIOS neste Projeto

O AIOS (AI-Orchestrated System) coordena todo o desenvolvimento usando agentes especializados. Você ativa agentes com `@nome-do-agente` para começar a trabalhar.

## Agentes Disponíveis

### @pm (Project Manager)
**Função**: Gerenciar timeline, escopo, stories
- `*create-story` - Criar nova story de desenvolvimento
- `*list-stories` - Ver todas as stories
- `*update-story-status` - Atualizar progresso
- Melhor para: Planejamento, organização, priorização

### @architect (Solution Architect)
**Função**: Validar decisões técnicas, design de sistema
- `*review-architecture` - Revisar decisões arquiteturais
- `*validate-implementation` - Validar implementação contra spec
- Melhor para: Problemas de design, decisões técnicas, refatoração

### @dev (Developer)
**Função**: Implementar features, escrever código
- `*develop-story` - Trabalhar numa story de desenvolvimento
- `*suggest-refactoring` - Sugerir melhorias de código
- Melhor para: Codificação, implementação, testes

### @qa (Quality Assurance)
**Função**: Testes, validação, qualidade
- `*test-feature` - Testar feature específica
- `*apply-qa-fixes` - Aplicar correções encontradas
- Melhor para: Testes, validação, garantia de qualidade

### @po (Product Owner)
**Função**: Validar requisitos, feedback do cliente
- `*validate-requirements` - Validar contra PRD
- `*client-feedback` - Compilar feedback
- Melhor para: Validação com cliente, requisitos

### @analyst (Data Analyst)
**Função**: Análise de performance, dados
- `*analyze-performance` - Analisar Lighthouse, velocidade
- `*facilitate-brainstorming` - Brainstorm de features
- Melhor para: Performance, análise, otimização

### @sm (Scrum Master)
**Função**: Coordenação, remoção de bloqueios
- `*track-progress` - Rastrear andamento
- `*unblock-team` - Resolver impedimentos
- Melhor para: Coordenação, acompanhamento

### @aios-master (Master Coordinator)
**Função**: Visão geral, coordenação central
- `*help` - Ver todos os comandos disponíveis
- `*status` - Status geral do projeto
- Melhor para: Questões que envolvem múltiplos agentes

## Workflow Típico

### Dia 1: Inicialização

```
Você: @aios-master
AIOS: [Mostra status geral, próximas steps]

Você: @pm
AIOS: Ativo como Project Manager
PM: Vamos começar? Recomendo:
    1. Setup do ambiente (Story 1)
    2. Homepage (Story 2)
    3. Catálogo (Story 3)

Você: *create-story "Setup e Foundation"
PM: [Cria Story 1 com checklist de tarefas]
```

### Desenvolvendo uma Feature

```
Você: @dev
DEV: Ativo como Developer

Você: *develop-story 1
DEV: [Lê Story 1, mostra tasks]

Você: Configura npm e Vite
DEV: [Acompanha progresso, sugere práticas]

Você: Terminou Setup? Marca a story como completa
DEV: *validate-completion
```

### Validando Qualidade

```
Você: @qa
QA: Ativo como QA Engineer

Você: *test-feature "homepage"
QA: [Testa responsividade, performance, acessibilidade]
QA: Encontrados 3 problemas:
    1. Hero image > 500KB
    2. Falta label no botão WhatsApp
    3. Lighthouse Performance 82

Você: @dev *apply-qa-fixes
DEV: [Resolve issues encontrados]
```

## Stories Planejadas

Você já tem 5 stories para trabalhar:

### Story 1: Setup & Foundation
- [ ] Inicializar projeto Node.js + npm
- [ ] Configurar Vite + Tailwind CSS
- [ ] Setup de ESLint e Prettier
- [ ] Criar estrutura de pastas
- [ ] Setup de Git + deployment
- **Tempo**: Primeira coisa a fazer

### Story 2: Homepage Design
- [ ] Criar seção hero com animações
- [ ] Seção "Sobre Empresa"
- [ ] Produtos em destaque
- [ ] Seção de contato com CTA
- [ ] Footer
- **Tempo**: Depois do setup

### Story 3: Catálogo System
- [ ] Estrutura JSON de produtos
- [ ] Grid responsivo de produtos
- [ ] Busca por nome/descrição
- [ ] Filtro por categoria
- [ ] Integração PDF (auto-open)
- **Tempo**: Paralelo à Story 2

### Story 4: Polish & Integration
- [ ] Botões WhatsApp (header + home)
- [ ] Navegação com sticky header
- [ ] Animações scroll
- [ ] Dark mode (opcional)
- [ ] Refinements visuais
- **Tempo**: Depois de 2 e 3

### Story 5: Testing & Deploy
- [ ] Testes Lighthouse
- [ ] Mobile testing
- [ ] Cross-browser testing
- [ ] Build & deploy Hostinger
- [ ] Post-deploy verification
- **Tempo**: Final

## Como Começar Agora

### Opção 1: Deixar AIOS Guiar (Recomendado)

```
Você: @pm
PM: Ativo. O que você quer fazer primeiro?

Você: Comece do zero
PM: [Cria Story 1 com tarefas]
PM: Recomendo começar com setup. Quer que eu ative o @dev?

Você: Sim, ativa @dev
DEV: Pronto! Vamos fazer o setup?
```

### Opção 2: Direcionar Você Mesmo

```
Você: @dev
DEV: Ativo. O que precisa?

Você: Cria vite.config.js
DEV: [Cria o arquivo, mostra configuração]

Você: Agora instala dependências
DEV: npm install
[Aguarda resultado]

Você: Pronto!
DEV: Excelente! Próximo passo?
```

## Dicas para Usar AIOS Efetivamente

### 1. Contexto é Importante
- Diga ao agente qual story está trabalhando
- Compartilhe o que já foi feito
- Mencione limitações ou preferências

```
BOM: @dev "Estou na Story 1, já tenho package.json, preciso de vite.config.js"
RUIM: @dev "faz um vite.config.js"
```

### 2. Use Stories para Rastrear
- Cada feature é uma story
- Marque checkboxes conforme avança
- Stories mantêm contexto entre sessões

### 3. Peça Validação
- Quando terminar, peça `*validate-completion` ao @qa
- Peça `*review` ao @architect para decisões grandes
- Peça feedback ao @po sobre requisitos

### 4. Bloquear Quando Necessário
- Se não sabe algo, pergunte ao agente
- Se travou, ativa @sm para desbloquear
- Se é decisão arquitetural, ativa @architect

## Estrutura de uma Story

Cada story tem:

```markdown
# Story 1: Setup & Foundation

**Status**: Pending / In Progress / Completed
**Assignee**: @dev / @qa / etc.
**Priority**: High / Medium / Low

## Description
O que precisa ser feito (por quê, para quem, como validar)

## Acceptance Criteria
- [ ] Tarefa 1
- [ ] Tarefa 2
- [ ] Tarefa 3

## File List
Arquivos criados/modificados:
- src/
  - index.html
  - styles/globals.css
  - scripts/main.js
- vite.config.js
- package.json

## Notes
Qualquer contexto adicional importante
```

## Exemplo: Trabalhando com Seu PDF

Quando tiver o PDF do catálogo, a story de catálogo ficará assim:

```markdown
# Story 3: Catálogo System

## Files Provided by Client
- Cliente forneceu: `catalog.pdf` (produto catálogo)

## Implementation Plan
1. Criar `src/assets/catalog.json` com estrutura:
   - id, name, category, image, description, specs
2. Parser PDF → JSON (manual ou automático)
3. Create `src/scripts/catalog.js` com search/filter
4. Render grid responsivo
5. Auto-open PDF na página

## When PDF is Ready
1. Você: Coloca arquivo em `src/assets/catalog.pdf`
2. Você: Comunica ao @dev
3. @dev: Integra a funcionalidade
```

## Próximo Passo

Você está pronto para começar! Escolha:

```
OPÇÃO A: "Deixe AIOS começar"
Você: @aios-master

OPÇÃO B: "Eu dirijo, AIOS ajuda"
Você: @dev
DEV: Ativo! O que quer fazer primeiro?
Você: Setup do projeto (npm + vite + tailwind)
```

---

## Resumo: Trabalhar com AIOS significa...

✅ **Cada agent tem expertise**
- Não precisa fazer tudo você
- Agentes sabem melhores práticas
- Validam seu trabalho

✅ **Stories = contexto persistente**
- Não perde progress entre sessões
- Fácil retomar trabalho
- Histórico de decisões

✅ **Coordenação automática**
- AIOS sabe qual agente usar
- Respeita dependências entre tasks
- Evita retrabalho

✅ **Qualidade garantida**
- @qa valida tudo
- @architect revisa decisões
- @po valida requisitos

---

**Pronto para começar? Digite em seguida:**

```
@aios-master
```

**Ou vá direto ao agente que quer:**

```
@dev      (para codificar)
@pm       (para planejar)
@architect (para decisões técnicas)
```

---

*Synkra AIOS - AI-Orchestrated Development System*
