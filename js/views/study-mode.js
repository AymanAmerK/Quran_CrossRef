// Study Mode View - Surah-based verse-by-verse display

import { ApiService } from '../services/api-service.js';
import { AppState } from '../state/app-state.js';
import { getConnectionsForVerse } from '../utils/connections.js';
import { formatVerseRef, scrollToElement, highlightElement, showError, showLoading, hideLoading } from '../utils/helpers.js';
import { getSurahName } from '../data/surah-names.js';

let currentTafsirVerse = null;

export async function renderStudyMode(surahNumber) {
  const container = document.getElementById('verses-list');
  if (!container) return;

  // Update app state
  AppState.set('currentSurah', surahNumber);
  AppState.set('viewMode', 'study');

  // Show loading
  showLoading(`Loading ${getSurahName(surahNumber)}...`);
  container.innerHTML = '';

  try {
    // Fetch surah data (Arabic + Translation)
    const translation = AppState.get('translation');
    const [arabicData, translationData] = await ApiService.fetchSurahMultiEdition(
      surahNumber,
      ['quran-uthmani', translation]
    );

    hideLoading();

    // Render each verse
    const verses = arabicData.ayahs;
    for (let i = 0; i < verses.length; i++) {
      const verse = verses[i];
      const translationVerse = translationData.ayahs[i];
      const connections = getConnectionsForVerse(verse.numberInSurah, verse.numberInSurah);

      const verseCard = await createVerseCard(
        verse,
        translationVerse,
        connections,
        surahNumber
      );

      container.appendChild(verseCard);
    }
  } catch (error) {
    hideLoading();
    console.error('Error rendering study mode:', error);
    showError(`Failed to load surah: ${error.message}`);
  }
}

async function createVerseCard(arabicVerse, translationVerse, connections, surahNumber) {
  const card = document.createElement('div');
  card.className = 'verse-card';
  card.id = `verse-${surahNumber}-${arabicVerse.numberInSurah}`;
  card.dataset.surah = surahNumber;
  card.dataset.verse = arabicVerse.numberInSurah;

  const isBookmarked = AppState.isBookmarked(surahNumber, arabicVerse.numberInSurah);

  card.innerHTML = `
    <div class="verse-header">
      <span class="verse-number">${arabicVerse.numberInSurah}</span>
      <div class="verse-actions">
        <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}"
                data-surah="${surahNumber}"
                data-verse="${arabicVerse.numberInSurah}"
                aria-label="Bookmark verse">
          ${isBookmarked ? '⭐' : '☆'}
        </button>
        <button class="tafsir-btn"
                data-surah="${surahNumber}"
                data-verse="${arabicVerse.numberInSurah}"
                aria-label="Show tafsir">
          📖
        </button>
      </div>
    </div>
    <div class="verse-text-arabic" lang="ar">${arabicVerse.text}</div>
    <div class="verse-text-english">${translationVerse.text}</div>
    <div class="tafsir-section" id="tafsir-${surahNumber}-${arabicVerse.numberInSurah}" style="display: none;">
      <div class="tafsir-header">Tafsir</div>
      <div class="tafsir-loading">Loading tafsir...</div>
    </div>
  `;

  // Add connections if they exist
  if (connections.length > 0) {
    const connectionsHtml = await renderInlineConnections(connections, surahNumber, arabicVerse.numberInSurah);
    card.innerHTML += connectionsHtml;
  }

  // Add event listeners
  setupVerseCardListeners(card);

  return card;
}

async function renderInlineConnections(connections, originSurah, originVerse) {
  const translation = AppState.get('translation');

  // Fetch all connected verses in parallel
  const versePromises = connections.map(conn =>
    ApiService.fetchVerse(conn.surah, conn.verse, translation).catch(() => null)
  );

  const connectedVerses = await Promise.all(versePromises);

  let html = `
    <div class="connections-section">
      <div class="connections-header">🔗 ${connections.length} Connection${connections.length > 1 ? 's' : ''}</div>
      <div class="connections-list">
  `;

  connections.forEach((conn, index) => {
    const verseData = connectedVerses[index];
    if (!verseData) return;

    const ref = formatVerseRef(conn.surah, conn.verse);
    const surahName = getSurahName(conn.surah);

    html += `
      <div class="connection-item" data-target="${ref}">
        <div class="connection-header">
          <span class="connection-ref">${surahName} ${ref}</span>
          ${conn.type ? `<span class="connection-type">${conn.type}</span>` : ''}
        </div>
        <div class="connection-text-ar" lang="ar">${verseData.text}</div>
        <button class="jump-btn" data-surah="${conn.surah}" data-verse="${conn.verse}">
          Jump →
        </button>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  return html;
}

function setupVerseCardListeners(card) {
  const surah = parseInt(card.dataset.surah);
  const verse = parseInt(card.dataset.verse);

  // Bookmark button
  const bookmarkBtn = card.querySelector('.bookmark-btn');
  bookmarkBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    handleBookmarkToggle(surah, verse, bookmarkBtn);
  });

  // Tafsir button
  const tafsirBtn = card.querySelector('.tafsir-btn');
  tafsirBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    handleTafsirToggle(surah, verse, tafsirBtn);
  });

  // Jump buttons in connections
  const jumpBtns = card.querySelectorAll('.jump-btn');
  jumpBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetSurah = parseInt(btn.dataset.surah);
      const targetVerse = parseInt(btn.dataset.verse);
      handleJumpToVerse(targetSurah, targetVerse);
    });
  });
}

function handleBookmarkToggle(surah, verse, button) {
  const isBookmarked = AppState.isBookmarked(surah, verse);

  if (isBookmarked) {
    AppState.removeBookmark(surah, verse);
    button.classList.remove('bookmarked');
    button.textContent = '☆';
  } else {
    AppState.addBookmark(surah, verse);
    button.classList.add('bookmarked');
    button.textContent = '⭐';
  }

  // Sync with storage
  import('../services/storage-service.js').then(({ StorageService }) => {
    StorageService.saveBookmarks(AppState.get('bookmarks'));
  });
}

async function handleTafsirToggle(surah, verse, button) {
  const tafsirSection = document.getElementById(`tafsir-${surah}-${verse}`);
  if (!tafsirSection) return;

  if (tafsirSection.style.display === 'none') {
    // Show tafsir
    tafsirSection.style.display = 'block';
    button.classList.add('active');

    // Load tafsir if not already loaded
    if (!tafsirSection.dataset.loaded) {
      try {
        const tafsirData = await ApiService.fetchTafsir(surah, verse, 'ar.muyassar');
        tafsirSection.innerHTML = `
          <div class="tafsir-header">Tafsir</div>
          <div class="tafsir-text">
            <div class="tafsir-text-ar" lang="ar">${tafsirData.text}</div>
          </div>
        `;
        tafsirSection.dataset.loaded = 'true';
      } catch (error) {
        tafsirSection.innerHTML = `
          <div class="tafsir-header">Tafsir</div>
          <p class="error-message">Failed to load tafsir: ${error.message}</p>
        `;
      }
    }
  } else {
    // Hide tafsir
    tafsirSection.style.display = 'none';
    button.classList.remove('active');
  }
}

function handleJumpToVerse(surah, verse) {
  // Save current position to history
  const currentPosition = AppState.getCurrentPosition();
  AppState.pushHistory(currentPosition);

  // Show back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) backBtn.style.display = 'block';

  // Check if we need to load a different surah
  const currentSurah = AppState.get('currentSurah');

  if (surah !== currentSurah) {
    // Load the target surah
    renderStudyMode(surah).then(() => {
      scrollAndHighlightVerse(surah, verse);
    });
  } else {
    // Same surah, just scroll
    scrollAndHighlightVerse(surah, verse);
  }
}

function scrollAndHighlightVerse(surah, verse) {
  const verseId = `verse-${surah}-${verse}`;
  setTimeout(() => {
    scrollToElement(verseId, 100);
    highlightElement(verseId);
  }, 100);
}

// Export for use in other modules
export function jumpToVerseInStudyMode(surah, verse) {
  renderStudyMode(surah).then(() => {
    scrollAndHighlightVerse(surah, verse);
  });
}
