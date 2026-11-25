/**
 * Alternância claro/escuro.
 * - Sem escolha salva, o site segue o aparelho (prefers-color-scheme).
 * - A escolha do visitante fica no localStorage (só neste navegador).
 * - O <head> de cada página aplica o tema antes de pintar (evita piscar); aqui só ligamos o botão.
 */

const STORAGE_KEY = 'am-theme';
const media = window.matchMedia('(prefers-color-scheme: dark)');

/** @returns {'light'|'dark'} tema efetivo agora */
function currentTheme() {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return media.matches ? 'dark' : 'light';
}

/** Atualiza rótulo acessível e cor da barra do navegador */
function syncUi() {
  const theme = currentTheme();
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(theme === 'dark'));
    btn.setAttribute('aria-label', theme === 'dark' ? 'Usar modo claro' : 'Usar modo escuro');
    btn.title = theme === 'dark' ? 'Modo claro' : 'Modo escuro';
  });
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b1233' : '#fcfcfa');
}

/** @param {'light'|'dark'} theme */
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* modo privado / armazenamento bloqueado: vale só nesta visita */
  }
  syncUi();
}

document.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-theme-toggle]');
  if (!btn) return;
  setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
});

media.addEventListener('change', syncUi);
syncUi();
