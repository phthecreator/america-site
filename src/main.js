import './styles/globals.css';

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');

// Function to close menu
function closeMenu() {
  mobileMenu.style.transform = 'translateX(100%)';
  overlay.classList.add('hidden');
}

// Open menu
menuBtn.addEventListener('click', () => {
  mobileMenu.style.transform = 'translateX(0)';
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
