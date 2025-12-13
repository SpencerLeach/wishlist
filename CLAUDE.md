# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Y2K-themed (early 2000s retro aesthetic) personal wishlist website. The site features a nostalgic design with rainbow gradients, sparkle cursor effects, marquee banners, and an interactive guestbook canvas where visitors can leave messages.

## Architecture

### Core Files
- **index.html** - Single-page application with static HTML structure
- **styles.css** - Y2K-themed CSS with rainbow gradients, animations, and retro effects
- **script.js** - Client-side JavaScript handling wishlist rendering, filtering, guestbook canvas, and visual effects
- **guestbook.php** - Server-side PHP API for persisting guestbook canvas data
- **wishlist-data.json** - JSON array of wishlist items with priority levels (high/medium/low)
- **guestbook-data.json** - Server-generated file storing guestbook canvas grid state (created at runtime)

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

**Visual Effects:**
- Sparkle cursor trail (`initSparkleTrail()`)
- Rainbow text animation on header
- Hover effects with scale transforms and glow
- Konami code easter egg (↑↑↓↓←→←→BA) activates rainbow background animation

**Interactive Elements:**
- Priority-based filtering buttons
- Randomized visitor counter (1337 + random)
- Guestbook canvas with visual cursor and keyboard navigation
- Auto-updating "last updated" date in footer

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

- Y2K aesthetic with neon colors defined in CSS variables (`--pink`, `--cyan`, `--yellow`, etc.)
- Comic Sans-inspired font stack (`'Comic Neue'`, `'Comic Sans MS'`)
- Heavy use of gradients, ridge/groove/inset borders, and glow effects
- Maintain nostalgic elements: marquee, blink animation, "under construction" messaging

### Guestbook System

The canvas uses a 2D character array (`canvasGrid[y][x]`) where:
- Each cell stores a single character
- Cursor position tracked in `cursorX`, `cursorY`
- Character dimensions: ~8.4px width, ~16.8px line height
- PHP endpoint handles GET (load) and POST (save) operations

## File Structure Conventions

- No build process required - vanilla HTML/CSS/JS
- Images referenced via external URLs (no local images directory currently exists)
- Data files (`wishlist-data.json`, `guestbook-data.json`) live in root directory
- Single-page architecture - all content on `index.html`
