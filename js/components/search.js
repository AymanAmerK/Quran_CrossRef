// Search Component

import { ApiService } from '../services/api-service.js';
import { AppState } from '../state/app-state.js';
import { debounce, truncateText } from '../utils/helpers.js';
import { getSurahName } from '../data/surah-names.js';
import { renderStudyMode } from '../views/study-mode.js';
import { renderReadingMode, getPageForVerse } from '../views/reading-mode.js';

let searchModal = null;
let searchInput = null;
let searchResults = null;

export function initSearch() {
  const searchBtn = document.getElementById('search-btn');
  searchModal = document.getElementById('search-modal');
  searchInput = document.getElementById('search-input');
  searchResults = document.getElementById('search-results');
  const closeBtn = document.getElementById('search-close-btn');

  // Open modal
  searchBtn?.addEventListener('click', () => {
    if (searchModal) {
      searchModal.style.display = 'flex';
      searchInput?.focus();
    }
  });

  // Close modal
  closeBtn?.addEventListener('click', closeSearchModal);

  searchModal?.querySelector('.modal-overlay')?.addEventListener('click', closeSearchModal);

  // Handle search input with debounce
  searchInput?.addEventListener('input', debounce(handleSearch, 300));

  // Handle Enter key
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  });
}

function closeSearchModal() {
  if (searchModal) {
    searchModal.style.display = 'none';
    searchInput.value = '';
    searchResults.innerHTML = '<p class="search-placeholder">Enter text to search the Quran</p>';
  }
}

async function handleSearch() {
  const query = searchInput?.value?.trim();

  if (!query || query.length < 2) {
    searchResults.innerHTML = '<p class="search-placeholder">Enter at least 2 characters to search</p>';
    return;
  }

  // Show loading
  searchResults.innerHTML = '<div class="spinner"></div><p>Searching...</p>';

  try {
    const translation = AppState.get('translation');
    const results = await ApiService.searchQuran(query, 'all', translation);

    if (!results.matches || results.matches.length === 0) {
      searchResults.innerHTML = '<p class="empty-state">No results found</p>';
      return;
    }

    renderSearchResults(results.matches);

  } catch (error) {
    console.error('Search error:', error);
    searchResults.innerHTML = '<p class="error-message">Search failed. Please try again.</p>';
  }
}

function renderSearchResults(matches) {
  let html = `<div class="search-results-count">${matches.length} result${matches.length > 1 ? 's' : ''} found</div>`;

  matches.forEach(match => {
    const surahName = getSurahName(match.surah.number);
    const ref = `${match.surah.number}:${match.numberInSurah}`;
    const snippet = truncateText(match.text, 150);

    html += `
      <div class="search-result-item" data-surah="${match.surah.number}" data-verse="${match.numberInSurah}">
        <strong class="result-ref">${surahName} ${ref}</strong>
        <p class="result-snippet">${snippet}</p>
      </div>
    `;
  });

  searchResults.innerHTML = html;

  // Add click listeners
  searchResults.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const surah = parseInt(item.dataset.surah);
      const verse = parseInt(item.dataset.verse);
      handleResultClick(surah, verse);
    });
  });
}

function handleResultClick(surah, verse) {
  // Save current position to history
  const currentPosition = AppState.getCurrentPosition();
  AppState.pushHistory(currentPosition);

  // Show back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) backBtn.style.display = 'block';

  // Close search modal
  closeSearchModal();

  // Jump based on current mode
  const viewMode = AppState.get('viewMode');

  if (viewMode === 'study') {
    renderStudyMode(surah).then(() => {
      setTimeout(() => {
        const verseId = `verse-${surah}-${verse}`;
        const element = document.getElementById(verseId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlight-verse', 'target-verse');
          setTimeout(() => element.classList.remove('highlight-verse'), 2000);
        }
      }, 100);
    });
  } else if (viewMode === 'reading') {
    const page = getPageForVerse(surah, verse);
    renderReadingMode(page);
  }
}
