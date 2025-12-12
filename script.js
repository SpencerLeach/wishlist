// ~*~ Y2K Wishlist JavaScript ~*~
// Best viewed in Netscape Navigator 4.0!

// Store wishlist items globally
let wishlistItems = [];

// Load wishlist data when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadWishlist();
  initSparkleTrail();
  setLastUpdated();
  randomizeVisitorCount();
});

// Load wishlist from JSON file
async function loadWishlist() {
  const container = document.getElementById('wishlist-container');

  try {
    const response = await fetch('wishlist-data.json');
    if (!response.ok) throw new Error('Failed to load');

    wishlistItems = await response.json();
    renderWishlist(wishlistItems);
  } catch (error) {
    console.error('Error loading wishlist:', error);
    container.innerHTML = `
      <div class="loading">
        <p>~*~ Oops! Could not load wishlist ~*~</p>
        <p style="font-size: 0.8rem;">Make sure wishlist-data.json is in the same folder!</p>
      </div>
    `;
  }
}

// Render wishlist items to the page
function renderWishlist(items) {
  const container = document.getElementById('wishlist-container');

  if (items.length === 0) {
    container.innerHTML = `
      <div class="loading">
        <p>~*~ No items yet! ~*~</p>
        <p>Add some wishes to wishlist-data.json</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => createItemCard(item)).join('');
}

// Create HTML for a single item card
function createItemCard(item) {
  const priorityLabels = {
    high: '🔥 Top Pick!',
    medium: '💖 Want!',
    low: '✨ Nice'
  };

  return `
    <div class="wishlist-item" data-priority="${item.priority}">
      <span class="priority-badge priority-${item.priority}">
        ${priorityLabels[item.priority] || '✨'}
      </span>
      <img
        src="${item.image}"
        alt="${item.name}"
        class="item-image"
        onerror="this.src='https://via.placeholder.com/150x150/ff69b4/ffffff?text=No+Image'"
      >
      <h3 class="item-name">${item.name}</h3>
      <p class="item-description">${item.description}</p>
      <p class="item-price">${item.price}</p>
      ${item.link ? `<a href="${item.link}" target="_blank" class="item-link">✨ Get it here! ✨</a>` : ''}
    </div>
  `;
}

// Filter items by priority
function filterItems(priority) {
  const items = document.querySelectorAll('.wishlist-item');

  items.forEach(item => {
    if (priority === 'all' || item.dataset.priority === priority) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });

  // Add a fun sound effect (visual feedback instead)
  const buttons = document.querySelectorAll('.y2k-button');
  buttons.forEach(btn => btn.style.transform = 'scale(1)');
}

// Sparkle cursor trail effect - very Y2K!
function initSparkleTrail() {
  const sparkleContainer = document.getElementById('sparkle-container');
  const sparkles = ['✨', '⭐', '💫', '🌟', '✧', '★'];

  let lastSparkleTime = 0;
  const sparkleDelay = 50; // ms between sparkles

  document.addEventListener('mousemove', function(e) {
    const now = Date.now();
    if (now - lastSparkleTime < sparkleDelay) return;
    lastSparkleTime = now;

    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    sparkle.style.left = (e.clientX - 10) + 'px';
    sparkle.style.top = (e.clientY - 10) + 'px';
    sparkle.style.color = getRandomColor();

    sparkleContainer.appendChild(sparkle);

    // Remove sparkle after animation
    setTimeout(() => sparkle.remove(), 1000);
  });
}

// Get random Y2K color
function getRandomColor() {
  const colors = ['#ff69b4', '#00ffff', '#ffff00', '#ff1493', '#00ff00', '#9932cc'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Set the last updated date
function setLastUpdated() {
  const dateEl = document.getElementById('last-updated');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// Randomize visitor count for authentic Y2K feel
function randomizeVisitorCount() {
  const countEl = document.getElementById('visitor-count');
  if (countEl) {
    // Generate a "realistic" looking visitor count
    const baseCount = 1337;
    const randomAdd = Math.floor(Math.random() * 500);
    countEl.textContent = baseCount + randomAdd;
  }
}

// Easter egg: Konami code!
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join(',') === konamiSequence.join(',')) {
    activatePartyMode();
  }
});

// Party mode easter egg!
function activatePartyMode() {
  document.body.style.animation = 'rainbow-bg 0.5s linear infinite';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes rainbow-bg {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  alert('🎉 PARTY MODE ACTIVATED! 🎉');

  // Stop after 10 seconds
  setTimeout(() => {
    document.body.style.animation = '';
  }, 10000);
}
