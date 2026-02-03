# Architecture Document - América Recondicionadora Website

**Version**: 1.0
**Status**: Design Phase
**Last Updated**: February 2, 2026

## Architecture Overview

**Architecture Type**: Static Site with Client-Side Rendering (SPA Pattern)
**Deployment**: Static hosting (Hostinger)
**Build Tool**: Vite + npm
**Framework**: None (vanilla HTML/JS)
**Styling**: Tailwind CSS

## System Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                  User Browser                     │
├─────────────────────────────────────────────────┤
│                                                   │
│  ┌──────────────┐      ┌──────────────┐         │
│  │   index.html │  ←→  │  main.js     │         │
│  │  (Semantic   │      │  (Router &   │         │
│  │   HTML)      │      │   State)     │         │
│  └──────────────┘      └──────────────┘         │
│         ↓                      ↓                 │
│  ┌──────────────┐      ┌──────────────┐         │
│  │ globals.css  │  ←→  │ catalog.js   │         │
│  │(Tailwind)    │      │(Search/Filter)        │
│  └──────────────┘      └──────────────┘         │
│         ↓                      ↓                 │
│  ┌──────────────────────────────────┐           │
│  │      contact.js                   │           │
│  │ (WhatsApp Integration)            │           │
│  └──────────────────────────────────┘           │
│         ↓                                        │
│  ┌──────────────────────────────────┐           │
│  │      animations.js                │           │
│  │ (Scroll animations, transitions)  │           │
│  └──────────────────────────────────┘           │
│                                                   │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│              Assets & Resources                  │
├─────────────────────────────────────────────────┤
│  • images/              (Optimized images)       │
│  • catalog.pdf          (Product catalog)        │
│  • catalog.json         (Product data)           │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│           Hostinger (Static Hosting)             │
├─────────────────────────────────────────────────┤
│  dist/                  (Built/minified files)   │
└─────────────────────────────────────────────────┘
```

## Directory Structure

```
america-site/
├── src/
│   ├── index.html              # Main entry point - semantic HTML structure
│   ├── styles/
│   │   └── globals.css         # Tailwind directives + global styles
│   ├── scripts/
│   │   ├── main.js             # App initialization, routing, state management
│   │   ├── catalog.js          # Product catalog, search, filter logic
│   │   ├── contact.js          # WhatsApp integration, contact handlers
│   │   └── animations.js       # Scroll animations, transitions, GSAP setup
│   └── assets/
│       ├── images/
│       │   ├── logo.png        # Company logo
│       │   ├── hero.jpg        # Hero section image
│       │   └── products/       # Product images
│       └── catalog.pdf         # Product catalog PDF
├── docs/
│   ├── prd/                    # Product requirements
│   ├── architecture/           # Technical architecture (this file)
│   ├── framework/              # Coding standards, tech stack
│   └── stories/                # Development stories
├── .aios-core/                 # AIOS framework (do not modify)
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind customization
├── package.json                # Dependencies
├── .gitignore                  # Git ignore rules
└── dist/                       # Build output (not committed)
```

## Technology Decisions

### Why Vanilla JavaScript (No Framework)?

**Rationale**:
- Minimal bundle size (crucial for performance targets)
- Simple static site doesn't need complex state management
- Easier to understand and maintain
- No build-time dependencies beyond Vite + Tailwind

**Trade-offs**:
- ❌ More code for DOM manipulation vs React/Vue
- ✅ Faster initial load
- ✅ No framework overhead

**Alternative Considered**: React/Vue
- Rejected due to bundle size impact on Lighthouse targets

---

### Why Vite (Not Webpack/Rollup)?

**Rationale**:
- Lightning-fast dev server (instant HMR)
- Minimal configuration needed
- Excellent Tailwind integration
- Optimized production builds

**Trade-offs**:
- Learning curve for developers
- ✅ Dramatically faster build times

---

### Why Tailwind CSS?

**Rationale**:
- Utility-first approach = less custom CSS
- Small production bundle (purges unused styles)
- Consistent design system
- Easy responsive design

**Setup**:
- Installed via npm (not CDN)
- Configured with custom colors (blue, red, dark)
- JIT mode enabled for optimal bundle

---

### Why PDF as Separate File (Not Embedded)?

**Rationale**:
- Client already has PDF ready
- Simpler than PDF generation
- Better browser support for PDF viewing
- User can download/print easily

**Implementation**:
- Stored in `src/assets/catalog.pdf`
- Opened via iframe or PDF viewer on catalog page
- Option to use PDF.js for better control

---

## Key Components & Responsibilities

### 1. HTML Structure (`src/index.html`)

**Responsibility**: Semantic markup, page structure
**Tech**: HTML5 semantic elements
**Key Sections**:
- `<header>` - Navigation, logo
- `<main>` - Page content (homepage/catalog)
- `<footer>` - Footer content

**Design Principles**:
- No inline styles (use Tailwind classes)
- Use `data-*` attributes for JS hooks
- Semantic elements for SEO and accessibility

---

### 2. Main App Entry (`src/scripts/main.js`)

**Responsibility**:
- Application initialization
- Route switching (home ↔ catalog)
- Global event listeners
- State management (simple object)

**Key Functions**:
```javascript
- initApp()              // Initialize application
- switchPage(page)       // Switch between pages
- renderPage(page)       // Render page content
- setupEventListeners()  // Global event setup
```

**State Structure**:
```javascript
const appState = {
  currentPage: 'home',        // 'home' | 'catalog'
  catalog: [],                // Product array
  filteredCatalog: [],        // Filtered products
  searchQuery: '',            // Search query
  selectedFilters: {},        // Active filters
  theme: 'light'              // Future theming
}
```

---

### 3. Catalog System (`src/scripts/catalog.js`)

**Responsibility**:
- Load product data
- Implement search functionality
- Implement filtering by category
- Render product grid with images

**Key Functions**:
```javascript
- loadCatalog()         // Fetch catalog.json
- searchProducts(q)     // Search by name/desc
- filterByCategory(c)   // Filter by category
- renderCatalog()       // Render product grid
- setupSearchListener() // Search input handler
- setupFilterListener() // Filter selector handler
```

**Data Source**: `src/assets/catalog.json`

**Data Structure**:
```json
{
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "category": "Induzidos",
      "image": "products/product-1.jpg",
      "description": "Short description",
      "specifications": "Key specs",
      "pricing": "Contact for pricing"
    }
  ]
}
```

---

### 4. Contact Integration (`src/scripts/contact.js`)

**Responsibility**:
- Setup WhatsApp buttons
- Generate WhatsApp URLs with pre-filled messages
- Handle contact interactions

**Key Functions**:
```javascript
- initWhatsApp()        // Setup WhatsApp buttons
- generateWAUrl(msg)    // Generate WhatsApp URL
- openWhatsApp(msg)     // Open WhatsApp link
```

**WhatsApp Integration**:
- Format: `https://wa.me/[PHONE_NUMBER]?text=[MESSAGE]`
- Button placement: Homepage + header
- Pre-filled message: Company introduction or product inquiry

---

### 5. Animations (`src/scripts/animations.js`)

**Responsibility**:
- Scroll-triggered animations
- Page transitions
- Hover effects (via CSS, triggered by JS)
- Performance-optimized animations

**Key Functions**:
```javascript
- initScrollAnimations()    // Setup Intersection Observer
- animateOnScroll()         // Handle scroll events
- animatePageTransition()   // Page switching animation
- setupHoverAnimations()    // Hover state handlers
```

**Animation Strategy**:
- Use CSS animations (GPU-accelerated) where possible
- Intersection Observer for scroll detection
- Throttled scroll events to avoid jank
- Optional GSAP for complex animations

---

### 6. Styling (`src/styles/globals.css`)

**Responsibility**:
- Tailwind CSS setup
- Global styles and resets
- Custom animations
- Theme variables

**Structure**:
```css
@tailwind base;      /* Reset and base styles */
@tailwind components; /* Component classes */
@tailwind utilities;  /* Utility classes */

/* Custom animations */
/* Theme variables */
/* Global overrides */
```

---

## Data Flow

### Homepage Load
```
1. User visits website
2. main.js initializes
3. Header and footer render
4. Homepage content renders
5. animations.js setup scroll listeners
6. images lazy-load as user scrolls
7. WhatsApp button ready
```

### Catalog Page
```
1. User clicks "Catálogo" link
2. main.js switches to catalog page
3. catalog.js loads catalog.json
4. Products render in grid
5. PDF auto-opens in modal/iframe
6. Search/filter listeners active
7. User can search or filter products
8. Grid updates dynamically
```

### Search/Filter Flow
```
1. User types in search or selects filter
2. Event listener triggered
3. Filter applied to appState.catalog
4. Filtered array stored in appState.filteredCatalog
5. Grid re-renders with filtered products
6. No page reload needed (client-side)
```

---

## Performance Architecture

### Load Time Optimization

**Image Optimization**:
- Images compressed before deployment
- WebP format where supported
- Lazy loading with Intersection Observer
- Responsive images (srcset)

**Code Splitting**:
- Catalog.js loaded on-demand (when catalog page accessed)
- Contact.js loaded on initialization
- Animations.js loaded after DOM ready

**Caching Strategy**:
- Static assets cached by browser (build hash in filenames)
- Service Worker (optional, for offline support)

**Bundle Size Targets**:
- HTML: < 50KB
- CSS (combined): < 30KB (Tailwind purged)
- JS (combined): < 100KB (minified)
- Images: Optimized per image (JPEG < 200KB, WebP < 100KB)

### Runtime Performance

**Scroll Performance**:
- Throttled/debounced scroll listeners
- Intersection Observer for lazy elements
- RequestAnimationFrame for animations

**Search/Filter Performance**:
- Client-side filtering (no network requests)
- Cached catalog in memory
- Debounced search input (300ms)

**Target Metrics**:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3s

---

## Security Considerations

### Input Validation
- Search/filter inputs sanitized
- WhatsApp URL parameters encoded
- No eval() or dangerous DOM methods

### Content Security Policy
- Restrict script sources (no inline scripts without CSP nonce)
- Restrict style sources
- Restrict image sources

### Data Privacy
- No cookies or tracking (unless user opts in)
- No personal data collected without consent
- GDPR compliant (if EU users expected)

---

## Deployment Architecture

### Development Workflow
```
1. Code → local repo (git)
2. npm run dev → Vite dev server
3. Test locally at http://localhost:5173
4. Commit → GitHub
```

### Production Build & Deploy
```
1. npm run build → Creates dist/ folder
2. Minified HTML, CSS, JS
3. Optimized images
4. Upload dist/ to Hostinger
5. Set document root to dist/
6. Configure SSL/HTTPS
7. DNS point to Hostinger
```

### Hosting Architecture
```
Hostinger (Shared Hosting)
├── public_html/ (or similar)
│   ├── index.html
│   ├── assets/
│   ├── *.js (minified)
│   └── *.css (minified)
└── .htaccess (optional, for routing)
```

---

## Scalability & Future Enhancements

### Current State (MVP)
- ✅ Static files only
- ✅ Client-side search/filter
- ✅ Single page application pattern

### Phase 2 Enhancements
- ❓ Backend API (if needed for e-commerce)
- ❓ Database (product inventory)
- ❓ Admin panel (for client content updates)
- ❓ Email notifications (form submissions)

### Phase 3+ Enhancements
- ❓ E-commerce functionality
- ❓ User accounts
- ❓ Advanced analytics
- ❓ Multi-language support

---

## Dependencies & Tooling

### Build Dependencies
- `vite` - Build tool and dev server
- `tailwindcss` - CSS framework
- `postcss` - CSS processing
- `autoprefixer` - Vendor prefixes

### Optional Dependencies (Considered)
- `gsap` - Advanced animations (if needed)
- `pdf.js` - Better PDF control (alternative to native)
- `axios` or `fetch` - API calls (if backend added)

### Development Dependencies
- `eslint` - Code linting
- `prettier` - Code formatting
- `postcss` - CSS processing

---

## Testing Strategy

### Unit Testing
- Catalog functions (search, filter)
- Contact URL generation
- Animation trigger logic

### Integration Testing
- Page switching
- Search + filter together
- PDF loading on catalog page

### E2E Testing
- Full user journeys
- Mobile responsiveness
- Browser compatibility

### Performance Testing
- Lighthouse audit
- WebPageTest
- Chrome DevTools

---

## Error Handling & Logging

### Error Scenarios
1. **Catalog.json fails to load** → Show fallback message
2. **Images fail to load** → Show alt text or placeholder
3. **PDF fails to open** → Show download link
4. **JavaScript errors** → Log to console (dev), notify user (production)

### Logging Strategy
- Console logs for development
- Optional error tracking service (e.g., Sentry)
- User-friendly error messages

---

## Documentation & Maintenance

### Developer Documentation
- `.claude/CLAUDE.md` - Claude Code guidance
- This architecture document
- Inline code comments for complex logic

### Client Documentation
- How to update content
- How to update product catalog
- Contact support process

---

## Decision Log

| Decision | Rationale | Date |
|----------|-----------|------|
| Vanilla JS | Performance, simplicity | Feb 2026 |
| Vite | Fast dev server, optimal builds | Feb 2026 |
| Tailwind CSS | Utility-first, small bundle | Feb 2026 |
| Static hosting | Cost, simplicity, no backend needed | Feb 2026 |
| Client-side filtering | No backend required, fast | Feb 2026 |

---

**Architecture Owner**: Architect Agent
**Last Review**: February 2, 2026
**Next Review**: Post MVP Launch
