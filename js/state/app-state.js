// Global Application State Management

const state = {
  viewMode: 'study',
  currentSurah: 1,
  currentPage: 1,
  currentVerse: null,
  language: 'en',
  theme: 'light',
  fontSize: 18,
  translation: 'en.sahih',
  bookmarks: [],
  searchResults: [],
  navigationHistory: [],
  isLoading: false
};

const listeners = [];

export const AppState = {
  // Get current state
  get(key) {
    return key ? state[key] : { ...state };
  },

  // Update state and notify listeners
  set(key, value) {
    if (state.hasOwnProperty(key)) {
      state[key] = value;
      this.notify(key, value);
    }
  },

  // Update multiple state values
  update(updates) {
    Object.keys(updates).forEach(key => {
      if (state.hasOwnProperty(key)) {
        state[key] = updates[key];
      }
    });
    this.notify('*', updates);
  },

  // Subscribe to state changes
  subscribe(callback) {
    listeners.push(callback);
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  },

  // Notify all listeners
  notify(key, value) {
    listeners.forEach(callback => {
      try {
        callback(key, value, state);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  },

  // Navigation history management
  pushHistory(position) {
    state.navigationHistory.push({
      ...position,
      timestamp: Date.now()
    });
    // Keep only last 50 positions
    if (state.navigationHistory.length > 50) {
      state.navigationHistory.shift();
    }
  },

  popHistory() {
    return state.navigationHistory.pop();
  },

  hasHistory() {
    return state.navigationHistory.length > 0;
  },

  clearHistory() {
    state.navigationHistory = [];
  },

  // Bookmarks management
  addBookmark(surah, verse) {
    const ref = `${surah}:${verse}`;
    if (!state.bookmarks.includes(ref)) {
      state.bookmarks.push(ref);
      this.notify('bookmarks', state.bookmarks);
      return true;
    }
    return false;
  },

  removeBookmark(surah, verse) {
    const ref = `${surah}:${verse}`;
    const initialLength = state.bookmarks.length;
    state.bookmarks = state.bookmarks.filter(b => b !== ref);
    if (state.bookmarks.length !== initialLength) {
      this.notify('bookmarks', state.bookmarks);
      return true;
    }
    return false;
  },

  isBookmarked(surah, verse) {
    return state.bookmarks.includes(`${surah}:${verse}`);
  },

  setBookmarks(bookmarks) {
    state.bookmarks = bookmarks;
    this.notify('bookmarks', state.bookmarks);
  },

  // Loading state
  setLoading(isLoading) {
    state.isLoading = isLoading;
    this.notify('isLoading', isLoading);
  },

  // Get current position
  getCurrentPosition() {
    return {
      mode: state.viewMode,
      surah: state.currentSurah,
      page: state.currentPage,
      verse: state.currentVerse
    };
  },

  // Debug: log current state
  debug() {
    console.log('Current State:', state);
  }
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.AppState = AppState;
}
