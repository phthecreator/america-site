import './styles/globals.css';

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');

// Function to close menu
function closeMenu() {
  mobileMenu.classList.remove('translate-x-0');
  mobileMenu.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
}

// Open menu
menuBtn.addEventListener('click', () => {
  mobileMenu.classList.remove('-translate-x-full');
  mobileMenu.classList.add('translate-x-0');
  overlay.classList.remove('hidden');
});

// Close menu with button
closeBtn.addEventListener('click', closeMenu);

// Close menu when clicking overlay
overlay.addEventListener('click', closeMenu);

// Close menu when clicking on links
document.querySelectorAll('#mobileMenu a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close menu on window resize (if viewport becomes large)
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    closeMenu();
  }
});
