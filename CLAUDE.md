# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is sleach.me - Spencer's personal portfolio site with a Windows XP desktop aesthetic. The site features a desktop landing page with clickable folder icons that navigate to different sections. Currently implemented: Wishlist page. Coming soon: Projects, About Me.

## Architecture

### Site Structure
```
/                    → Desktop landing page (index.html)
/wishlist/           → Wishlist page (subfolder)
/projects/           → (Coming soon)
/about/              → (Coming soon)
```

### Root Files
- **index.html** - Windows XP desktop landing page with folder icons and taskbar
  - Bliss wallpaper background with clouds and rolling hills
  - Desktop icons linking to subpages
  - XP taskbar with Start button and clock
  - Aggressive preloading for instant navigation

### Wishlist Files (/wishlist/)
- **index.html** - XP window-styled wishlist page
- **styles.css** - Windows XP Luna theme CSS with blue/beige color palette
- **script.js** - Client-side JavaScript for wishlist, guestbook, menu sounds, window controls
- **guestbook.php** - Server-side PHP API for persisting guestbook canvas data
- **wishlist-data.json** - JSON array of wishlist items with priority levels
- **guestbook-data.json** - Server-generated file storing guestbook canvas grid state

### Data Flow

**Wishlist Items:**
1. `wishlist-data.json` contains array of items with: id, name, description, price, link, image URL, priority
2. `script.js` fetches JSON on page load
3. Items are rendered as cards in a responsive grid
4. Client-side filtering by priority (all/high/medium/low) using data attributes

**Guestbook Canvas:**
1. Character-based drawing canvas (60 cols × 18 rows monospace grid)
2. Click to position cursor, type to draw, backspace to delete
3. Auto-saves to server via `guestbook.php` after 1 second of inactivity
4. PHP stores/retrieves grid state from `guestbook-data.json`

### Key Features

**Desktop Landing Page:**
- Windows XP Bliss wallpaper (blue sky with clouds and rolling green hills)
- Clickable folder icons with XP styling and hover effects
- Functional XP taskbar with Start button and live clock
- Aggressive preloading (prefetch tags + hover preload + idle preload)
- Fully mobile-responsive with touch-friendly icon sizes

**Wishlist Page:**
- Full XP window chrome (title bar, menu bar, status bar)
- Functional window controls (minimize, maximize, close)
- Menu bar sounds: Each menu item plays a sawtooth wave note on mousedown/touch
  - File = C, Edit = D, View = E, Favorites = G, Help = A (pentatonic scale)
- Priority-based wishlist filtering
- Working site visit counter (localStorage-based, starts at 1337)
- Random rotating marquee messages with ASCII art animals
- ASCII throbber for loading states
- Konami code easter egg (↑↑↓↓←→←→BA) shows XP system info alert

**Guestbook Canvas:**
- Character-based drawing canvas (60 cols × 18 rows)
- Click to position cursor, type to draw, backspace to delete
- Auto-saves to server after 1 second of inactivity
- XP Notepad styling (white background, black text)

## Development

### Local Testing

This is a static site with one PHP endpoint. To run locally:

```bash
# Option 1: PHP built-in server (recommended)
php -S localhost:8000

# Option 2: Any static file server (guestbook won't persist)
python -m http.server 8000
```

Then visit `http://localhost:8000`

### Adding Wishlist Items

Edit `wishlist-data.json` and add new objects to the array:

```json
{
  "id": 6,
  "name": "Item Name",
  "description": "Item description",
  "price": "$XX",
  "link": "https://example.com/product",
  "image": "https://example.com/image.jpg",
  "priority": "high"  // or "medium" or "low"
}
```

Priority levels determine badge styling and filtering behavior.

### Styling Conventions

**Windows XP Luna Theme:**
- Blue/beige color palette defined in CSS variables
  - `--xp-blue-light: #3C8EF3`, `--xp-blue-dark: #0058E6`
  - `--xp-button-face: #ECE9D8` (beige)
- Tahoma/Verdana font stack (authentic XP fonts)
- 3D button effects using border-color tricks (raised/inset)
- Bliss wallpaper gradient (blue sky → green hill)
- No modern CSS3 effects (no border-radius except where XP had it)
- Maintain XP elements: window chrome, taskbar, desktop icons, folder styling

### Guestbook System

The canvas uses a 2D character array (`canvasGrid[y][x]`) where:
- Each cell stores a single character
- Cursor position tracked in `cursorX`, `cursorY`
- Character dimensions: ~8.4px width, ~16.8px line height
- PHP endpoint handles GET (load) and POST (save) operations

## File Structure Conventions

- No build process required - vanilla HTML/CSS/JS
- Multi-page architecture with subfolder structure
- Desktop landing page at root (`/`)
- Each section in its own subfolder (`/wishlist/`, `/projects/`, etc.)
- Images referenced via external URLs (no local images directory)
- Data files live in their respective subfolders
- Window controls (X button) navigate back to desktop (`/`)

## Navigation Flow

```
Desktop (/)
  ↓ Click folder icon
Wishlist (/wishlist/)
  ↓ Click X button
Desktop (/)
```

## Preloading Strategy

The desktop landing page uses aggressive preloading:
1. **HTML prefetch tags** - Browser prefetches resources in background
2. **Hover preloading** - Fetch page when hovering over icon
3. **Idle preloading** - Fetch after 1 second of inactivity

This ensures sub-100ms navigation times for excellent UX.
