// Bookmarks Component

import { AppState } from '../state/app-state.js';
import { StorageService } from '../services/storage-service.js';
import { ApiService } from '../services/api-service.js';
import { getSurahName } from '../data/surah-names.js';
import { parseVerseRef, truncateText } from '../utils/helpers.js';
import { renderStudyMode } from '../views/study-mode.js';
import { renderReadingMode, getPageForVerse } from '../views/reading-mode.js';

let bookmarksModal = null;
let bookmarksList = null;

export function initBookmarks() {
  bookmarksModal = document.getElementById('bookmarks-modal');
  bookmarksList = document.getElementById('bookmarks-list');
  const closeBtn = document.getElementById('bookmarks-close-btn');

  closeBtn?.addEventListener('click', closeBookmarksModal);

  bookmarksModal?.querySelector('.modal-overlay')?.addEventListener('click', closeBookmarksModal);

  // Subscribe to bookmark changes
  AppState.subscribe((key) => {
    if (key === 'bookmarks') {
      if (bookmarksModal && bookmarksModal.style.display === 'flex') {
        renderBookmarks();
      }
    }
  });
}

export function openBookmarksModal() {
  if (bookmarksModal) {
    bookmarksModal.style.display = 'flex';
    renderBookmarks();
  }
}

function closeBookmarksModal() {
  if (bookmarksModal) {
    bookmarksModal.style.display = 'none';
  }
}

async function renderBookmarks() {
  const bookmarks = AppState.get('bookmarks');

  if (!bookmarks || bookmarks.length === 0) {
    bookmarksList.innerHTML = '<p class="empty-state">No bookmarks yet. Add bookmarks by clicking the star icon on verses.</p>';
    return;
  }

  bookmarksList.innerHTML = '<div class="spinner"></div><p>Loading bookmarks...</p>';

  try {
    const translation = AppState.get('translation');

    // Fetch all bookmarked verses
    const versePromises = bookmarks.map(ref => {
      const parsed = parseVerseRef(ref);
      if (!parsed) return Promise.resolve(null);

      return Promise.all([
        ApiService.fetchVerse(parsed.surah, parsed.verse, 'quran-uthmani').catch(() => null),
        ApiService.fetchVerse(parsed.surah, parsed.verse, translation).catch(() => null)
      ]);
    });

    const verseDataArray = await Promise.all(versePromises);

    let html = '<div class="bookmarks-grid">';

    bookmarks.forEach((ref, index) => {
      const parsed = parseVerseRef(ref);
      if (!parsed) return;

      const [arabicData, translationData] = verseDataArray[index];
      if (!arabicData || !translationData) return;

      const surahName = getSurahName(parsed.surah);
      const snippet = truncateText(translationData.text, 100);

      html += `
        <div class="bookmark-item" data-ref="${ref}">
          <div class="bookmark-header">
            <strong>${surahName} ${ref}</strong>
            <button class="remove-bookmark-btn" data-ref="${ref}" aria-label="Remove bookmark">
              🗑️
            </button>
          </div>
          <p class="bookmark-snippet">${snippet}</p>
          <button class="bookmark-jump-btn" data-surah="${parsed.surah}" data-verse="${parsed.verse}">
            Jump to verse →
          </button>
        </div>
      `;
    });

    html += '</div>';

    bookmarksList.innerHTML = html;

    // Add event listeners
    bookmarksList.querySelectorAll('.remove-bookmark-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ref = btn.dataset.ref;
        const parsed = parseVerseRef(ref);
        if (parsed) {
          AppState.removeBookmark(parsed.surah, parsed.verse);
          StorageService.saveBookmarks(AppState.get('bookmarks'));
          renderBookmarks(); // Re-render
        }
      });
    });

    bookmarksList.querySelectorAll('.bookmark-jump-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const surah = parseInt(btn.dataset.surah);
        const verse = parseInt(btn.dataset.verse);
        handleBookmarkJump(surah, verse);
      });
    });

  } catch (error) {
    console.error('Error rendering bookmarks:', error);
    bookmarksList.innerHTML = '<p class="error-message">Failed to load bookmarks.</p>';
  }
}

function handleBookmarkJump(surah, verse) {
  // Save current position to history
  const currentPosition = AppState.getCurrentPosition();
  AppState.pushHistory(currentPosition);

  // Show back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) backBtn.style.display = 'block';

  // Close modal
  closeBookmarksModal();

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
