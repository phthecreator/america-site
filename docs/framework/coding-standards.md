# Coding Standards - América Recondicionadora

**Version**: 1.0
**Status**: Active
**Last Updated**: February 2, 2026

## HTML Standards

### Semantic Structure
```html
<!-- GOOD: Semantic, accessible -->
<header>
  <nav>
    <a href="#home">Logo</a>
    <ul>
      <li><a href="#catalog">Catálogo</a></li>
    </ul>
  </nav>
</header>

<main>
  <section id="hero">
    <h1>Welcome</h1>
  </section>
  <section id="products">
    <article class="product-card">
      <img alt="Product description">
      <h3>Product Name</h3>
    </article>
  </section>
</main>

<footer>
  <p>&copy; 2026 América Recondicionadora</p>
</footer>
```

### Data Attributes for JavaScript
```html
<!-- GOOD: Use data-* for JS hooks -->
<button data-action="open-catalog" class="btn btn-primary">
  View Catalog
</button>

<input type="text" data-filter="category" placeholder="Filter by category">

<!-- BAD: Don't use classes for JS hooks -->
<button class="open-catalog-btn">View Catalog</button>
```

### Attributes Order
```html
<!-- RECOMMENDED: Consistent attribute order -->
<a
  href="/catalog"
  id="catalog-link"
  class="link-primary"
  data-page="catalog"
  title="View our product catalog"
>
  Catálogo
</a>
```

### Accessibility
```html
<!-- GOOD: Alt text for images -->
<img src="product.jpg" alt="Starter motor rotor component">

<!-- GOOD: Label for forms -->
<label for="search-products">Search Products:</label>
<input type="text" id="search-products" name="search">

<!-- GOOD: ARIA attributes when needed -->
<button aria-label="Open navigation menu" data-action="toggle-menu">
  ☰
</button>
```

---

## JavaScript Standards

### Code Style

#### Variable Declaration
```javascript
// GOOD: const by default
const productName = 'Induzido';
const products = [];

// ACCEPTABLE: let when reassignment needed
let filteredProducts = [...products];

// AVOID: var
var oldStyle = 'deprecated';
```

#### Arrow Functions & Regular Functions
```javascript
// GOOD: Arrow functions for callbacks
const filtered = products.filter(p => p.category === 'Induzidos');

// GOOD: Regular functions for complex logic
function loadCatalog() {
  console.log('Loading catalog...');
  return fetch('/assets/catalog.json').then(r => r.json());
}

// GOOD: Named functions over anonymous
const handleSearch = (query) => {
  // Logic here
};
element.addEventListener('input', handleSearch);

// BAD: Anonymous functions
element.addEventListener('input', (e) => {
  // Logic scattered
});
```

#### Destructuring
```javascript
// GOOD: Destructure objects
const { id, name, category } = product;
const [first, second, ...rest] = products;

// ACCEPTABLE: When destructuring not clear
const data = { nested: { value: 123 } };
const value = data.nested.value;
```

#### Template Literals
```javascript
// GOOD: Use template literals
const message = `Hello, ${name}! Your total is $${total}.`;

// BAD: String concatenation
const message = 'Hello, ' + name + '! Your total is $' + total + '.';
```

### Function Structure

```javascript
/**
 * Search products by query string
 * @param {string} query - Search term
 * @param {Array} products - Product array to search
 * @returns {Array} Filtered products
 */
function searchProducts(query, products = []) {
  // Input validation
  if (!query || typeof query !== 'string') {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();

  // Core logic
  return products.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery)
  );
}

// Usage
const results = searchProducts('motor', allProducts);
```

### Naming Conventions

```javascript
// Variables: camelCase
const productCount = 10;
const isLoading = false;

// Constants: UPPER_SNAKE_CASE (only for true constants)
const MAX_PRODUCTS_PER_PAGE = 12;
const API_TIMEOUT_MS = 5000;

// Functions: camelCase, verb-based
function fetchCatalog() {}
function renderProducts(products) {}
function handleSearchInput(event) {}

// Classes: PascalCase (if used)
class ProductFilter {
  constructor(products) {}
}

// Event handlers: on + verb
function onSearchInput() {}
function onFilterChange() {}
function onWhatsAppClick() {}
```

### Error Handling

```javascript
// GOOD: Try-catch with meaningful messages
async function loadCatalog() {
  try {
    const response = await fetch('/assets/catalog.json');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to load catalog:', error);
    // Show user-friendly message
    showErrorMessage('Unable to load product catalog. Please refresh the page.');
    return [];
  }
}

// GOOD: Return early to reduce nesting
function processProduct(product) {
  if (!product) return null;
  if (!product.id) return null;

  // Process valid product
  return {
    id: product.id,
    name: product.name.trim(),
    category: product.category || 'Uncategorized'
  };
}

// BAD: Deep nesting
function processProduct(product) {
  if (product) {
    if (product.id) {
      // Process...
    }
  }
}
```

### Comments

```javascript
// GOOD: Explain WHY, not WHAT
const discountThreshold = 100;
// Apply 10% discount for orders over $100 (per client request, Story 3.2)
const finalPrice = total > discountThreshold ? total * 0.9 : total;

// BAD: Obvious comments
const discountThreshold = 100; // Set discount threshold to 100

// GOOD: Document complex logic
/**
 * Filters products by category and search term
 * Combines both filters with AND logic (not OR)
 * @see Story 3.1 for filter requirements
 */
function getFilteredProducts(products, category, searchTerm) {
  return products.filter(p =>
    (!category || p.category === category) &&
    (!searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
}
```

### DOM Manipulation

```javascript
// GOOD: Use data-* selectors
const buttons = document.querySelectorAll('[data-action="open-catalog"]');
buttons.forEach(btn => btn.addEventListener('click', openCatalog));

// GOOD: Use const for DOM elements
const header = document.querySelector('header');
const productGrid = document.querySelector('[data-page="catalog"] .grid');

// GOOD: Cache frequently accessed elements
const searchInput = document.querySelector('[data-filter="search"]');
const filterBtn = document.querySelector('[data-action="filter"]');

// BAD: Repeated DOM queries
document.querySelector('.product').innerHTML = '...';
document.querySelector('.product').style.display = 'block';
document.querySelector('.product').addEventListener('click', ...);

// GOOD: Use textContent for text, innerHTML only when needed
element.textContent = 'Safe text'; // No HTML injection risk
element.innerHTML = '<strong>HTML content</strong>'; // Only if needed
```

### Event Handling

```javascript
// GOOD: Use event delegation
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-action="filter"]')) {
    handleFilter(e);
  }
  if (e.target.matches('[data-action="open-whatsapp"]')) {
    openWhatsApp(e);
  }
});

// GOOD: Use named handlers (not inline)
const handleSearch = (e) => {
  const query = e.target.value.trim();
  if (query.length < 2) return;

  filterProducts(query);
};
searchInput.addEventListener('input', handleSearch);

// BAD: Inline handlers
element.addEventListener('click', () => { /* logic */ });
```

---

## CSS/Tailwind Standards

### Tailwind Usage

```html
<!-- GOOD: Utility-first approach -->
<div class="flex items-center justify-between gap-4 p-6 bg-white rounded-lg shadow">
  <h2 class="text-xl font-bold text-america-blue">Catálogo</h2>
  <button class="px-4 py-2 bg-america-red text-white rounded hover:bg-red-700 transition">
    Filter
  </button>
</div>

<!-- GOOD: Responsive classes -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Grid items -->
</div>

<!-- BAD: Over-nesting -->
<div class="flex">
  <div class="w-1/2">
    <div class="flex">
      <div>Content</div>
    </div>
  </div>
</div>
```

### Custom CSS (In globals.css)

```css
/* GOOD: CSS variables for theme */
:root {
  --color-primary: #1c2f8f;
  --color-accent: #e03a3e;
  --color-dark: #111827;
}

/* GOOD: Custom animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-up {
  animation: slideInUp 0.5s ease-out;
}

/* GOOD: Component classes for complex combinations */
.card-base {
  @apply bg-white rounded-lg shadow-md p-6 transition-shadow hover:shadow-lg;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition;
}
```

### Dark Mode (if needed)

```html
<!-- GOOD: Dark mode support -->
<div class="bg-white dark:bg-gray-900">
  <p class="text-gray-900 dark:text-white">Content</p>
</div>
```

---

## Performance Standards

### JavaScript Performance
```javascript
// GOOD: Debounce for frequent events
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const handleSearch = debounce((query) => {
  filterProducts(query);
}, 300);

searchInput.addEventListener('input', handleSearch);

// GOOD: Use requestAnimationFrame for animations
function animate() {
  // Update animation frame
  requestAnimationFrame(animate);
}

// GOOD: Intersection Observer for lazy loading
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadElement(entry.target);
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('[data-lazy]').forEach(el => observer.observe(el));
```

### Bundle Size
- Keep individual files under 50KB (unminified)
- Lazy load scripts when possible
- Remove unused dependencies

---

## File Naming

```
// HTML files: kebab-case
- index.html
- product-details.html

// CSS files: kebab-case
- globals.css
- animations.css

// JavaScript files: kebab-case
- main.js
- catalog.js
- contact.js
- animations.js

// Image files: lowercase with hyphens
- logo-america.png
- hero-section.jpg
- product-1.jpg
- product-1.webp (optimized)

// Data files: kebab-case
- catalog.json
- products.json
```

---

## Git Commit Standards

### Message Format
```
<type>: <description> [Story ID]

<optional body>

<optional footer>
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - CSS, formatting (no logic change)
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `chore:` - Build, dependencies
- `test:` - Test files

### Examples
```
feat: implement catalog search filter [Story 3.1]
fix: PDF not loading on catalog page [Story 4.2]
perf: optimize image loading with lazy load [Story 5.1]
docs: update README with deployment steps [Story 5.3]
refactor: extract animation logic to animations.js [Story 2.4]
```

---

## Testing Standards

### Test Structure
```javascript
// src/scripts/__tests__/catalog.test.js
describe('Catalog Functions', () => {
  describe('searchProducts', () => {
    it('should return products matching search term', () => {
      const products = [
        { id: 1, name: 'Induzido' },
        { id: 2, name: 'Estator' }
      ];

      const result = searchProducts('induzido', products);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Induzido');
    });

    it('should be case-insensitive', () => {
      // Test
    });

    it('should return empty array for no matches', () => {
      // Test
    });
  });
});
```

---

## Code Review Checklist

- [ ] Code follows naming conventions
- [ ] HTML is semantic and accessible
- [ ] JavaScript uses proper error handling
- [ ] CSS follows Tailwind first approach
- [ ] No console.log left in production code
- [ ] Comments explain WHY, not WHAT
- [ ] No hardcoded values (use constants)
- [ ] Performance optimizations applied
- [ ] Tests added for new functionality
- [ ] Commit message follows format

---

**Owner**: Development Team
**Last Review**: February 2, 2026
