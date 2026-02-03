# Source Tree - América Recondicionadora

**Version**: 1.0
**Status**: Active
**Last Updated**: February 2, 2026

## Complete Directory Structure

```
america-site/                              # Project root
│
├── src/                                    # Source code
│   ├── index.html                         # Main HTML entry point
│   │   ├── <head>: Meta tags, styles
│   │   ├── <header>: Navigation
│   │   ├── <main id="app">: Page content
│   │   └── <footer>: Footer
│   │
│   ├── styles/
│   │   └── globals.css                    # Global styles + Tailwind directives
│   │       ├── @tailwind base
│   │       ├── @tailwind components
│   │       ├── @tailwind utilities
│   │       ├── Custom animations
│   │       └── Theme variables
│   │
│   ├── scripts/
│   │   ├── main.js                        # App initialization & routing
│   │   │   ├── initApp()                  # Initialize on load
│   │   │   ├── switchPage(page)           # Switch between pages
│   │   │   ├── setupEventListeners()      # Global events
│   │   │   └── appState = {}              # Global app state
│   │   │
│   │   ├── catalog.js                     # Catalog functionality
│   │   │   ├── loadCatalog()              # Load catalog.json
│   │   │   ├── searchProducts(query)      # Search by name/desc
│   │   │   ├── filterByCategory(cat)      # Filter by category
│   │   │   ├── renderCatalog()            # Render product grid
│   │   │   ├── setupSearchListener()      # Search input handler
│   │   │   └── setupFilterListener()      # Filter selector handler
│   │   │
│   │   ├── contact.js                     # Contact/WhatsApp integration
│   │   │   ├── initWhatsApp()             # Setup WhatsApp buttons
│   │   │   ├── generateWAUrl(msg)         # Generate WhatsApp URL
│   │   │   └── openWhatsApp(msg)          # Open WhatsApp link
│   │   │
│   │   └── animations.js                  # Scroll & page animations
│   │       ├── initScrollAnimations()     # Setup Intersection Observer
│   │       ├── animateOnScroll()          # Scroll event handler
│   │       ├── animatePageTransition()    # Page switching animation
│   │       └── setupHoverAnimations()     # Hover state handlers
│   │
│   └── assets/
│       ├── images/
│       │   ├── logo-america.png           # Company logo
│       │   ├── logo-america.webp          # Optimized version
│       │   ├── hero-section.jpg           # Hero background
│       │   ├── hero-section.webp          # Optimized
│       │   └── products/
│       │       ├── product-1.jpg          # Product images
│       │       ├── product-1.webp         # WebP optimized
│       │       ├── product-2.jpg
│       │       └── ...
│       │
│       ├── catalog.json                   # Product data (generated from PDF)
│       │   └── {
│       │       "products": [
│       │         {
│       │           "id": 1,
│       │           "name": "Induzido",
│       │           "category": "Induzidos",
│       │           "image": "products/product-1.jpg",
│       │           "description": "...",
│       │           "specifications": "..."
│       │         }
│       │       ]
│       │     }
│       │
│       └── catalog.pdf                    # Product catalog PDF
│           └── (Client provided, ~5MB max)
│
├── docs/                                   # Project documentation
│   ├── prd/
│   │   └── prd-main.md                    # Product requirements
│   │
│   ├── architecture/
│   │   └── architecture.md                # Technical architecture
│   │
│   ├── framework/
│   │   ├── coding-standards.md            # Code guidelines
│   │   ├── tech-stack.md                  # Technology stack
│   │   └── source-tree.md                 # This file
│   │
│   └── stories/                           # Development stories
│       ├── story-1-setup.md               # Project setup
│       ├── story-2-homepage.md            # Homepage design
│       ├── story-3-catalog.md             # Catalog system
│       ├── story-4-polish.md              # Contact & animations
│       └── story-5-deploy.md              # Testing & deployment
│
├── .aios-core/                            # AIOS framework (DO NOT EDIT)
│   ├── core/                              # Core AIOS functionality
│   ├── cli/                               # CLI tools
│   ├── development/                       # Development tasks & agents
│   ├── infrastructure/                    # Infrastructure scripts
│   ├── data/                              # Framework data
│   ├── elicitation/                       # User input prompts
│   ├── scripts/                           # Utility scripts
│   └── ...                                # Other AIOS files
│
├── .claude/                               # Claude Code configuration
│   ├── CLAUDE.md                          # Claude Code guidance (THIS FILE)
│   ├── config.json                        # Claude Code config
│   ├── settings.json                      # Settings
│   ├── commands/                          # Custom commands
│   └── rules/                             # Custom rules
│
├── .git/                                  # Git repository
│   └── ...
│
├── node_modules/                          # Installed dependencies (gitignored)
│   └── vite/, tailwindcss, eslint, prettier, etc.
│
├── dist/                                  # Build output (gitignored)
│   ├── index.html                         # Minified HTML
│   ├── assets/
│   │   ├── main-[hash].js                 # Bundled JavaScript
│   │   ├── style-[hash].css               # Bundled CSS
│   │   ├── images/                        # Optimized images
│   │   └── catalog.json                   # Product data
│   └── catalog.pdf                        # PDF copy
│
├── vite.config.js                         # Vite configuration
├── tailwind.config.js                     # Tailwind CSS configuration
├── postcss.config.js                      # PostCSS configuration
├── eslintrc.json                          # ESLint rules
├── .prettierrc                            # Prettier formatting
├── .prettierignore                        # Files to skip formatting
├── .gitignore                             # Git ignore rules
├── package.json                           # Dependencies & scripts
├── package-lock.json                      # Lock file for dependencies
│
├── .env.example                           # Environment variables template
├── .aios-pm-config.yaml                   # AIOS Project Manager config
└── README.md                              # Project README (to be created)
```

---

## Key File Descriptions

### HTML (`src/index.html`)

**Purpose**: Single HTML entry point for the entire application

**Structure**:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <!-- Meta tags, favicon, stylesheets -->
  <link rel="stylesheet" href="styles/globals.css">
</head>
<body>
  <header>
    <!-- Navigation, logo, WhatsApp button -->
  </header>

  <main id="app">
    <!-- Page content rendered here -->
    <div id="home"><!-- Homepage content --></div>
    <div id="catalog" style="display:none;"><!-- Catalog content --></div>
  </main>

  <footer>
    <!-- Footer content -->
  </footer>

  <!-- Scripts loaded at end -->
  <script type="module" src="scripts/main.js"></script>
</body>
</html>
```

**Key Elements**:
- Meta tags for SEO, OG, Twitter
- Semantic HTML5 elements
- Single `<main id="app">` for page content
- Type="module" for ES6 modules
- No inline styles (use CSS)
- No inline scripts (use external files)

---

### CSS (`src/styles/globals.css`)

**Purpose**: Global styles using Tailwind CSS

**Contents**:
```css
/* Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom animations */
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Theme variables */
:root {
  --color-primary: #1c2f8f;
  --color-accent: #e03a3e;
  --color-dark: #111827;
}

/* Component classes */
.card { @apply bg-white rounded-lg shadow p-6; }
.btn-primary { @apply px-4 py-2 bg-america-blue text-white rounded; }
```

**Key Points**:
- No global resets (Tailwind handles it)
- Minimal custom CSS (prefer Tailwind utilities)
- Custom animations only if Tailwind doesn't cover
- Component classes for frequently used combos
- No color definitions (use Tailwind theme)

---

### Main Script (`src/scripts/main.js`)

**Purpose**: Application initialization and router

**Key Functions**:
```javascript
// Initialize app on page load
function initApp() {
  setupEventListeners();
  loadCatalog();
  renderPage('home');
}

// Switch between pages
function switchPage(page) {
  if (page === 'home') renderHome();
  if (page === 'catalog') renderCatalog();
}

// Manage global state
const appState = {
  currentPage: 'home',
  catalog: [],
  searchQuery: '',
  selectedFilters: {}
};
```

**Execution Order**:
1. DOM loaded
2. `main.js` executes
3. `initApp()` called
4. Event listeners attached
5. Initial page rendered
6. Other scripts loaded

---

### Catalog Script (`src/scripts/catalog.js`)

**Purpose**: Product catalog functionality

**Key Functions**:
```javascript
// Load product data
async function loadCatalog() {
  const response = await fetch('assets/catalog.json');
  appState.catalog = await response.json();
}

// Search products
function searchProducts(query) {
  return appState.catalog.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
}

// Render product grid
function renderCatalog() {
  const products = appState.filteredCatalog || appState.catalog;
  const grid = document.querySelector('[data-page="catalog"] .grid');
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
    </div>
  `).join('');
}
```

**Data Source**:
- `src/assets/catalog.json` - Product data
- Each product has: id, name, category, image, description, specifications

---

### Contact Script (`src/scripts/contact.js`)

**Purpose**: WhatsApp integration

**Key Functions**:
```javascript
// Setup WhatsApp buttons
function initWhatsApp() {
  const buttons = document.querySelectorAll('[data-action="whatsapp"]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => openWhatsApp());
  });
}

// Generate WhatsApp URL
function generateWAUrl(message) {
  const phone = '[CLIENT_PHONE_NUMBER]'; // To be replaced
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

// Open WhatsApp
function openWhatsApp() {
  const message = 'Olá! Gostaria de informações sobre o catálogo.';
  window.open(generateWAUrl(message));
}
```

**Configuration**:
- Phone number: Replace `[CLIENT_PHONE_NUMBER]` with actual number
- Message: Customize default message

---

### Animations Script (`src/scripts/animations.js`)

**Purpose**: Scroll animations and page transitions

**Key Functions**:
```javascript
// Setup scroll animations
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-slide-in-up');
      }
    });
  });

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

// Page transition animation
function animatePageTransition() {
  const main = document.querySelector('main');
  main.style.opacity = '0';
  setTimeout(() => {
    main.style.opacity = '1';
  }, 300);
}
```

**Animation Triggers**:
- Use `data-animate` attribute on elements
- Scroll-triggered fade-in effects
- Page transition fade effect

---

### Configuration Files

#### `vite.config.js`
```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    hmr: true
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    outDir: 'dist'
  }
})
```

#### `tailwind.config.js`
```javascript
export default {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        'america-blue': '#1c2f8f',
        'america-red': '#e03a3e',
        'america-dark': '#111827'
      }
    }
  }
}
```

#### `postcss.config.js`
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

#### `package.json`
```json
{
  "name": "america-site",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

#### `.gitignore`
```
node_modules/
dist/
.env.local
.DS_Store
.vscode/
.idea/
*.log
```

---

## Asset Management

### Images

**Location**: `src/assets/images/`

**Types**:
- **Logo**: `logo-america.png` + `logo-america.webp`
- **Hero**: `hero-section.jpg` + `hero-section.webp`
- **Products**: `products/product-1.jpg`, `products/product-1.webp`, etc.

**Optimization**:
- PNG for logos/graphics (transparency)
- JPG for photos (smaller file)
- WebP for both (modern optimization)
- Max size: 200KB for JPG, 100KB for WebP
- Dimensions: Use CSS for responsive sizing

**Usage**:
```html
<!-- Responsive image -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>

<!-- Simple image -->
<img src="images/logo-america.png" alt="América Logo" class="w-48">
```

---

### Product Data (`catalog.json`)

**Location**: `src/assets/catalog.json`

**Structure**:
```json
{
  "products": [
    {
      "id": 1,
      "name": "Induzido para Motor de Partida",
      "category": "Induzidos",
      "image": "products/induzido-1.jpg",
      "description": "Induzido de alta qualidade para motores de partida...",
      "specifications": "Voltagem: 12V, Aplicação: Veículos nacionais",
      "pricing": "Contate-nos para orçamento"
    },
    {
      "id": 2,
      "name": "Estator",
      "category": "Estatores",
      "image": "products/estator-1.jpg",
      "description": "Estator robusto para motores automotivos...",
      "specifications": "Ampérios: 100A, Compatível com múltiplos modelos",
      "pricing": "Contate-nos para orçamento"
    }
  ]
}
```

**Fields**:
- `id` - Unique product ID
- `name` - Product name (Portuguese)
- `category` - Category for filtering (Induzidos, Estatores, Rotores, Bobinas, Automáticos)
- `image` - Path to product image
- `description` - Product description
- `specifications` - Technical specs
- `pricing` - Price or "Contact for pricing"

---

### PDF Catalog (`catalog.pdf`)

**Location**: `src/assets/catalog.pdf`

**Usage**:
- Provided by client
- Auto-opens on catalog page load
- User can download/print from PDF viewer
- Size: < 5MB recommended

**Integration**:
```html
<!-- PDF viewer embedded -->
<iframe
  src="assets/catalog.pdf"
  type="application/pdf"
  width="100%"
  height="600"
  title="Catálogo de Produtos"
></iframe>

<!-- Or via PDF.js for more control -->
<div id="pdf-viewer"></div>
<script src="pdf.js"></script>
```

---

## Build Output (`dist/`)

**Not committed to git** (see `.gitignore`)

**After `npm run build`**:
```
dist/
├── index.html              # Minified (~30KB)
├── assets/
│   ├── main-abc123.js      # Bundled JS (hashed)
│   ├── style-def456.css    # Bundled CSS (hashed)
│   ├── images/             # Optimized images
│   ├── catalog.json        # Product data
│   └── catalog.pdf         # PDF catalog
└── (optional .htaccess, robots.txt, etc.)
```

**File Size Targets**:
- index.html: 30-50KB
- JS bundle: 30-50KB gzipped
- CSS bundle: 15-30KB gzipped
- Total: < 100KB gzipped

---

## File Organization Principles

### `src/` Organization
- **Flat structure**: No deep nesting
- **By type**: scripts, styles, assets folders
- **Asset naming**: Full paths (products/product-1.jpg)

### `docs/` Organization
- **By concern**: prd, architecture, framework, stories
- **Sharded docs**: One file per major section
- **Version controlled**: All documentation in git

### `.aios-core/` Organization
- **Framework files**: Do NOT modify
- **Read-only**: For reference and context
- **Respect boundaries**: Don't edit agent definitions

---

## File Size & Performance

### Target Bundle Sizes
```
Initial Load:
├── HTML: 30-50KB
├── CSS (gzipped): 15-30KB
├── JS (gzipped): 30-50KB
└── Images: Optimized per asset (< 200KB total for hero)

Lighthouse Targets:
├── Performance: 90+
├── Accessibility: 95+
├── Best Practices: 90+
└── SEO: 95+
```

---

**Owner**: Architect
**Last Review**: February 2, 2026
**Next Review**: Post-MVP Launch
