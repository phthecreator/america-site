# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**América Recondicionadora** - A modern website for an automotive parts company. Single-page application with catalog, company information, and integrated WhatsApp contact flow.

- **Type**: Static HTML + JavaScript (modern tooling)
- **Hosting**: Hostinger
- **Stack**: Node.js, npm, vanilla JavaScript, Tailwind CSS, Vite
- **Framework Integration**: Synkra AIOS for development coordination

## Development Stack

### Core Technologies
- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first styling (via npm, not CDN in production)
- **Vanilla JavaScript** - No frameworks, lightweight
- **Vite** - Build tool and dev server
- **npm** - Package management

### Design System
- **Primary Colors**:
  - Blue: `#1c2f8f` (america-blue)
  - Red: `#e03a3e` (america-red)
  - Dark: `#111827` (america-dark)
- **Base**: White backgrounds with blue/red accents

## Project Structure

```
├── src/
│   ├── index.html              # Main entry point
│   ├── styles/
│   │   └── globals.css         # Global styles and Tailwind directives
│   ├── scripts/
│   │   ├── main.js             # Application entry point
│   │   ├── catalog.js          # Catalog search/filter logic
│   │   ├── contact.js          # WhatsApp contact handler
│   │   └── animations.js       # Page animations and transitions
│   └── assets/
│       ├── images/             # Logo, product images, etc.
│       └── catalog.pdf         # Product catalog PDF
├── dist/                       # Build output (gitignored)
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind customization
├── package.json               # Dependencies and scripts
└── docs/                      # Documentation (AIOS framework)
    ├── prd/                   # Product requirements
    ├── architecture/          # Technical architecture
    ├── framework/             # Coding standards & tech stack
    └── stories/               # Development stories
```

## Common Commands

### Development
```bash
npm install                    # Install dependencies
npm run dev                    # Start dev server (http://localhost:5173)
npm run build                  # Build for production
npm run preview                # Preview production build locally
```

### Code Quality
```bash
npm run lint                   # Run ESLint on JavaScript
npm run format                 # Format code with Prettier
npm run type-check             # TypeScript/JSDoc checking (if configured)
```

### Production Deployment
1. `npm run build` - Creates optimized `dist/` folder
2. Upload contents of `dist/` to Hostinger
3. Set document root to the uploaded folder
4. Verify PDF catalog is accessible at correct path

## Key Features Implementation

### 1. Catalog with Search/Filter
- **Location**: `src/scripts/catalog.js`
- **Data**: Loaded from `src/assets/catalog.json` or similar
- **UI**: Filter by category, product name, specifications
- **PDF**: Auto-opens on catalog page load via `src/assets/catalog.pdf`

### 2. WhatsApp Contact Integration
- **Location**: `src/scripts/contact.js`
- **Implementation**:
  - Button on home page and header
  - Links to: `https://wa.me/[PHONE_NUMBER]` (replace with actual number)
  - Optionally pre-fill message with `?text=` parameter
- **No backend needed**: Direct WhatsApp link

### 3. Animations & Performance
- **Location**: `src/scripts/animations.js`
- **Tools**: CSS animations (Tailwind), optional GSAP for complex animations
- **Strategy**:
  - Lazy load images where possible
  - Throttle scroll events
  - Use CSS transforms for animations (GPU-accelerated)
- **Target**: Lighthouse score 90+, First Contentful Paint < 1.5s

## Code Standards

### HTML
- Use semantic elements (`<header>`, `<main>`, `<section>`, `<footer>`)
- Add `data-*` attributes for JavaScript hooks (not classes)
- Keep HTML clean, logic in JavaScript

### JavaScript
- ES6+ syntax (const/let, arrow functions, destructuring)
- Use `data-*` attributes to select elements, not classes
- One responsibility per function
- Event delegation for dynamic elements
- Document public functions with JSDoc comments

### CSS/Tailwind
- Use Tailwind utility classes for styling
- Custom CSS only for animations or theme variations
- Follow mobile-first approach
- Use consistent spacing scale (Tailwind default)

### Naming Conventions
- Files: `kebab-case` (catalog.js, contact-form.html)
- JavaScript: `camelCase` (const getProductById, function handleSubmit)
- CSS classes: Use Tailwind utilities; custom classes in `kebab-case`
- Data attributes: `data-product-id`, `data-category-filter`

## Claude Code Operating Rules

### NEVER
- Implement without showing options first (always 1, 2, 3 format)
- Delete/remove content without asking first
- Delete anything created in the last 7 days without explicit approval
- Change something that was already working
- Pretend work is done when it isn't
- Process batch without validating one first
- Add features that weren't requested
- Use mock data when real data exists in database
- Explain/justify when receiving criticism (just fix)
- Trust AI/subagent output without verification
- Create from scratch when similar exists in squads/

### ALWAYS
- Present options as "1. X, 2. Y, 3. Z" format
- Use AskUserQuestion tool for clarifications
- Check squads/ and existing components before creating new
- Read COMPLETE schema before proposing database changes
- Investigate root cause when error persists
- Commit before moving to next task
- Create handoff in docs/sessions/YYYY-MM-DD/ at end of session

## Git Workflow

### Branch Strategy
- `main` - Production-ready code (deployed to Hostinger)
- `develop` - Integration branch
- `feature/*` - Feature branches (e.g., `feature/catalog-search`)

### Commit Messages
- Format: `type: description [Story ID]`
- Types: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `chore:`
- Example: `feat: implement catalog search filter [Story 1.2]`

### Before Pushing
1. Run `npm run build` - Verify production build succeeds
2. Test locally at `http://localhost:5173`
3. Verify PDF loads correctly on catalog page
4. Test WhatsApp link opens correctly
5. Run `npm run lint` and fix any issues

## Performance Optimization

### Best Practices
1. **Images**: Optimize with WebP where possible, use responsive sizes
2. **CSS**: Tailwind purges unused styles in production automatically
3. **JavaScript**: Keep bundle small, lazy-load third-party scripts
4. **PDF**: Serve from CDN if catalog is large (>5MB)

### Lighthouse Targets
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

## AIOS Integration

This project uses Synkra AIOS for development coordination. Key files:
- `.aios-core/` - Framework files (do not edit directly)
- `.aios-pm-config.yaml` - Project Manager configuration
- `docs/prd/` - Sharded product requirements
- `docs/architecture/` - Technical architecture decisions
- `docs/stories/` - Development stories (numbered)

### Working with AIOS
- Activate agents: `@dev`, `@qa`, `@architect`, `@pm`, etc.
- Create stories in `docs/stories/` using AIOS templates
- Update story checkboxes as tasks complete
- Follow story-driven development workflow

## Troubleshooting

### Build Issues
- **"Module not found"**: Run `npm install`
- **Tailwind not compiling**: Check `tailwind.config.js` includes all template paths
- **Vite cache issues**: Delete `node_modules/.vite` and rebuild

### Dev Server Issues
- **Port 5173 in use**: Change in `vite.config.js` or kill existing process
- **Hot reload not working**: Restart dev server
- **PDF not loading**: Verify path in `src/assets/catalog.pdf` exists

### Production Issues
- **Assets not loading**: Check paths are relative, not absolute
- **PDF blank on Hostinger**: Verify MIME type is set to application/pdf
- **Animations slow**: Profile with Chrome DevTools Performance tab

## MCP Configuration

MCP servers are managed by DevOps. Current configuration:
- **Desktop Commander** (`docker-gateway`) - For Docker operations if needed
- **Playwright** - For browser testing/screenshots

For MCP management, use `@devops` agent with `*add-mcp` command.

## Resources & Documentation

- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)
- Project docs: `docs/prd/` and `docs/architecture/`

---

**Last Updated**: February 2026
**AIOS Version**: 2.1.0
**Maintained By**: Claude Code
