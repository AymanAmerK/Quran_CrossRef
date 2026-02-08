// Reading Mode View - Mushaf-style paginated display

import { ApiService } from '../services/api-service.js';
import { AppState } from '../state/app-state.js';
import { getConnectionsForVerse } from '../utils/connections.js';
import { formatVerseRef, toArabicNumerals, showError, showLoading, hideLoading } from '../utils/helpers.js';
import { getSurahName } from '../data/surah-names.js';
import { PAGE_MAP } from '../data/page-map.js';

export async function renderReadingMode(pageNumber) {
  const container = document.getElementById('page-content-wrapper');
  if (!container) return;

  // Validate page number
  if (pageNumber < 1 || pageNumber > 604) {
    showError('Invalid page number. Must be between 1 and 604.');
    return;
  }

  // Update app state
  AppState.set('currentPage', pageNumber);
  AppState.set('viewMode', 'reading');

  // Show loading
  showLoading(`Loading page ${pageNumber}...`);
  container.innerHTML = '';

  try {
    // Fetch page data
    const translation = AppState.get('translation');
    const [arabicData, translationData] = await ApiService.fetchPageMultiEdition(
      pageNumber,
      ['quran-uthmani', translation]
    );

    hideLoading();

    // Create page container
    const pageContainer = createPageContainer(pageNumber, arabicData, translationData);
    container.appendChild(pageContainer);

    // Setup navigation
    setupPageNavigation(pageNumber);

  } catch (error) {
    hideLoading();
    console.error('Error rendering reading mode:', error);
    showError(`Failed to load page: ${error.message}`);
  }
}

function createPageContainer(pageNumber, arabicData, translationData) {
  const container = document.createElement('div');
  container.className = 'page-container';
  container.id = `page-${pageNumber}`;

  // Create header
  const arabicPage = toArabicNumerals(pageNumber);
  container.innerHTML = `
    <div class="page-header">
      صفحة ${arabicPage} | Page ${pageNumber}
    </div>
    <div class="page-content" id="page-content-${pageNumber}"></div>
    <div class="page-footer-connections" id="page-footer-${pageNumber}"></div>
    <div class="page-navigation">
      <button class="prev-page-btn" id="prev-page-btn" ${pageNumber === 1 ? 'disabled' : ''}>
        ← Previous
      </button>
      <span class="page-number">${pageNumber} / 604</span>
      <button class="next-page-btn" id="next-page-btn" ${pageNumber === 604 ? 'disabled' : ''}>
        Next →
      </button>
    </div>
  `;

  // Render page content
  const pageContent = container.querySelector(`#page-content-${pageNumber}`);
  renderPageContent(pageContent, arabicData.ayahs);

  // Aggregate and render connections
  const pageFooter = container.querySelector(`#page-footer-${pageNumber}`);
  renderPageConnections(pageFooter, arabicData.ayahs, translationData.ayahs);

  return container;
}

function renderPageContent(container, verses) {
  let html = '';
  let currentSurah = null;

  verses.forEach((verse, index) => {
    // Add surah header if new surah starts
    if (verse.surah.number !== currentSurah) {
      currentSurah = verse.surah.number;
      const surahName = getSurahName(currentSurah, 'ar');

      // Add Bismillah for all surahs except Al-Fatihah and At-Tawbah
      if (currentSurah !== 1 && currentSurah !== 9 && verse.numberInSurah === 1) {
        html += `<span class="bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</span> `;
      }

      // Add surah header
      html += `<span class="surah-header-page">${surahName}</span>`;
    }

    // Get connections count for this verse
    const connections = getConnectionsForVerse(verse.surah.number, verse.numberInSurah);
    const connectionCount = connections.length;

    // Add verse segment
    html += `<span class="verse-segment" data-verse="${verse.surah.number}:${verse.numberInSurah}">`;
    html += verse.text;
    html += ` <span class="verse-number-marker">${toArabicNumerals(verse.numberInSurah)}</span>`;

    // Add connection count badge if there are connections
    if (connectionCount > 0) {
      html += ` <span class="connection-count" data-count="${connectionCount}">🔗${connectionCount}</span>`;
    }

    html += `</span> `;
  });

  container.innerHTML = html;
}

async function renderPageConnections(container, arabicVerses, translationVerses) {
  // Collect all connections from verses on this page
  const allConnections = [];
  const connectionMap = new Map();

  arabicVerses.forEach((verse) => {
    const connections = getConnectionsForVerse(verse.surah.number, verse.numberInSurah);
    connections.forEach(conn => {
      const key = `${conn.surah}:${conn.verse}`;
      if (!connectionMap.has(key)) {
        connectionMap.set(key, {
          ...conn,
          originSurah: verse.surah.number,
          originVerse: verse.numberInSurah
        });
        allConnections.push(connectionMap.get(key));
      }
    });
  });

  if (allConnections.length === 0) {
    container.innerHTML = `
      <div class="no-footer-connections">
        No cross-references on this page.
      </div>
    `;
    return;
  }

  // Fetch all connected verses
  const translation = AppState.get('translation');
  const versePromises = allConnections.map(conn =>
    Promise.all([
      ApiService.fetchVerse(conn.surah, conn.verse, 'quran-uthmani').catch(() => null),
      ApiService.fetchVerse(conn.surah, conn.verse, translation).catch(() => null)
    ])
  );

  const verseDataArray = await Promise.all(versePromises);

  // Render connections
  let html = `
    <div class="footer-header">Connections on this page</div>
    <div class="footer-connections-list">
  `;

  allConnections.forEach((conn, index) => {
    const [arabicData, translationData] = verseDataArray[index];
    if (!arabicData || !translationData) return;

    const surahName = getSurahName(conn.surah);
    const originRef = formatVerseRef(conn.originSurah, conn.originVerse);
    const targetRef = formatVerseRef(conn.surah, conn.verse);

    html += `
      <div class="footer-connection-item">
        <div class="footer-connection-header">
          ${surahName} ${targetRef}
          ${conn.type ? `<span class="connection-type">(${conn.type})</span>` : ''}
        </div>
        <div class="footer-connection-origin">From verse ${originRef} on this page</div>
        <div class="footer-connection-text-ar" lang="ar">${arabicData.text}</div>
        <div class="footer-connection-text-en">${translationData.text}</div>
        <button class="footer-jump-btn" data-surah="${conn.surah}" data-verse="${conn.verse}">
          Jump to verse →
        </button>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;

  // Add event listeners to jump buttons
  container.querySelectorAll('.footer-jump-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const surah = parseInt(btn.dataset.surah);
      const verse = parseInt(btn.dataset.verse);
      handleJumpFromReading(surah, verse);
    });
  });
}

function setupPageNavigation(currentPage) {
  const prevBtn = document.getElementById('prev-page-btn');
  const nextBtn = document.getElementById('next-page-btn');

  prevBtn?.addEventListener('click', () => {
    if (currentPage > 1) {
      renderReadingMode(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  nextBtn?.addEventListener('click', () => {
    if (currentPage < 604) {
      renderReadingMode(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

function handleJumpFromReading(surah, verse) {
  // Save current position to history
  const currentPosition = AppState.getCurrentPosition();
  AppState.pushHistory(currentPosition);

  // Show back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) backBtn.style.display = 'block';

  // Calculate which page contains this verse
  const targetPage = getPageForVerse(surah, verse);

  if (targetPage) {
    renderReadingMode(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    showError('Could not find page for verse');
  }
}

// Get page number for a specific verse
export function getPageForVerse(surah, verse) {
  // Find the page where this verse appears
  for (let i = PAGE_MAP.length - 1; i >= 0; i--) {
    const page = PAGE_MAP[i];
    if (page.surah < surah || (page.surah === surah && page.verse <= verse)) {
      return page.page;
    }
  }
  return 1;
}

// Jump to specific page
export function jumpToPage(pageNumber) {
  if (pageNumber >= 1 && pageNumber <= 604) {
    renderReadingMode(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
