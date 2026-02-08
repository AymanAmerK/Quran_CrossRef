// localStorage Service for User Preferences and Bookmarks

const STORAGE_KEYS = {
  BOOKMARKS: 'quranviz_bookmarks',
  THEME: 'quranviz_theme',
  FONT_SIZE: 'quranviz_font_size',
  LANGUAGE: 'quranviz_language',
  TRANSLATION: 'quranviz_translation',
  LAST_POSITION: 'quranviz_last_position',
  VIEW_MODE: 'quranviz_view_mode'
};

export const StorageService = {
  // Load all settings
  loadSettings() {
    return {
      bookmarks: this.loadBookmarks(),
      theme: this.getItem(STORAGE_KEYS.THEME, 'light'),
      fontSize: parseInt(this.getItem(STORAGE_KEYS.FONT_SIZE, '18')),
      language: this.getItem(STORAGE_KEYS.LANGUAGE, 'en'),
      translation: this.getItem(STORAGE_KEYS.TRANSLATION, 'en.sahih'),
      lastPosition: this.loadLastPosition(),
      viewMode: this.getItem(STORAGE_KEYS.VIEW_MODE, 'study')
    };
  },

  // Generic get item with default
  getItem(key, defaultValue) {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? value : defaultValue;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return defaultValue;
    }
  },

  // Generic set item
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error('Error writing to localStorage:', e);
      return false;
    }
  },

  // Bookmarks
  loadBookmarks() {
    try {
      const bookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (e) {
      console.error('Error loading bookmarks:', e);
      return [];
    }
  },

  saveBookmarks(bookmarks) {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      return true;
    } catch (e) {
      console.error('Error saving bookmarks:', e);
      return false;
    }
  },

  addBookmark(surah, verse) {
    const bookmarks = this.loadBookmarks();
    const ref = `${surah}:${verse}`;
    if (!bookmarks.includes(ref)) {
      bookmarks.push(ref);
      return this.saveBookmarks(bookmarks);
    }
    return false;
  },

  removeBookmark(surah, verse) {
    const bookmarks = this.loadBookmarks();
    const ref = `${surah}:${verse}`;
    const filtered = bookmarks.filter(b => b !== ref);
    if (filtered.length !== bookmarks.length) {
      return this.saveBookmarks(filtered);
    }
    return false;
  },

  isBookmarked(surah, verse) {
    const bookmarks = this.loadBookmarks();
    return bookmarks.includes(`${surah}:${verse}`);
  },

  // Theme
  saveTheme(theme) {
    return this.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Font Size
  saveFontSize(size) {
    return this.setItem(STORAGE_KEYS.FONT_SIZE, size.toString());
  },

  // Language
  saveLanguage(language) {
    return this.setItem(STORAGE_KEYS.LANGUAGE, language);
  },

  // Translation
  saveTranslation(translation) {
    return this.setItem(STORAGE_KEYS.TRANSLATION, translation);
  },

  // View Mode
  saveViewMode(mode) {
    return this.setItem(STORAGE_KEYS.VIEW_MODE, mode);
  },

  // Last Position
  loadLastPosition() {
    try {
      const position = localStorage.getItem(STORAGE_KEYS.LAST_POSITION);
      return position ? JSON.parse(position) : { mode: 'study', surah: 1, page: 1, verse: 1 };
    } catch (e) {
      console.error('Error loading last position:', e);
      return { mode: 'study', surah: 1, page: 1, verse: 1 };
    }
  },

  saveLastPosition(position) {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_POSITION, JSON.stringify(position));
      return true;
    } catch (e) {
      console.error('Error saving last position:', e);
      return false;
    }
  },

  // Clear all data
  clearAll() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (e) {
      console.error('Error clearing localStorage:', e);
      return false;
    }
  }
};
