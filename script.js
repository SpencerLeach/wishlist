// ~*~ Y2K Wishlist JavaScript ~*~
// Best viewed in Netscape Navigator 4.0!

// Store wishlist items globally
let wishlistItems = [];

// Load wishlist data when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadWishlist();
  loadGuestbook();
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

// ==================== GUESTBOOK CANVAS ====================

const CANVAS_COLS = 60;
const CANVAS_ROWS = 18;
let canvasGrid = [];
let cursorX = 0;
let cursorY = 0;
let cursorElement = null;
let saveTimeout = null;

// Initialize empty canvas grid
function initCanvasGrid() {
  canvasGrid = [];
  for (let y = 0; y < CANVAS_ROWS; y++) {
    canvasGrid[y] = [];
    for (let x = 0; x < CANVAS_COLS; x++) {
      canvasGrid[y][x] = ' ';
    }
  }
}

// Load guestbook canvas
async function loadGuestbook() {
  const canvas = document.getElementById('guestbook-canvas');
  initCanvasGrid();

  try {
    const response = await fetch('guestbook.php');
    if (response.ok) {
      const data = await response.json();
      if (data.grid && Array.isArray(data.grid)) {
        // Load saved grid
        for (let y = 0; y < Math.min(data.grid.length, CANVAS_ROWS); y++) {
          for (let x = 0; x < Math.min(data.grid[y].length, CANVAS_COLS); x++) {
            canvasGrid[y][x] = data.grid[y][x] || ' ';
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading guestbook:', error);
  }

  renderCanvas();
  setupCanvasEvents();
}

// Render the canvas grid
function renderCanvas() {
  const canvas = document.getElementById('guestbook-canvas');

  // Build text content
  let content = '';
  for (let y = 0; y < CANVAS_ROWS; y++) {
    for (let x = 0; x < CANVAS_COLS; x++) {
      content += canvasGrid[y][x];
    }
    if (y < CANVAS_ROWS - 1) content += '\n';
  }

  canvas.textContent = content;

  // Add cursor
  if (!cursorElement) {
    cursorElement = document.createElement('div');
    cursorElement.className = 'canvas-cursor';
    canvas.appendChild(cursorElement);
  }
  updateCursorPosition();
}

// Update cursor visual position
function updateCursorPosition() {
  if (!cursorElement) return;
  const charWidth = 8.4;  // Approximate monospace char width
  const lineHeight = 16.8; // Line height
  cursorElement.style.left = (10 + cursorX * charWidth) + 'px';
  cursorElement.style.top = (10 + cursorY * lineHeight) + 'px';
}

// Setup canvas event listeners
function setupCanvasEvents() {
  const canvas = document.getElementById('guestbook-canvas');

  // Click to position cursor
  canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 10;
    const y = e.clientY - rect.top - 10;

    const charWidth = 8.4;
    const lineHeight = 16.8;

    cursorX = Math.max(0, Math.min(CANVAS_COLS - 1, Math.floor(x / charWidth)));
    cursorY = Math.max(0, Math.min(CANVAS_ROWS - 1, Math.floor(y / lineHeight)));

    updateCursorPosition();
    canvas.focus();
  });

  // Keyboard input
  canvas.addEventListener('keydown', function(e) {
    // Prevent default for most keys
    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete' ||
        e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
        e.key === 'Enter') {
      e.preventDefault();
    }

    if (e.key === 'Backspace') {
      // Move back and delete
      if (cursorX > 0) {
        cursorX--;
      } else if (cursorY > 0) {
        cursorY--;
        cursorX = CANVAS_COLS - 1;
      }
      canvasGrid[cursorY][cursorX] = ' ';
      scheduleAutoSave();
    } else if (e.key === 'Delete') {
      canvasGrid[cursorY][cursorX] = ' ';
      scheduleAutoSave();
    } else if (e.key === 'ArrowLeft') {
      if (cursorX > 0) cursorX--;
    } else if (e.key === 'ArrowRight') {
      if (cursorX < CANVAS_COLS - 1) cursorX++;
    } else if (e.key === 'ArrowUp') {
      if (cursorY > 0) cursorY--;
    } else if (e.key === 'ArrowDown') {
      if (cursorY < CANVAS_ROWS - 1) cursorY++;
    } else if (e.key === 'Enter') {
      if (cursorY < CANVAS_ROWS - 1) {
        cursorY++;
        cursorX = 0;
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      // Type character
      canvasGrid[cursorY][cursorX] = e.key;
      cursorX++;
      if (cursorX >= CANVAS_COLS) {
        cursorX = 0;
        if (cursorY < CANVAS_ROWS - 1) cursorY++;
      }
      scheduleAutoSave();
    }

    renderCanvas();
  });
}

// Auto-save after typing stops
function scheduleAutoSave() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveCanvas, 1000);
}

// Save canvas to server
async function saveCanvas() {
  try {
    const response = await fetch('guestbook.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grid: canvasGrid })
    });
    if (!response.ok) throw new Error('Failed to save');
  } catch (error) {
    console.error('Error saving canvas:', error);
  }
}
