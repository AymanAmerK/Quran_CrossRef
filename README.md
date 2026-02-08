# QuranViz Pro

A mobile-first web application for exploring the Quran with integrated cross-reference connections between verses.

## Features

### Two Viewing Modes

1. **Study Mode** - Verse-by-verse analysis
   - Full surah display with Arabic text and translation
   - Inline connections showing related verses
   - Tafsir (commentary) on demand
   - Bookmark individual verses
   - Jump between connected verses

2. **Reading Mode** - Traditional Mushaf pagination
   - 604-page Madani Mushaf layout
   - Continuous flowing Arabic text
   - Aggregated connections in page footer
   - Next/Previous page navigation

### Core Features

- **Cross-Reference Connections**: Visualize thematic and parallel connections between verses
- **Bookmarks**: Save and manage favorite verses
- **Search**: Full-text search across the Quran
- **Quick Jump**: Navigate to any verse instantly
- **Customization**:
  - Light/Dark theme
  - Adjustable font size
  - Multiple English translations
  - Arabic/English interface

## Installation

No installation or build step required! Simply:

1. Open `index.html` in a modern web browser
2. Ensure `quran_links.js` contains your connection data

## File Structure

```
quranlinks_claude/
├── index.html              # Main HTML file
├── quran_links.js          # Connection data (user-provided)
├── css/
│   ├── variables.css       # Theme variables
│   ├── base.css            # Base styles
│   ├── components.css      # UI components
│   ├── study-mode.css      # Study Mode styles
│   ├── reading-mode.css    # Reading Mode styles
│   └── responsive.css      # Media queries
└── js/
    ├── app.js              # Main application
    ├── data/
    │   ├── surah-names.js  # Surah metadata
    │   └── page-map.js     # Page-to-verse mapping
    ├── services/
    │   ├── api-service.js  # API integration
    │   └── storage-service.js # localStorage
    ├── state/
    │   └── app-state.js    # State management
    ├── utils/
    │   ├── helpers.js      # Helper functions
    │   └── connections.js  # Connection logic
    ├── views/
    │   ├── study-mode.js   # Study Mode rendering
    │   └── reading-mode.js # Reading Mode rendering
    └── components/
        ├── navigation.js   # Navigation UI
        ├── search.js       # Search functionality
        ├── bookmarks.js    # Bookmarks management
        └── settings.js     # Settings panel
```

## quran_links.js Format

The application expects `quran_links.js` to define a global `QURAN_LINKS` object:

```javascript
window.QURAN_LINKS = {
  "1:1": [
    {"surah": 27, "verse": 30, "type": "Parallel"}
  ],
  "2:255": [
    {"surah": 3, "verse": 2, "type": "Theme"},
    {"surah": 20, "verse": 111, "type": "Parallel"}
  ]
  // ... more connections
};
```

### Connection Format

Each key is a verse reference (`"surah:verse"`), and the value is an array of connection objects:

```javascript
{
  "surah": 27,        // Target surah number
  "verse": 30,        // Target verse number
  "type": "Parallel"  // Optional: connection type
}
```

### Supported Formats

- Single verse: `"2:255"`
- Verse ranges: `"2:1-5"` (applies to all verses in range)

## API Integration

The app uses the [Al Quran Cloud API](https://alquran.cloud/api) for:

- Arabic text (Uthmani script)
- English translations (Sahih International, Pickthall, Yusuf Ali, etc.)
- Tafsir (Arabic and English commentaries)
- Full-text search

All API responses are cached for performance.

## Browser Requirements

- Modern browser with ES6 module support
- JavaScript enabled
- Internet connection for API calls

### Tested Browsers

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Usage Tips

### Navigation

- **Surah Selector**: Dropdown at the top to quickly jump to any surah
- **Bottom Nav**: Switch between Reading, Study, Bookmarks, and Settings
- **Back Button**: Appears when jumping between verses, returns to previous location
- **Quick Jump**: Click menu icon (☰) to jump to specific verse

### Study Mode

- Click verse numbers to see details
- Click 📖 icon to view tafsir
- Click ⭐ icon to bookmark
- Click "Jump →" on connection cards to navigate
- Connections show full verse text inline

### Reading Mode

- Use Next/Previous buttons to navigate pages
- Connection count badges (🔗) show verses with connections
- Footer shows all connections aggregated from the page
- Click "Jump to verse" to navigate to connected verses

### Bookmarks

- Star icon on any verse to bookmark
- View all bookmarks in Bookmarks tab
- Click verse to jump to it
- Delete icon to remove bookmark

### Search

- Click 🔍 icon to open search
- Type at least 2 characters
- Results show verse reference and preview
- Click result to jump to verse

### Settings

- **Language**: Toggle between English/Arabic UI (verse text always shows both)
- **Font Size**: Adjust from 14px to 28px
- **Theme**: Switch between Light and Dark mode
- **Translation**: Choose from multiple English translations

## Keyboard Shortcuts

- `Ctrl/Cmd + F`: Open search
- `Esc`: Close modal
- `Ctrl/Cmd + B`: Open bookmarks

## Data Persistence

The following data is saved in localStorage:

- Bookmarks
- Theme preference
- Font size
- Language preference
- Translation choice
- Last viewed position

## Offline Support

- App structure works offline after first load
- Cached API responses available offline
- New API calls require internet connection

## Development

### Debug Tools

Open browser console and access:

```javascript
window.QuranVizPro.AppState.debug()  // View current state
window.QuranVizPro.StorageService    // Access storage
```

### Adding Features

The modular architecture makes it easy to extend:

- Add new views in `js/views/`
- Add new components in `js/components/`
- Add new utilities in `js/utils/`
- All modules use ES6 imports/exports

## Troubleshooting

### Connections Not Showing

1. Verify `quran_links.js` is loaded before `app.js`
2. Check browser console for errors
3. Verify `window.QURAN_LINKS` exists in console
4. Check connection data format

### API Errors

1. Check internet connection
2. Verify API is accessible: https://api.alquran.cloud/v1/surah/1
3. Clear cache and reload
4. Check browser console for specific errors

### Page Layout Issues

1. Clear browser cache
2. Verify all CSS files are loaded
3. Check browser console for missing files
4. Try different browser

## Credits

- Quran text from [Al Quran Cloud API](https://alquran.cloud)
- Arabic font: Amiri Quran (Google Fonts)
- Mushaf pagination: Madani Mushaf (King Fahd Complex)

## License

This project is provided as-is for educational and research purposes.

## Version

1.0.0 - Initial Release
