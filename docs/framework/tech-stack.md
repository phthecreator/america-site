# Technology Stack - América Recondicionadora

**Version**: 1.0
**Status**: Active
**Last Updated**: February 2, 2026

## Core Technologies

### Frontend

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **HTML5** | Latest | Semantic markup | No build needed |
| **Vanilla JavaScript (ES6+)** | Latest | App logic | No framework |
| **Tailwind CSS** | v3.x | Styling | Utility-first |
| **Vite** | v5.x | Build tool | Dev server + bundler |

### Build & Package Management

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 18+ LTS | Runtime |
| **npm** | 9+ | Package manager |
| **Vite** | v5.x | Build tool, dev server |

### CSS Framework

| Package | Version | Purpose |
|---------|---------|---------|
| **tailwindcss** | v3.x | CSS utilities |
| **postcss** | v8.x | CSS processing |
| **autoprefixer** | v10.x | Vendor prefixes |

### Optional/Future Dependencies

| Package | Purpose | When to Use |
|---------|---------|------------|
| **GSAP** | Advanced animations | Complex scroll effects |
| **pdf.js** | PDF viewer control | Better PDF UX |
| **axios** | HTTP client | If backend added |
| **axios** | HTTP client | If backend added |
| **lodash** | Utility functions | If extensive data manipulation |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **PostCSS** | CSS processing |

### Hosting & Deployment

| Service | Purpose |
|---------|---------|
| **Hostinger** | Web hosting |
| **GitHub** | Version control |
| **NPM Registry** | Package repository |

---

## Development Stack Detail

### Node.js & npm

**Version Requirements**:
```bash
Node.js: 18.0.0 LTS or higher
npm: 9.0.0 or higher
```

**Installation**:
```bash
# Check installed versions
node --version
npm --version

# Update npm to latest
npm install -g npm@latest
```

**Key npm Commands**:
```bash
npm install                  # Install dependencies
npm run dev                  # Start dev server
npm run build                # Build for production
npm run preview              # Preview production build
npm run lint                 # Lint JavaScript
npm run format               # Format code
```

---

### Vite (Build Tool)

**Configuration** (`vite.config.js`):
```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    open: false,
    hmr: true
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

**Why Vite**:
- ✅ Instant HMR (Hot Module Replacement)
- ✅ Optimized production builds
- ✅ Minimal configuration
- ✅ Fast rebuild times
- ✅ Native ES module support

**Vite Commands**:
```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Create production build (dist/)
npm run preview    # Preview production build locally
```

**Build Output**:
```
dist/
├── index.html      # Minified HTML
├── assets/
│   ├── main-xxxx.js   # Minified JavaScript (hashed)
│   ├── style-xxxx.css # Minified CSS (hashed)
│   └── images/        # Optimized images
└── catalog.json    # Static data
```

---

### Tailwind CSS

**Configuration** (`tailwind.config.js`):
```javascript
export default {
  content: [
    './src/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
        'america-blue': '#1c2f8f',
        'america-red': '#e03a3e',
        'america-dark': '#111827'
      },
      fontFamily: {
        sans: ['"Inter"', '"system-ui"', 'sans-serif']
      }
    }
  },
  plugins: []
}
```

**Key Features**:
- Utility-first approach
- Responsive design utilities
- Custom color palette (America colors)
- Automatic purging (removes unused CSS)
- Production bundle: typically 15-30KB

**Tailwind Classes Used**:
```
Colors: text-america-blue, bg-america-red, border-america-dark
Spacing: p-4, m-2, gap-6, etc.
Grid: grid, grid-cols-1, md:grid-cols-2, lg:grid-cols-3
Flex: flex, items-center, justify-between
Typography: font-bold, text-lg, text-center
Responsive: sm:, md:, lg:, xl:, 2xl:
```

**Why Tailwind**:
- ✅ Smaller CSS bundle than custom CSS
- ✅ Consistent design system
- ✅ No CSS naming conflicts
- ✅ Easy responsive design
- ✅ Built-in dark mode support

---

### ESLint (Code Linting)

**Configuration** (`.eslintrc.json`):
```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-debugger": "error",
    "prefer-const": "warn",
    "no-unused-vars": "warn"
  }
}
```

**Commands**:
```bash
npm run lint                   # Check for errors
npm run lint -- --fix         # Auto-fix errors
npm run lint -- src/scripts   # Lint specific folder
```

**Common Rules**:
- `no-console`: Warns on console.log
- `no-debugger`: Errors on debugger statements
- `prefer-const`: Prefers const over let
- `no-unused-vars`: Warns on unused variables

---

### Prettier (Code Formatting)

**Configuration** (`.prettierrc`):
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

**Commands**:
```bash
npm run format                 # Format all files
npm run format -- src/scripts # Format specific folder
```

**Ignored Files** (`.prettierignore`):
```
dist/
node_modules/
.aios-core/
```

---

### PostCSS

**Configuration** (`postcss.config.js`):
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

**Purpose**:
- Processes Tailwind CSS
- Adds vendor prefixes (-webkit-, -moz-, etc.)
- Minifies CSS in production

---

## Dependency Management

### package.json Structure

```json
{
  "name": "america-site",
  "version": "1.0.0",
  "description": "América Recondicionadora website",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  },
  "dependencies": {
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

**No Runtime Dependencies**: This project intentionally has no npm dependencies at runtime, only build tools.

### Installation & Updates

```bash
# Install all dependencies
npm install

# Install specific package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Update all packages
npm update

# Check outdated packages
npm outdated

# Security audit
npm audit
npm audit fix
```

---

## Browser Support

### Target Browsers

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| iOS Safari | 14+ | ✅ Full |
| Chrome Mobile | 90+ | ✅ Full |

### ES Version Support

- **Target**: ES2020
- **Vite compiles to ES2020** (not older)
- **Polyfills needed**: Only for older browsers (< 2020)

---

## Performance Metrics Targets

### Build Performance
- Dev server startup: < 500ms
- Hot reload: < 100ms
- Production build: < 5 seconds

### Runtime Performance (Lighthouse)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

### Bundle Size Targets
- Total gzipped: < 100KB
- JavaScript: < 50KB gzipped
- CSS: < 30KB gzipped
- Images: Optimized per asset

---

## Development Environment Setup

### System Requirements

```bash
# macOS / Linux
- Node.js 18+ LTS
- npm 9+
- Git
- Code editor (VS Code recommended)

# Windows
- Node.js 18+ LTS
- npm 9+
- Git Bash or PowerShell
- Code editor (VS Code recommended)
```

### Initial Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd america-site

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

### Development Workflow

```bash
# Daily workflow
npm run dev              # Start dev server
# Make changes
# Changes auto-refresh in browser

# Before committing
npm run lint             # Check code
npm run format           # Format code
npm run build            # Verify build works

# Deploy
npm run build
# Upload dist/ to Hostinger
```

---

## Hosting & Deployment Stack

### Hostinger Configuration

**Hosting Type**: Shared Hosting
**Document Root**: `public_html/` (or custom)
**PHP**: Not required
**Node.js**: Not required (static files only)

**Deployment Process**:
```
1. npm run build → Creates dist/
2. Upload dist/ contents to Hostinger
3. Set up domain (DNS pointing)
4. Enable HTTPS/SSL
5. Configure redirects if needed
```

### HTTPS/SSL
- Hostinger typically provides free SSL via Let's Encrypt
- All assets should be HTTPS
- Mixed content (HTTP/HTTPS) should be avoided

### Email & DNS
- Domain registrar: Can be separate from Hostinger
- MX records: Configure for email (if applicable)
- A/CNAME records: Point to Hostinger servers

---

## Monitoring & Analytics (Optional)

### Performance Monitoring
- **Lighthouse CI** - Automated Lighthouse checks
- **WebPageTest** - Advanced performance testing
- **Sentry** - Error tracking (optional)

### Analytics (Optional)
- **Google Analytics** - Traffic and user behavior
- **Hotjar** - Heatmaps and session recording
- **Plausible** - Privacy-focused alternative

---

## Version Control & CI/CD

### Git Workflow
- Repository: GitHub
- Branches: main (production), develop, feature/*
- CI/CD: GitHub Actions (optional for future)

### GitHub Actions (Future)
```yaml
name: Build and Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run build
```

---

## Summary: Technology Comparison

### Why This Stack?

| Choice | Alternative | Why? |
|--------|-------------|------|
| Vanilla JS | React/Vue | Smaller bundle, simpler |
| Vite | Webpack | Faster builds, HMR |
| Tailwind | Bootstrap | Smaller CSS, consistency |
| Hostinger | Vercel/Netlify | Cost-effective, flexibility |
| Static | Node.js backend | No backend needed yet |

---

**Owner**: Architect
**Last Review**: February 2, 2026
**Next Review**: Post-MVP Launch
