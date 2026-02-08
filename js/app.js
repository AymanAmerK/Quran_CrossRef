// QuranViz Pro - Main Application Entry Point

import { AppState } from './state/app-state.js';
import { StorageService } from './services/storage-service.js';
import { initNavigation } from './components/navigation.js';
import { initSearch } from './components/search.js';
import { initBookmarks } from './components/bookmarks.js';
import { initSettings, applySettings } from './components/settings.js';
import { renderStudyMode } from './views/study-mode.js';
import { renderReadingMode } from './views/reading-mode.js';
import { isQuranLinksLoaded } from './utils/connections.js';

// Initialize the application
async function init() {
  try {
    console.log('🚀 Initializing QuranViz Pro...');

    // Check if QURAN_LINKS is loaded
    if (!isQuranLinksLoaded()) {
      console.warn('⚠️ QURAN_LINKS not loaded. Connection features will not work.');
      console.warn('Please ensure quran_links.js is properly loaded before app.js');
    } else {
      const stats = await import('./utils/connections.js').then(m => m.getConnectionStats());
      console.log(`✅ QURAN_LINKS loaded: ${stats.totalKeys} verses with ${stats.totalConnections} total connections`);
    }

    // Load user settings from localStorage
    const settings = StorageService.loadSettings();
    console.log('⚙️ Loaded user settings:', settings);

    // Initialize app state with loaded settings
    AppState.update({
      theme: settings.theme,
      fontSize: settings.fontSize,
      language: settings.language,
      translation: settings.translation,
      bookmarks: settings.bookmarks,
      viewMode: settings.viewMode,
      currentSurah: settings.lastPosition.surah,
      currentPage: settings.lastPosition.page
    });

    // Apply settings to DOM
    applySettings();

    // Initialize all UI components
    initNavigation();
    initSearch();
    initBookmarks();
    initSettings();

    console.log('✅ UI components initialized');

    // Show appropriate view based on last position
    const viewMode = AppState.get('viewMode');
    const studyContainer = document.getElementById('study-mode-container');
    const readingContainer = document.getElementById('reading-mode-container');

    if (viewMode === 'reading') {
      // Reading Mode
      studyContainer.style.display = 'none';
      readingContainer.style.display = 'block';
      document.getElementById('nav-reading')?.classList.add('active');
      document.getElementById('nav-study')?.classList.remove('active');

      const page = settings.lastPosition.page || 1;
      await renderReadingMode(page);
    } else {
      // Study Mode (default)
      studyContainer.style.display = 'block';
      readingContainer.style.display = 'none';
      document.getElementById('nav-study')?.classList.add('active');
      document.getElementById('nav-reading')?.classList.remove('active');

      const surah = settings.lastPosition.surah || 1;
      await renderStudyMode(surah);
    }

    // Subscribe to state changes for saving position
    AppState.subscribe((key, value) => {
      if (key === 'currentSurah' || key === 'currentPage' || key === 'viewMode') {
        const position = AppState.getCurrentPosition();
        StorageService.saveLastPosition(position);
      }

      if (key === 'viewMode') {
        StorageService.saveViewMode(value);
      }
    });

    console.log('✅ QuranViz Pro initialized successfully');

    // Setup before unload handler to save state
    window.addEventListener('beforeunload', () => {
      const position = AppState.getCurrentPosition();
      StorageService.saveLastPosition(position);
    });

    // Setup error boundary
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      // Could show user-friendly error message here
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Could show user-friendly error message here
    });

    // Make AppState available globally for debugging
    window.QuranVizPro = {
      AppState,
      StorageService,
      version: '1.0.0'
    };

    console.log('💡 Debug tools available at window.QuranVizPro');

  } catch (error) {
    console.error('❌ Failed to initialize QuranViz Pro:', error);

    // Show error to user
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="error-message" style="margin: 2rem;">
          <h2>Failed to Initialize</h2>
          <p>${error.message}</p>
          <button onclick="location.reload()">Reload Page</button>
        </div>
      `;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM already loaded
  init();
}

// Export for potential use in other modules
export { init };
