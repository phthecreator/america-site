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
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const zoomLevelSpan = document.getElementById('zoom-level');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const downloadBtn = document.getElementById('download-pdf');
const printBtn = document.getElementById('print-pdf');
const loadingDiv = document.getElementById('loading');
const canvasWrapper = document.querySelector('.pdf-canvas-wrapper');

// Initialize PDF Viewer
async function initPDF() {
  try {
    loadingDiv.classList.remove('hidden');

    // Load PDF from public folder
    const pdfPath = '/catalogo-2026.pdf';

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
        <p class="text-xs text-slate-500 mt-4">Verifique se o arquivo catalogo-2026.pdf existe em /public</p>
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
    const baseScale = 1.5; // Larger base scale for better visibility
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

  prevBtn.classList.toggle('opacity-50', pdfState.currentPage <= 1);
  nextBtn.classList.toggle('opacity-50', pdfState.currentPage >= pdfState.totalPages);
}

// Navigation
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

// Keyboard navigation
document.addEventListener('keydown', async (e) => {
  if (e.key === 'ArrowLeft') {
    prevBtn.click();
  } else if (e.key === 'ArrowRight') {
    nextBtn.click();
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

// Search functionality
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
    return;
  }

  pdfState.searchText = text.toLowerCase();
  pdfState.searchMatches = [];
  pdfState.currentSearchIndex = 0;

  // Search through all pages
  try {
    for (let pageNum = 1; pageNum <= pdfState.totalPages; pageNum++) {
      const page = await pdfState.pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Check if search text appears on this page
      let pageText = '';
      for (const item of textContent.items) {
        if ('str' in item) {
          pageText += item.str + ' ';
        }
      }

      if (pageText.toLowerCase().includes(pdfState.searchText)) {
        pdfState.searchMatches.push(pageNum);
      }
    }

    // Navigate to first match
    if (pdfState.searchMatches.length > 0) {
      await renderPage(pdfState.searchMatches[0]);
      searchInput.classList.remove('ring-red-500');
      searchInput.classList.add('ring-2', 'ring-america-blue');
    } else {
      searchInput.classList.remove('ring-america-blue');
      searchInput.classList.add('ring-2', 'ring-red-500');
      alert(`Nenhum resultado encontrado para "${text}"`);
    }
  } catch (error) {
    console.error('Erro ao buscar:', error);
  }
}

// Download PDF
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = '/catalogo-2026.pdf';
  link.download = 'catalogo-2026-america-industria.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Print PDF
printBtn.addEventListener('click', () => {
  const printWindow = window.open('/catalogo-2026.pdf', '_blank');
  printWindow.print();
});

// Handle page input (optional - direct page navigation)
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
