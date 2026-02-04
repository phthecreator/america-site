/* global pdfjsLib */
import './styles/globals.css';

// PDF Viewer State
const pdfState = {
  pdfDoc: null,
  currentPage: 1,
  totalPages: 0,
  scale: 1,
  searchText: '',
  currentSearchIndex: 0,
  searchMatches: []
};

// DOM Elements
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const pageNumSpan = document.getElementById('page-num');
const pageCountSpan = document.getElementById('page-count');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const navPrevBtn = document.getElementById('nav-prev');
const navNextBtn = document.getElementById('nav-next');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomLevelSpan = document.getElementById('zoom-level');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const downloadBtn = document.getElementById('download-pdf');
const printBtn = document.getElementById('print-pdf');
const loadingDiv = document.getElementById('loading');
const canvasWrapper = document.querySelector('.pdf-canvas-wrapper');
const toggleResultsBtn = document.getElementById('toggle-results');
const resultsPanel = document.getElementById('results-panel');
const resultsContent = document.getElementById('results-content');

// Initialize PDF Viewer
async function initPDF() {
  try {
    loadingDiv.classList.remove('hidden');

    // Load PDF from public folder
    const pdfPath = '/Catálogo América 2026 COMPLETO.pdf';

    const pdf = await pdfjsLib.getDocument(pdfPath).promise;
    pdfState.pdfDoc = pdf;
    pdfState.totalPages = pdf.numPages;

    // Update page count
    pageCountSpan.textContent = pdfState.totalPages;

    // Render first page
    await renderPage(1);

    loadingDiv.classList.add('hidden');
  } catch (error) {
    console.error('Erro ao carregar PDF:', error);
    loadingDiv.innerHTML = `
      <div class="text-center text-america-red">
        <p class="font-bold mb-2">Erro ao carregar o catálogo</p>
        <p class="text-sm text-slate-400">${error.message}</p>
        <p class="text-xs text-slate-500 mt-4">Verifique se o arquivo existe em /public</p>
      </div>
    `;
  }
}

// Render specific page
async function renderPage(pageNum) {
  try {
    if (!pdfState.pdfDoc) return;

    // Ensure page number is valid
    if (pageNum < 1 || pageNum > pdfState.totalPages) return;

    pdfState.currentPage = pageNum;
    pageNumSpan.textContent = pageNum;

    // Get page
    const page = await pdfState.pdfDoc.getPage(pageNum);

    // Calculate viewport with scale
    const baseScale = 1.5;
    const viewport = page.getViewport({ scale: baseScale * pdfState.scale });

    // Set canvas dimensions
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render page to canvas
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    await page.render(renderContext).promise;

    // Update button states
    updateNavigationButtons();

    // Scroll to top of canvas
    canvasWrapper.scrollTop = 0;
  } catch (error) {
    console.error('Erro ao renderizar página:', error);
  }
}

// Update navigation button states
function updateNavigationButtons() {
  prevBtn.disabled = pdfState.currentPage <= 1;
  nextBtn.disabled = pdfState.currentPage >= pdfState.totalPages;
  navPrevBtn.disabled = pdfState.currentPage <= 1;
  navNextBtn.disabled = pdfState.currentPage >= pdfState.totalPages;

  prevBtn.classList.toggle('opacity-50', pdfState.currentPage <= 1);
  nextBtn.classList.toggle('opacity-50', pdfState.currentPage >= pdfState.totalPages);
  navPrevBtn.classList.toggle('opacity-50', pdfState.currentPage <= 1);
  navNextBtn.classList.toggle('opacity-50', pdfState.currentPage >= pdfState.totalPages);
}

// Navigation - Toolbar buttons
prevBtn.addEventListener('click', async () => {
  if (pdfState.currentPage > 1) {
    await renderPage(pdfState.currentPage - 1);
  }
});

nextBtn.addEventListener('click', async () => {
  if (pdfState.currentPage < pdfState.totalPages) {
    await renderPage(pdfState.currentPage + 1);
  }
});

// Navigation - Side arrows (large)
navPrevBtn.addEventListener('click', async () => {
  if (pdfState.currentPage > 1) {
    await renderPage(pdfState.currentPage - 1);
  }
});

navNextBtn.addEventListener('click', async () => {
  if (pdfState.currentPage < pdfState.totalPages) {
    await renderPage(pdfState.currentPage + 1);
  }
});

// Keyboard navigation
document.addEventListener('keydown', async (e) => {
  if (e.key === 'ArrowLeft' && pdfState.currentPage > 1) {
    await renderPage(pdfState.currentPage - 1);
  } else if (e.key === 'ArrowRight' && pdfState.currentPage < pdfState.totalPages) {
    await renderPage(pdfState.currentPage + 1);
  }
});

// Zoom functionality
zoomInBtn.addEventListener('click', async () => {
  if (pdfState.scale < 3) {
    pdfState.scale += 0.25;
    updateZoomLevel();
    await renderPage(pdfState.currentPage);
  }
});

zoomOutBtn.addEventListener('click', async () => {
  if (pdfState.scale > 0.5) {
    pdfState.scale -= 0.25;
    updateZoomLevel();
    await renderPage(pdfState.currentPage);
  }
});

function updateZoomLevel() {
  const baseScale = 1.5;
  const zoomPercent = Math.round(baseScale * pdfState.scale * 100 / 1.5);
  zoomLevelSpan.textContent = `${zoomPercent}%`;
}

// Toggle Results Panel
toggleResultsBtn.addEventListener('click', () => {
  resultsPanel.classList.toggle('hidden');
  toggleResultsBtn.classList.toggle('bg-blue-700');
});

// Search functionality - IMPROVED
searchBtn.addEventListener('click', async () => {
  await performSearch();
});

searchInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    await performSearch();
  }
});

async function performSearch() {
  const text = searchInput.value.trim();

  if (!text) {
    pdfState.searchText = '';
    pdfState.searchMatches = [];
    searchInput.classList.remove('ring-2', 'ring-america-blue', 'ring-red-500');
    resultsContent.innerHTML = '';
    return;
  }

  pdfState.searchText = text.toLowerCase();
  pdfState.searchMatches = [];
  pdfState.currentSearchIndex = 0;

  // Search through all pages
  try {
    let foundCount = 0;

    for (let pageNum = 1; pageNum <= pdfState.totalPages; pageNum++) {
      const page = await pdfState.pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Extract all text from page
      let pageText = '';
      const items = [];

      for (const item of textContent.items) {
        if ('str' in item) {
          pageText += item.str + ' ';
          items.push(item.str);
        }
      }

      // Check if search text appears on this page (case-insensitive)
      if (pageText.toLowerCase().includes(pdfState.searchText)) {
        pdfState.searchMatches.push({
          pageNum: pageNum,
          text: pageText,
          foundText: items.join(' ')
        });
        foundCount++;
      }
    }

    // Show results in panel
    if (pdfState.searchMatches.length > 0) {
      const firstMatch = pdfState.searchMatches[0];
      await renderPage(firstMatch.pageNum);

      searchInput.classList.remove('ring-red-500');
      searchInput.classList.add('ring-2', 'ring-america-blue');

      // Display results panel
      displaySearchResults(text, pdfState.searchMatches);

      // Open results panel automatically
      resultsPanel.classList.remove('hidden');

      // Show success message
      const resultText = foundCount === 1
        ? '1 resultado encontrado'
        : `${foundCount} resultados encontrados`;

      console.log(`✓ ${resultText} para "${text}"`);
      showNotification(`${resultText}. Veja abaixo.`, 'success');
    } else {
      searchInput.classList.remove('ring-america-blue');
      searchInput.classList.add('ring-2', 'ring-red-500');

      console.warn(`✗ Nenhum resultado para "${text}"`);
      resultsContent.innerHTML = `
        <div class="text-america-red font-semibold">
          ❌ Nenhum resultado encontrado para "<strong>${text}</strong>"
        </div>
      `;
      resultsPanel.classList.remove('hidden');

      showNotification(`Nenhum resultado para "${text}"`, 'error');
    }
  } catch (error) {
    console.error('Erro ao buscar:', error);
    showNotification('Erro ao realizar busca', 'error');
  }
}

// Detect product type on a page
async function detectProductType(pageNum) {
  try {
    const page = await pdfState.pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    let pageText = '';
    for (const item of textContent.items) {
      if ('str' in item) {
        pageText += item.str + ' ';
      }
    }

    const lowerText = pageText.toLowerCase();

    // Check for product types (order matters - check more specific terms first)
    if (lowerText.includes('induzido')) return 'induzido';
    if (lowerText.includes('bobina')) return 'bobina';
    if (lowerText.includes('rotor')) return 'rotor';
    if (lowerText.includes('estator')) return 'estator';

    return 'outro';
  } catch (error) {
    console.error('Erro ao detectar tipo:', error);
    return 'outro';
  }
}

// Get related product type
function getRelatedType(productType) {
  const relationships = {
    'induzido': 'bobina',
    'bobina': 'induzido',
    'rotor': 'estator',
    'estator': 'rotor'
  };
  return relationships[productType] || null;
}

// Display search results grouped by product type
async function displaySearchResults(searchTerm, matches) {
  const pageNumbers = matches.map(m => m.pageNum);
  const uniquePages = [...new Set(pageNumbers)];

  // Detect product type for each page
  const pageDetails = [];
  for (const pageNum of uniquePages) {
    const type = await detectProductType(pageNum);
    pageDetails.push({ pageNum, type });
  }

  // Group by product type
  const grouped = {
    'induzido': [],
    'bobina': [],
    'rotor': [],
    'estator': [],
    'outro': []
  };

  pageDetails.forEach(detail => {
    grouped[detail.type].push(detail.pageNum);
  });

  // Color mapping for each product type
  const colorMap = {
    'induzido': { bg: 'bg-red-600', text: 'text-white', label: 'INDUZIDO' },
    'bobina': { bg: 'bg-amber-600', text: 'text-white', label: 'BOBINA' },
    'rotor': { bg: 'bg-emerald-600', text: 'text-white', label: 'ROTOR' },
    'estator': { bg: 'bg-blue-600', text: 'text-white', label: 'ESTATOR' }
  };

  // Build HTML
  let html = `
    <div class="flex flex-col gap-4">
      <div class="border-b border-slate-600 pb-3">
        <p class="text-slate-300 text-sm">
          Encontrei <span class="font-bold text-white">"${searchTerm}"</span> em <span class="font-bold text-america-blue">${uniquePages.length}</span> página${uniquePages.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div class="grid gap-4">
  `;

  // Display each product type
  const typesOrder = ['induzido', 'bobina', 'rotor', 'estator'];

  typesOrder.forEach(type => {
    const pages = grouped[type];
    const colors = colorMap[type];
    const relatedType = getRelatedType(type);
    const isRelated = relatedType && grouped[relatedType].length > 0;

    html += `
      <div class="border-l-4 ${colors.bg} bg-slate-700/50 p-4 rounded">
        <div class="flex items-center justify-between mb-3">
          <span class="font-bold ${colors.text} text-lg">${colors.label}</span>
          <span class="text-slate-300 text-sm">${pages.length} página${pages.length !== 1 ? 's' : ''}</span>
          ${isRelated ? `<span class="text-xs text-slate-400">(com ${relatedType})</span>` : ''}
        </div>

        ${pages.length > 0 ? `
          <div class="flex items-center gap-2 flex-wrap">
            ${pages.map(pageNum => `
              <button class="page-result-btn ${colors.bg} hover:opacity-80 text-white font-bold py-2 px-4 rounded transition transform hover:scale-105 active:scale-95" data-page="${pageNum}">
                Página ${pageNum}
              </button>
            `).join('')}
          </div>
        ` : `
          <p class="text-slate-400 text-sm italic">Nenhuma página encontrada</p>
        `}
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  resultsContent.innerHTML = html;

  // Add click handlers to page buttons
  document.querySelectorAll('.page-result-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pageNum = parseInt(btn.dataset.page);
      await renderPage(pageNum);
      showNotification(`Navegado para página ${pageNum}`, 'success');
    });
  });
}

// Simple notification function
function showNotification(message, type = 'info') {
  // Create temporary notification
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-4 py-3 rounded-lg text-white text-sm font-medium z-50 animate-pulse ${
    type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-america-red' : 'bg-america-blue'
  }`;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Download PDF
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = '/Catálogo América 2026 COMPLETO.pdf';
  link.download = 'Catálogo América 2026 COMPLETO.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showNotification('Download iniciado!', 'success');
});

// Print PDF
printBtn.addEventListener('click', () => {
  const printWindow = window.open('/Catálogo América 2026 COMPLETO.pdf', '_blank');
  if (printWindow) {
    printWindow.print();
  }
});

// Handle page input (click on page number to jump)
pageNumSpan.addEventListener('click', () => {
  const input = prompt(`Digite o número da página (1-${pdfState.totalPages}):`);
  if (input) {
    const pageNum = parseInt(input, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pdfState.totalPages) {
      renderPage(pageNum);
    }
  }
});

// Mobile menu functionality
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');
const menuLinks = document.querySelectorAll('#mobileMenu a');

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    overlay.classList.remove('hidden');
  });
}

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.add('hidden');
  });
}

if (overlay) {
  overlay.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.add('hidden');
  });
}

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.add('hidden');
  });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initPDF();
});
