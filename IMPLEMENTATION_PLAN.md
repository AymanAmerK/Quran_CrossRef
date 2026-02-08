# QuranViz Pro Implementation Plan

## Context
The user has a `quran_links.js` file containing cross-reference connections between Quranic verses (411.9KB data file). The goal is to build a **mobile-first web application** that visualizes these connections in two distinct viewing modes: a "Study Mode" for analytical verse-by-verse exploration, and a "Reading Mode" for authentic Mushaf-style paginated reading. The app must work without any build step and run directly in modern browsers using vanilla HTML, CSS, and JavaScript.

## Core Technical Architecture

### File Structure
```
quranlinks_claude/
├── index.html                 # Main HTML file
├── css/
│   ├── variables.css         # CSS variables for theming
│   ├── base.css              # Reset, typography, base styles
│   ├── components.css        # Reusable UI components
│   ├── study-mode.css        # Study Mode specific styles
│   ├── reading-mode.css      # Reading Mode specific styles
│   └── responsive.css        # Media queries
├── js/
│   ├── data/
│   │   ├── surah-names.js    # SURAH_NAMES array (114 surahs)
│   │   └── page-map.js       # PAGE_MAP array (604 pages)
│   ├── services/
│   │   ├── api-service.js    # API calls and caching
│   │   └── storage-service.js # localStorage management
│   ├── state/
│   │   └── app-state.js      # Global state management
│   ├── utils/
│   │   ├── helpers.js        # Helper functions
│   │   └── connections.js    # Connection lookup logic
│   ├── views/
│   │   ├── study-mode.js     # Study Mode rendering
│   │   └── reading-mode.js   # Reading Mode rendering
│   ├── components/
│   │   ├── navigation.js     # Navigation components
│   │   ├── search.js         # Search functionality
│   │   ├── bookmarks.js      # Bookmarks management
│   │   └── settings.js       # Settings panel
│   └── app.js                # Main app initialization
└── quran_links.js            # Existing connections data (user will populate)
```

**Note**: User will manually add content to `quran_links.js` - we create the file structure around it.

### Key Technical Constraints
1. **No build step** - vanilla HTML/CSS/JS only (ES6 modules)
2. **Mobile-first** - touch-optimized, portrait-first design
3. **Two distinct view modes** with different data presentation logic
4. **External API integration** - Al Quran Cloud API (api.alquran.cloud)
5. **localStorage** for bookmarks and settings persistence
6. **Modular architecture** - Separate concerns into logical files for maintainability

## Module Architecture & Data Flow

### Initialization Flow
1. `index.html` loads with `<script type="module" src="js/app.js">`
2. `app.js` imports all necessary modules
3. On `DOMContentLoaded`:
   - Load settings from localStorage via `storage-service.js`
   - Initialize `AppState` with loaded settings
   - Apply theme, font size, language preferences
   - Initialize all UI components (navigation, search, bookmarks, settings)
   - Load last viewed position or default to Al-Fatihah
   - Render initial view (Study or Reading mode)

### Module Dependencies
```
app.js (main orchestrator)
├── state/app-state.js (imported by most modules)
├── services/api-service.js (used by views)
├── services/storage-service.js (used by app.js, components)
├── data/surah-names.js (used by navigation, views)
├── data/page-map.js (used by reading-mode, navigation)
├── utils/helpers.js (used everywhere)
├── utils/connections.js (used by views)
├── views/study-mode.js
├── views/reading-mode.js
├── components/navigation.js
├── components/search.js
├── components/bookmarks.js
└── components/settings.js

External:
└── quran_links.js (loaded as global QURAN_LINKS variable)
```

### Communication Between Modules
- **State Updates**: Components call `AppState.update(key, value)` which triggers re-renders
- **View Switching**: Navigation component updates `AppState.viewMode`, views listen and re-render
- **API Calls**: All API requests go through `api-service.js` for consistent caching
- **Storage**: All localStorage operations through `storage-service.js` for consistency

## Implementation Components

### 1. Data Layer

#### Hardcoded Data to Embed
```javascript
// SURAH_NAMES array (114 entries)
const SURAH_NAMES = [
  { number: 1, nameArabic: "الفاتحة", nameEnglish: "Al-Fatihah", verses: 7 },
  { number: 2, nameArabic: "البقرة", nameEnglish: "Al-Baqarah", verses: 286 },
  // ... all 114 surahs with verse counts
];

// QURAN_LINKS object (from quran_links.js)
const QURAN_LINKS = {
  "1:1": [{"surah": 27, "verse": 30, "type": "Parallel"}],
  // ... entire links object
};
```

#### API Integration Strategy
- **Base URL**: `https://api.alquran.cloud/v1/`
- **Endpoints**:
  - Reading Mode: `page/{pageNumber}/quran-uthmani` (Arabic text)
  - Study Mode: `surah/{surahNumber}/quran-uthmani` (Arabic text)
  - Translations: Add edition parameter (e.g., `en.sahih`) for English
  - Tafsir: Use tafsir editions like `ar.muyassar` (Arabic), `en.jalalayn` (English)

- **Fetching Strategy**:
  - Use `Promise.all()` for parallel fetches when needing both Arabic + English
  - Cache API responses in memory (session cache) to reduce redundant calls
  - Handle 404/error responses gracefully with user-friendly messages

#### Page-to-Verse Mapping
Create a hardcoded `PAGE_MAP` array that maps each of the 604 Mushaf pages to its starting verse:
```javascript
const PAGE_MAP = [
  { page: 1, surah: 1, verse: 1 },
  { page: 2, surah: 2, verse: 1 },
  // ... 604 entries
];
```
This enables "Quick Jump" to calculate which page a verse belongs to in Reading Mode.

### 2. State Management

#### Global App State Object
```javascript
const AppState = {
  viewMode: 'study', // 'study' or 'reading'
  currentSurah: 1,
  currentPage: 1,
  currentLanguage: 'ar', // 'ar' or 'en'
  theme: 'light', // 'light' or 'dark'
  fontSize: 18, // base font size in px
  bookmarks: [], // array of "surah:verse" strings
  searchResults: [],
  navigationHistory: [], // for "go back" functionality
  cache: {} // in-memory API response cache
};
```

#### State Persistence
- Use `localStorage` for: bookmarks, theme, fontSize, language, last viewed position
- Load settings on app initialization
- Save settings on each change

### 3. View Modes Implementation

#### Study Mode (Surah View)
**Layout**: Vertical scrolling container with verse cards

**Verse Card Structure**:
```html
<div class="verse-card" data-surah="2" data-verse="255" id="verse-2-255">
  <div class="verse-header">
    <span class="verse-number">255</span>
    <button class="bookmark-btn">⭐</button>
    <button class="tafsir-btn">📖</button>
  </div>
  <div class="verse-text-arabic">إِنَّ اللَّهَ...</div>
  <div class="verse-text-english">Allah - there is no deity...</div>

  <!-- Inline Connections (only if links exist) -->
  <div class="connections-section">
    <div class="connections-header">🔗 3 Connections</div>
    <div class="connection-item" data-target="3:2">
      <span class="connection-ref">3:2</span>
      <p class="connection-text">ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ...</p>
      <button class="jump-btn">→</button>
    </div>
    <!-- ... more connections -->
  </div>

  <!-- Tafsir Section (hidden by default, toggled) -->
  <div class="tafsir-section" style="display:none;">
    <p class="tafsir-text">...</p>
  </div>
</div>
```

**Key Logic**:
- Fetch surah text via API on surah selection
- For each verse, lookup `QURAN_LINKS["surah:verse"]` to find connections
- Fetch full text of connected verses via API and render inline
- Scroll to target verse when navigating from connections/search
- Add pulse animation to highlight target verse

#### Reading Mode (Page View)
**Layout**: Paginated container mimicking Mushaf pages (604 pages)

**Page Structure**:
```html
<div class="page-container">
  <div class="page-header">صفحة ١ | Page 1</div>

  <div class="page-content">
    <!-- Continuous flowing text with embedded verse numbers -->
    <span class="bismillah">بِسْمِ ٱللَّهِ...</span>
    <span class="verse-segment" data-verse="1:1">
      ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ
      <span class="verse-number-marker">١</span>
      <span class="connection-count" data-count="1">🔗1</span>
    </span>
    <!-- ... more verses flowing inline -->
  </div>

  <!-- Footer: Aggregated Connections -->
  <div class="page-footer-connections">
    <div class="footer-header">Connections on this page:</div>
    <div class="footer-connection-item">
      <strong>Verse 1:1 → 27:30</strong>
      <p class="connection-text-ar">إِنَّهُۥ مِن سُلَيْمَـٰنَ...</p>
      <p class="connection-text-en">Indeed, it is from Solomon...</p>
    </div>
    <!-- ... all connections from verses on this page -->
  </div>

  <div class="page-navigation">
    <button class="prev-page-btn">← Previous</button>
    <span class="page-number">1 / 604</span>
    <button class="next-page-btn">Next →</button>
  </div>
</div>
```

**Key Logic**:
- Fetch page data via API using page number
- Parse API response to get all verses on the page
- For each verse, check `QURAN_LINKS` for connections
- Aggregate all connections found on the page
- Fetch full text of all connected verses
- Render connections in footer with clear "origin verse" indication
- Next/Previous buttons update page number and re-render

### 4. Navigation Components

#### Top Navigation Bar
```html
<nav class="top-nav">
  <button class="menu-btn">☰</button>
  <h1 class="app-title">QuranViz Pro</h1>
  <button class="search-btn">🔍</button>
</nav>
```

#### Bottom Navigation Bar
```html
<nav class="bottom-nav">
  <button class="nav-item" data-action="reading">📖 Reading</button>
  <button class="nav-item" data-action="study">📚 Study</button>
  <button class="nav-item" data-action="bookmarks">⭐ Bookmarks</button>
  <button class="nav-item" data-action="settings">⚙️ Settings</button>
</nav>
```

#### Surah Selector Dropdown
- Fixed position dropdown (always visible in both modes)
- Grouped list of all 114 surahs with bilingual names
- Clicking a surah:
  - Study Mode: Load that surah and scroll to top
  - Reading Mode: Calculate starting page of that surah and load it

#### Quick Jump Modal
```html
<div class="modal quick-jump-modal">
  <div class="modal-content">
    <h2>Jump to Verse</h2>
    <select class="surah-select">...</select>
    <input type="number" class="verse-input" placeholder="Verse #">
    <button class="jump-btn">Jump</button>
    <button class="close-btn">Cancel</button>
  </div>
</div>
```

**Logic**:
- When user selects surah + verse:
  - If Reading Mode: Calculate which page contains this verse using `PAGE_MAP`
  - Load the appropriate page/surah
  - Scroll to and highlight the target verse
  - Add current position to `navigationHistory` for "go back" feature

#### "Go Back" Button
- Store previous positions in `navigationHistory` array
- Show "← Back" button when history exists
- Clicking returns to previous position and removes from history
- Show on verse cards, search results, and connection jumps

### 5. Search Feature

#### Search UI
```html
<div class="search-modal">
  <input type="text" class="search-input" placeholder="Search Quran...">
  <div class="search-results">
    <div class="search-result-item" data-surah="2" data-verse="255">
      <strong>Al-Baqarah 2:255</strong>
      <p class="result-snippet">...ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ...</p>
    </div>
    <!-- ... more results -->
  </div>
</div>
```

**Logic**:
- Debounced input (300ms delay after user stops typing)
- Fetch search results from API: `/search/{query}/{surah}/{edition}`
- Display results with surah name, verse number, and text snippet
- Clicking a result:
  - Save current position to history
  - Jump to that verse in current view mode
  - Close search modal
  - Show "← Back" button

### 6. Bookmarks System

#### Storage Format
```javascript
// localStorage key: 'quranviz_bookmarks'
bookmarks = ["1:1", "2:255", "112:1"] // array of "surah:verse" strings
```

#### UI Components
- Toggle button on each verse card (⭐ icon)
- Bookmarked state: filled star (⭐) vs empty star (☆)
- Bookmarks modal/page: List of all bookmarked verses with:
  - Surah name + verse number
  - Text snippet
  - Jump button
  - Remove bookmark button

### 7. Settings Panel

#### Settings UI
```html
<div class="settings-modal">
  <div class="setting-item">
    <label>Language / اللغة</label>
    <button class="lang-toggle">English / عربي</button>
  </div>

  <div class="setting-item">
    <label>Font Size</label>
    <input type="range" min="14" max="28" value="18" class="font-size-slider">
    <span class="font-size-value">18px</span>
  </div>

  <div class="setting-item">
    <label>Theme</label>
    <button class="theme-toggle">🌙 Dark / ☀️ Light</button>
  </div>
</div>
```

**Persistence**:
- Save all settings to localStorage on change
- Load settings on app init and apply to document root CSS variables

### 8. Tafsir Feature

#### Tafsir UI
- Toggle button on each verse card (📖 icon)
- Clicking fetches tafsir from API if not cached
- Displays in collapsible section below verse text
- Arabic version: Use `ar.muyassar` edition
- English version: Use `en.jalalayn` or similar edition

### 9. Styling & Theming

#### CSS Architecture
- **CSS Variables** for theme colors, fonts, spacing
- **Mobile-First Media Queries**: Base styles for mobile, `@media (min-width: 768px)` for tablet/desktop
- **Touch-Friendly**: Minimum 44px tap targets, adequate spacing

#### Theme Variables
```css
:root {
  /* Light Theme */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --accent-color: #2c7a7b;
  --border-color: #e0e0e0;

  /* Typography */
  --font-arabic: 'Amiri Quran', 'Traditional Arabic', serif;
  --font-latin: 'Segoe UI', Tahoma, sans-serif;
  --base-font-size: 18px;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #f5f5f5;
  --text-secondary: #b0b0b0;
  --accent-color: #4fd1c5;
  --border-color: #404040;
}
```

#### Arabic Font
Use web-safe Arabic fonts with fallbacks:
- Primary: `'Amiri Quran'` (can load from Google Fonts)
- Fallback: `'Traditional Arabic'`, `serif`

### 10. Error Handling & Loading States

#### Loading Indicators
- Spinner overlay during API fetches
- Skeleton screens for verse cards/pages while loading
- Disable navigation buttons during loading

#### Error Handling
- Network errors: Show "Unable to load. Check connection." message
- 404 errors: "Content not found" with retry button
- Malformed data: Log error and show generic error message
- Fallback: Always show cached data if API fails

## Implementation Steps

### Step 1: Create Directory Structure
- Create `css/`, `js/`, `js/data/`, `js/services/`, `js/state/`, `js/utils/`, `js/views/`, `js/components/` directories

### Step 2: Create HTML Structure (`index.html`)
- DOCTYPE, meta tags (viewport, charset)
- Link to all CSS files
- Empty containers for both view modes
- Navigation bars (top, bottom)
- Modal containers (search, settings, quick-jump, bookmarks)
- Script tags with `type="module"` for ES6 modules

### Step 3: Create Data Files
- `js/data/surah-names.js`: Export `SURAH_NAMES` array (all 114 surahs with Arabic/English names and verse counts)
- `js/data/page-map.js`: Export `PAGE_MAP` array (604 Mushaf pages with starting verse)
- Note: `quran_links.js` will be populated by user

### Step 4: Implement CSS Architecture
- `css/variables.css`: CSS custom properties for theming, colors, fonts, spacing
- `css/base.css`: CSS reset, typography, base element styles
- `css/components.css`: Buttons, cards, modals, navigation, inputs
- `css/study-mode.css`: Verse cards, inline connections styling
- `css/reading-mode.css`: Page view, footer connections styling
- `css/responsive.css`: Mobile-first media queries

### Step 5: Create Storage Service (`js/services/storage-service.js`)
- `loadSettings()`: Load user preferences from localStorage
- `saveSettings()`: Save user preferences to localStorage
- `loadBookmarks()`: Load bookmarks array
- `saveBookmark()`: Add bookmark
- `removeBookmark()`: Remove bookmark
- Default values for first-time users

### Step 6: Create API Service (`js/services/api-service.js`)
- In-memory cache object
- `fetchPage(pageNum, edition)`: GET page from API
- `fetchSurah(surahNum, edition)`: GET surah from API
- `fetchVerse(surah, verse, edition)`: GET single verse from API
- `fetchTafsir(surah, verse, edition)`: GET tafsir from API
- `searchQuran(query, edition)`: Search API
- Implement caching and error handling for all methods

### Step 7: Create State Management (`js/state/app-state.js`)
- Export `AppState` object with reactive properties
- Implement observer pattern for state changes
- `updateState(key, value)`: Update state and trigger re-render
- `subscribe(callback)`: Subscribe to state changes
- Initialize state from localStorage on load

### Step 8: Create Helper Utilities
- `js/utils/helpers.js`:
  - `debounce()`: Debounce function for search
  - `scrollToElement()`: Smooth scroll with offset
  - `highlightElement()`: Add pulse animation
  - `formatVerseRef()`: Format "surah:verse" strings
- `js/utils/connections.js`:
  - `getConnectionsForVerse(surah, verse)`: Lookup in QURAN_LINKS including ranges
  - `parseVerseRange()`: Parse "2:1-5" format
  - `isVerseInRange()`: Check if verse is in range

### Step 9: Build Study Mode View (`js/views/study-mode.js`)
- `renderStudyMode(surahNum)`: Main render function
- `createVerseCard(verse, connections)`: Generate verse card HTML
- `renderInlineConnections(connections)`: Fetch and display connected verses
- Event listeners for bookmark, tafsir, jump buttons
- Export all functions

### Step 10: Build Reading Mode View (`js/views/reading-mode.js`)
- `renderReadingMode(pageNum)`: Main render function
- `createPageContent(verses)`: Generate flowing text with verse markers
- `aggregatePageConnections(verses)`: Collect all connections on page
- `renderFooterConnections(connections)`: Display footer section
- Prev/Next page navigation handlers
- Export all functions

### Step 11: Build Navigation Component (`js/components/navigation.js`)
- `initTopNav()`: Top navigation bar
- `initBottomNav()`: Bottom navigation with mode switching
- `createSurahSelector()`: Dropdown with 114 surahs
- `createQuickJumpModal()`: Jump to specific verse
- `handleBackButton()`: Navigation history management
- Export init functions

### Step 12: Build Search Component (`js/components/search.js`)
- `initSearchModal()`: Create search UI
- `handleSearchInput()`: Debounced search handler
- `displaySearchResults()`: Render results list
- `handleResultClick()`: Jump to verse from result
- Export init function

### Step 13: Build Bookmarks Component (`js/components/bookmarks.js`)
- `initBookmarksModal()`: Create bookmarks list UI
- `toggleBookmark(surah, verse)`: Add/remove bookmark
- `renderBookmarksList()`: Display all bookmarks
- `handleBookmarkClick()`: Jump to bookmarked verse
- Export init function

### Step 14: Build Settings Component (`js/components/settings.js`)
- `initSettingsModal()`: Create settings UI
- `handleLanguageToggle()`: Switch between Arabic/English
- `handleFontSizeChange()`: Update font size CSS variable
- `handleThemeToggle()`: Switch light/dark theme
- Apply settings on init
- Export init function

### Step 15: Create Main App (`js/app.js`)
- Import all modules
- Initialize state from localStorage
- Initialize all components (navigation, search, bookmarks, settings)
- Apply user preferences (theme, font size, language)
- Load last viewed position or default to Surah 1
- Set up error boundary
- Export `init()` function
- Call `init()` on DOMContentLoaded

### Step 16: Integration and Testing
- Test both view modes with various surahs/pages
- Test all navigation methods
- Test search, bookmarks, settings
- Test on mobile, tablet, desktop
- Test theme switching
- Test error scenarios (network failures, invalid data)

## Key Technical Challenges & Solutions

### Challenge 1: Page-to-Verse Mapping
**Problem**: Need to calculate which Mushaf page contains a specific verse for "Quick Jump" in Reading Mode.

**Solution**: Create a `PAGE_MAP` array by researching standard Mushaf pagination (e.g., King Fahd Complex Mushaf). Each entry maps page number to starting verse. Implement binary search or linear lookup to find page for any verse.

### Challenge 2: Aggregating Page Connections
**Problem**: Reading Mode footer must show ALL connections from ALL verses on current page.

**Solution**:
1. Parse API response to get all verse numbers on page
2. For each verse, lookup `QURAN_LINKS[surah:verse]`
3. Collect all unique connections in an array
4. Batch fetch all connected verse texts in parallel
5. Render footer with clear indication of origin verse

### Challenge 3: Inline Connections in Study Mode
**Problem**: Each verse card must show full text of connected verses, not just references.

**Solution**:
- When rendering a verse, immediately lookup its connections in `QURAN_LINKS`
- If connections exist, fetch all connected verses via API (use `Promise.all` for parallel fetch)
- Render connection cards directly inside the verse card DOM
- Cache fetched verse texts to avoid redundant API calls

### Challenge 4: Handling Verse Ranges in QURAN_LINKS
**Problem**: Some keys in `QURAN_LINKS` are ranges like "2:1-5".

**Solution**:
- When looking up connections, check both `QURAN_LINKS["surah:verse"]` and any range keys that include the verse
- Create a helper function `getConnectionsForVerse(surah, verse)` that:
  - Checks direct key `"surah:verse"`
  - Checks all range keys like `"surah:start-end"` where verse is between start and end
  - Returns merged array of connections

### Challenge 5: Go Back Navigation
**Problem**: Users need to return to previous position after jumping from connections/search.

**Solution**:
- Maintain `navigationHistory` array in `AppState`
- Before any jump, push current position: `{mode, surah/page, verse, scrollPos}`
- Show "← Back" button when history length > 0
- On back click, pop last position, restore state, scroll to position

### Challenge 6: API Rate Limiting
**Problem**: Multiple rapid API calls might hit rate limits.

**Solution**:
- Implement in-memory cache for all API responses
- Cache key: `${endpoint}_${params}_${edition}`
- Check cache before making API call
- Set reasonable cache expiry (session-based, clears on page refresh)

## Verification & Testing

### Manual Testing Checklist

#### View Modes
- [ ] Study Mode: Verse cards render correctly with Arabic/English text
- [ ] Study Mode: Connections appear inline with full text
- [ ] Reading Mode: Page view displays continuous flowing text
- [ ] Reading Mode: Footer aggregates all page connections correctly
- [ ] Switch between modes preserves approximate position

#### Navigation
- [ ] Surah dropdown jumps to correct surah/page in both modes
- [ ] Quick Jump calculates correct page in Reading Mode
- [ ] Quick Jump scrolls to correct verse in Study Mode
- [ ] "Go Back" button restores previous position correctly
- [ ] Prev/Next page buttons work in Reading Mode

#### Search
- [ ] Search input is debounced (doesn't trigger on every keystroke)
- [ ] Search results display correctly
- [ ] Clicking result jumps to verse
- [ ] "Go Back" works after search jump

#### Bookmarks
- [ ] Bookmark toggle adds/removes bookmark
- [ ] Bookmarks persist after page reload
- [ ] Bookmarks modal lists all saved verses
- [ ] Clicking bookmark jumps to verse
- [ ] Remove bookmark button works

#### Settings
- [ ] Language toggle switches UI and verse text
- [ ] Font size slider updates text immediately
- [ ] Theme toggle switches between light/dark
- [ ] Settings persist after page reload

#### Tafsir
- [ ] Tafsir button fetches and displays tafsir
- [ ] Tafsir collapses/expands correctly
- [ ] Both Arabic and English tafsir work

#### Mobile Responsiveness
- [ ] App is fully functional on mobile (< 768px)
- [ ] Touch targets are at least 44px
- [ ] Bottom nav is accessible and functional
- [ ] Modals are properly sized for mobile screens
- [ ] Text is readable without zooming

#### API Integration
- [ ] Loading indicators show during API calls
- [ ] Errors are handled gracefully with retry options
- [ ] Cache prevents redundant API calls
- [ ] Both Arabic and English editions load correctly

## Critical Files to Create

### HTML
- `index.html` - Main entry point

### CSS (in order of import)
- `css/variables.css` - Theme variables
- `css/base.css` - Base styles
- `css/components.css` - UI components
- `css/study-mode.css` - Study Mode styles
- `css/reading-mode.css` - Reading Mode styles
- `css/responsive.css` - Media queries

### JavaScript Data
- `js/data/surah-names.js` - Surah metadata
- `js/data/page-map.js` - Mushaf page mappings

### JavaScript Services
- `js/services/api-service.js` - API integration
- `js/services/storage-service.js` - localStorage wrapper

### JavaScript State
- `js/state/app-state.js` - Global state management

### JavaScript Utils
- `js/utils/helpers.js` - Utility functions
- `js/utils/connections.js` - Connection lookup logic

### JavaScript Views
- `js/views/study-mode.js` - Study Mode rendering
- `js/views/reading-mode.js` - Reading Mode rendering

### JavaScript Components
- `js/components/navigation.js` - Navigation UI
- `js/components/search.js` - Search functionality
- `js/components/bookmarks.js` - Bookmarks management
- `js/components/settings.js` - Settings panel

### JavaScript Main
- `js/app.js` - Application initialization

### Existing Files (User Managed)
- `quran_links.js` - Connection data (user will populate)

## Notes

- **ES6 Modules**: Use `type="module"` in script tags and `export`/`import` syntax
- **No Bundler Required**: Modern browsers support ES6 modules natively
- **Arabic Fonts**: Use Google Fonts or system fonts with proper fallbacks
- **PAGE_MAP Data**: Will be researched/sourced for standard Mushaf pagination (604 pages)
- **API Editions**: Use `quran-uthmani` for Arabic, `en.sahih` for English (configurable)
- **Tafsir Editions**: Use `ar.muyassar` for Arabic tafsir, `en.jalalayn` for English
- **Cache Strategy**: In-memory cache clears on page reload; consider localStorage cache for better performance
- **Future Enhancement**: Service Worker for offline functionality (beyond current scope)
