// Windows XP Wishlist JavaScript
// Best viewed in Internet Explorer 6.0!

// Store wishlist items globally
let wishlistItems = [];
let throbberInterval = null;
let throbberStartTime = null;

// Load wishlist data when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadWishlist();
  loadGuestbook();
  setLastUpdated();
  trackSiteVisit();
  initWindowControls();
  initRandomMarquee();
  initTaskbarClock();
  initMenuSounds();
  startThrobber();
});

// ASCII Throbber Animation
const throbberFrames = ['|', '/', '-', '\\'];
let throbberIndex = 0;

function startThrobber() {
  throbberStartTime = Date.now();
  const throbberEl = document.getElementById('loading-throbber');
  if (throbberEl) {
    throbberInterval = setInterval(() => {
      throbberEl.textContent = throbberFrames[throbberIndex];
      throbberIndex = (throbberIndex + 1) % throbberFrames.length;
    }, 150);
  }
}

function stopThrobber() {
  if (throbberInterval) {
    // Keep throbber visible for at least 1500ms so it's actually visible
    const elapsed = Date.now() - throbberStartTime;
    const minDisplayTime = 1500;
    const delay = Math.max(0, minDisplayTime - elapsed);

    setTimeout(() => {
      clearInterval(throbberInterval);
      throbberInterval = null;
    }, delay);
  }
}

// Load wishlist from JSON file
async function loadWishlist() {
  const container = document.getElementById('wishlist-container');

  try {
    const response = await fetch('wishlist-data.json');
    if (!response.ok) throw new Error('Failed to load');

    wishlistItems = await response.json();
    stopThrobber();
    renderWishlist(wishlistItems);
    updateItemCount();
  } catch (error) {
    console.error('Error loading wishlist:', error);
    stopThrobber();
    container.innerHTML = `
      <div class="loading">
        <p>*** Oops! Could not load wishlist ***</p>
        <p style="font-size: 10px;">Make sure wishlist-data.json is in the same folder!</p>
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
        <p>*** No items yet! ***</p>
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
    high: '>>> TOP PICK <<<',
    medium: '<3 WANT! <3',
    low: '* Nice *'
  };

  return `
    <div class="wishlist-item" data-priority="${item.priority}">
      <span class="priority-badge priority-${item.priority}">
        ${priorityLabels[item.priority] || '* Nice *'}
      </span>
      <img
        src="${item.image}"
        alt="${item.name}"
        class="item-image"
        onerror="this.src='https://via.placeholder.com/150x150/ECE9D8/000000?text=No+Image'"
      >
      <h3 class="item-name">${item.name}</h3>
      <p class="item-description">${item.description}</p>
      <p class="item-price">${item.price}</p>
      ${item.link ? `<a href="${item.link}" target="_blank" class="item-link">[ Get it here ]</a>` : ''}
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
}

// Update item count in status bar
function updateItemCount() {
  const countEl = document.getElementById('item-count');
  if (countEl) {
    countEl.textContent = wishlistItems.length;
  }
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

// Track actual site visits using localStorage
function trackSiteVisit() {
  // Get or initialize visit count
  let visitCount = localStorage.getItem('siteVisitCount');

  if (!visitCount) {
    // First time visitor - start from a retro number
    visitCount = 1337;
  } else {
    visitCount = parseInt(visitCount) + 1;
  }

  // Save the new count
  localStorage.setItem('siteVisitCount', visitCount);

  // Update both locations
  const countEl = document.getElementById('visitor-count');
  const countStatusEl = document.getElementById('visitor-count-status');

  if (countEl) {
    countEl.textContent = visitCount;
  }
  if (countStatusEl) {
    countStatusEl.textContent = visitCount;
  }
}

// ==================== MENU BAR SOUNDS ====================

let audioContext = null;
let currentOscillator = null;
let currentGain = null;

// Pentatonic scale frequencies (C D E G A in Hz)
const pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00];

function initMenuSounds() {
  const menuItems = document.querySelectorAll('.xp-menu-item');

  menuItems.forEach((item, index) => {
    // Use modulo to cycle through pentatonic scale
    const frequency = pentatonicScale[index % pentatonicScale.length];

    // Mouse events
    item.addEventListener('mousedown', () => {
      playSawWave(frequency);
    });

    item.addEventListener('mouseup', () => {
      stopSawWave();
    });

    item.addEventListener('mouseleave', () => {
      stopSawWave();
    });

    // Touch events for mobile
    item.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Prevent mouse events from firing
      playSawWave(frequency);
    });

    item.addEventListener('touchend', (e) => {
      e.preventDefault();
      stopSawWave();
    });

    item.addEventListener('touchcancel', () => {
      stopSawWave();
    });
  });
}

function playSawWave(frequency) {
  // Stop any currently playing sound
  stopSawWave();

  // Create audio context if needed
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Create oscillator and gain nodes
  currentOscillator = audioContext.createOscillator();
  currentGain = audioContext.createGain();

  // Configure sawtooth wave
  currentOscillator.type = 'sawtooth';
  currentOscillator.frequency.value = frequency;

  // Set volume (not too loud)
  currentGain.gain.value = 0.15;

  // Connect nodes: oscillator -> gain -> destination
  currentOscillator.connect(currentGain);
  currentGain.connect(audioContext.destination);

  // Start playing
  currentOscillator.start();
}

function stopSawWave() {
  if (currentOscillator) {
    currentOscillator.stop();
    currentOscillator.disconnect();
    currentOscillator = null;
  }
  if (currentGain) {
    currentGain.disconnect();
    currentGain = null;
  }
}

// Initialize XP Window Controls
function initWindowControls() {
  const minimizeBtn = document.querySelector('.xp-minimize');
  const maximizeBtn = document.querySelector('.xp-maximize');
  const closeBtn = document.querySelector('.xp-close');
  const xpWindow = document.querySelector('.xp-window');
  const xpContent = document.querySelector('.xp-content');

  let isMinimized = false;
  let isMaximized = false;

  // Minimize button - hides content and cancels maximize
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', function() {
      // If maximized, un-maximize first
      if (isMaximized) {
        isMaximized = false;
        xpWindow.classList.remove('maximized');
        maximizeBtn.textContent = '□';
      }

      // Toggle minimize
      isMinimized = !isMinimized;

      if (isMinimized) {
        xpContent.style.display = 'none';
        minimizeBtn.textContent = '□';
      } else {
        xpContent.style.display = 'block';
        minimizeBtn.textContent = '_';
      }
    });
  }

  // Maximize button - toggles fullscreen and cancels minimize
  if (maximizeBtn) {
    maximizeBtn.addEventListener('click', function() {
      // If minimized, restore first
      if (isMinimized) {
        isMinimized = false;
        xpContent.style.display = 'block';
        minimizeBtn.textContent = '_';
      }

      // Toggle maximize
      isMaximized = !isMaximized;
      xpWindow.classList.toggle('maximized');

      if (isMaximized) {
        maximizeBtn.textContent = '❐';
      } else {
        maximizeBtn.textContent = '□';
      }
    });
  }

  // Close button - Easter egg
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      document.body.innerHTML = `
        <div style="
          background: #5A7EBF;
          color: white;
          padding: 40px;
          font-family: Tahoma, Verdana, sans-serif;
          text-align: center;
          font-size: 14px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        ">
          <div style="
            background: white;
            color: black;
            padding: 20px 30px;
            border: 3px solid;
            border-color: #FFFFFF #716F64 #716F64 #FFFFFF;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
            max-width: 400px;
          ">
            <h1 style="margin: 0 0 15px 0; font-size: 16px;">Window Closed</h1>
            <p style="margin: 10px 0; font-size: 11px;">Thank you for visiting my wishlist!</p>
            <p style="margin: 10px 0; font-size: 11px;">Press F5 or click Refresh to return.</p>
            <div style="text-align: center; margin-top: 20px;">
              <button onclick="location.reload()" style="
                font-family: Tahoma, Verdana, sans-serif;
                font-size: 11px;
                padding: 4px 12px;
                background: #ECE9D8;
                border: 2px solid;
                border-color: #FFFFFF #716F64 #716F64 #FFFFFF;
                cursor: pointer;
                min-width: 80px;
              ">[ OK ]</button>
            </div>
          </div>
        </div>
      `;
    });
  }
}

// Easter egg: Konami code activates Windows XP startup sound alert
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join(',') === konamiSequence.join(',')) {
    activateXPMode();
  }
});

// XP Mode easter egg
function activateXPMode() {
  alert('*** WINDOWS XP ACTIVATED ***\n\nWelcome to Windows XP!\n\nSystem Information:\nOS: Windows XP Professional\nBuild: 2600.xpsp_sp3_gdr.130821-1623\nProcessor: Intel Pentium 4\nMemory: 512 MB RAM');

  // Add XP logo watermark temporarily
  const watermark = document.createElement('div');
  watermark.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 15px;
    font-family: Tahoma, Verdana, sans-serif;
    font-size: 11px;
    border: 2px solid #888;
    z-index: 10000;
  `;
  watermark.textContent = 'Windows XP Professional - Build 2600';
  document.body.appendChild(watermark);

  setTimeout(() => {
    watermark.remove();
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

// ==================== TASKBAR CLOCK ====================

function initTaskbarClock() {
  updateTaskbarClock();
  setInterval(updateTaskbarClock, 1000); // Update every second
}

function updateTaskbarClock() {
  const clockEl = document.getElementById('xp-clock');
  if (!clockEl) return;

  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12

  // Format with leading zeros
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  clockEl.textContent = `${hours}:${minutesStr} ${ampm}`;
}

// ==================== RANDOM MARQUEE MESSAGES ====================

const marqueeMessages = [
  '♥ Welcome to my wishlist page! ♥ Thanks for stopping by! ♥ Pick something nice for me! ♥',
  '*** Under Construction *** Site best viewed in 800x600 *** GeoCities Approved ***',
  'This is site visit #<VISITOR>! *** Thanks for visiting! *** Sign my guestbook!',
  '=^..^= <--- Cat walking across your screen =^..^=',
  '<:3)~~~ <--- Mouse scurrying by <:3)~~~',
  '---{ ======= Spaceship flying ======= }---',
  '\\o/ \\o/ \\o/ Wave to your screen! \\o/ \\o/ \\o/',
  '(>")> <(\"<) <(")> Kirby dance party! (>")> <(\"<)',
  '*** FREE STUFF *** Just kidding, but seriously, gift ideas here! ***',
  '(..) (..) (..) Counting sheep to help you relax... (..) (..) Zzz...',
  '<o)))>< Fish swimming by <o)))><  ~~ ~~ ~~',
  '*** NEW ITEMS ADDED *** Check out the latest additions! ***',
  '@>-->-- Rose for you @>-->-- Hope you find something nice! @>-->--',
  '=^_^= Nyan cat says: Meow! Pick a gift! =^_^=',
  '*** UPDATED DAILY *** Well, almost daily *** OK, sometimes ***',
  '(\_/) (\\_/) Bunnies hopping through (\\=/,=/) (\\=/,=/) (\\=/,=/)',
  '>>> SCROLL TEXT SIMULATOR 2003 <<< Authentic Retro Vibes >>>',
  '<@:) <@:) Penguins waddling past <@:) <@:)',
  '*** WebRing Member *** Check out cool sites! *** Geocities Forever ***',
  '~~ Wave ~~ ~~ Wave ~~ Ocean sounds... Relaxing... ~~ Wave ~~'
];

function initRandomMarquee() {
  const marquee = document.getElementById('scrolling-marquee');
  if (!marquee) return;

  // Change message every 15 seconds for variety
  setInterval(() => {
    changeMarqueeText();
  }, 15000);
}

function changeMarqueeText() {
  const marquee = document.getElementById('scrolling-marquee');
  if (!marquee) return;

  // Pick a random message (different from current if possible)
  const currentText = marquee.innerHTML;
  let newMessage;

  do {
    newMessage = marqueeMessages[Math.floor(Math.random() * marqueeMessages.length)];
    const visitCount = localStorage.getItem('siteVisitCount') || '1337';
    newMessage = newMessage.replace('<VISITOR>', visitCount);
  } while (newMessage === currentText && marqueeMessages.length > 1);

  // Update the marquee content
  marquee.innerHTML = newMessage;
}
