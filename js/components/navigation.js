// Navigation Components

import { AppState } from '../state/app-state.js';
import { SURAH_NAMES } from '../data/surah-names.js';
import { renderStudyMode } from '../views/study-mode.js';
import { renderReadingMode, getPageForVerse } from '../views/reading-mode.js';
import { openBookmarksModal } from './bookmarks.js';
import { openSettingsModal } from './settings.js';

export function initNavigation() {
  initSurahSelector();
  initBottomNav();
  initBackButton();
  initQuickJumpModal();
}

function initSurahSelector() {
  const surahSelect = document.getElementById('surah-select');
  if (!surahSelect) return;

  // Populate surah dropdown
  SURAH_NAMES.forEach(surah => {
    const option = document.createElement('option');
    option.value = surah.number;
    option.textContent = `${surah.number}. ${surah.nameEnglish} - ${surah.nameArabic}`;
    surahSelect.appendChild(option);
  });

  // Handle selection
  surahSelect.addEventListener('change', (e) => {
    const surahNumber = parseInt(e.target.value);
    if (!surahNumber) return;

    const viewMode = AppState.get('viewMode');

    if (viewMode === 'study') {
      renderStudyMode(surahNumber);
    } else if (viewMode === 'reading') {
      // Find the starting page of this surah
      const page = getPageForVerse(surahNumber, 1);
      renderReadingMode(page);
    }
  });

  // Subscribe to state changes to update selector
  AppState.subscribe((key, value) => {
    if (key === 'currentSurah') {
      surahSelect.value = value;
    }
  });
}

function initBottomNav() {
  const navReading = document.getElementById('nav-reading');
  const navStudy = document.getElementById('nav-study');
  const navBookmarks = document.getElementById('nav-bookmarks');
  const navSettings = document.getElementById('nav-settings');

  navReading?.addEventListener('click', () => {
    setActiveNav('reading');
    showReadingMode();
  });

  navStudy?.addEventListener('click', () => {
    setActiveNav('study');
    showStudyMode();
  });

  navBookmarks?.addEventListener('click', () => {
    openBookmarksModal();
  });

  navSettings?.addEventListener('click', () => {
    openSettingsModal();
  });
}

function setActiveNav(mode) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  const activeItem = document.getElementById(`nav-${mode}`);
  activeItem?.classList.add('active');
}

function showStudyMode() {
  const studyContainer = document.getElementById('study-mode-container');
  const readingContainer = document.getElementById('reading-mode-container');

  if (studyContainer) studyContainer.style.display = 'block';
  if (readingContainer) readingContainer.style.display = 'none';

  const currentSurah = AppState.get('currentSurah');
  renderStudyMode(currentSurah);
}

function showReadingMode() {
  const studyContainer = document.getElementById('study-mode-container');
  const readingContainer = document.getElementById('reading-mode-container');

  if (studyContainer) studyContainer.style.display = 'none';
  if (readingContainer) readingContainer.style.display = 'block';

  const currentPage = AppState.get('currentPage');
  renderReadingMode(currentPage);
}

function initBackButton() {
  const backBtn = document.getElementById('back-btn');
  if (!backBtn) return;

  backBtn.addEventListener('click', () => {
    const previousPosition = AppState.popHistory();

    if (previousPosition) {
      if (previousPosition.mode === 'study') {
        setActiveNav('study');
        renderStudyMode(previousPosition.surah).then(() => {
          if (previousPosition.verse) {
            setTimeout(() => {
              const verseId = `verse-${previousPosition.surah}-${previousPosition.verse}`;
              document.getElementById(verseId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
          }
        });
      } else if (previousPosition.mode === 'reading') {
        setActiveNav('reading');
        renderReadingMode(previousPosition.page);
      }
    }

    // Hide back button if no more history
    if (!AppState.hasHistory()) {
      backBtn.style.display = 'none';
    }
  });
}

function initQuickJumpModal() {
  const menuBtn = document.getElementById('menu-btn');
  const modal = document.getElementById('quick-jump-modal');
  const jumpSurahSelect = document.getElementById('jump-surah-select');
  const jumpVerseInput = document.getElementById('jump-verse-input');
  const jumpBtn = document.getElementById('jump-btn');
  const cancelBtn = document.getElementById('jump-cancel-btn');

  // Populate surah selector in modal
  SURAH_NAMES.forEach(surah => {
    const option = document.createElement('option');
    option.value = surah.number;
    option.textContent = `${surah.number}. ${surah.nameEnglish}`;
    jumpSurahSelect?.appendChild(option);
  });

  // Open modal
  menuBtn?.addEventListener('click', () => {
    if (modal) modal.style.display = 'flex';
  });

  // Close modal
  cancelBtn?.addEventListener('click', () => {
    if (modal) modal.style.display = 'none';
  });

  modal?.querySelector('.modal-overlay')?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Handle jump
  jumpBtn?.addEventListener('click', () => {
    const surah = parseInt(jumpSurahSelect?.value);
    const verse = parseInt(jumpVerseInput?.value);

    if (!surah || !verse) {
      alert('Please select a surah and enter a verse number');
      return;
    }

    // Validate verse number
    const surahData = SURAH_NAMES.find(s => s.number === surah);
    if (verse < 1 || verse > surahData.verses) {
      alert(`Invalid verse number. ${surahData.nameEnglish} has ${surahData.verses} verses.`);
      return;
    }

    // Save current position to history
    const currentPosition = AppState.getCurrentPosition();
    AppState.pushHistory(currentPosition);

    // Show back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.style.display = 'block';

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

    // Close modal
    modal.style.display = 'none';
    jumpVerseInput.value = '';
  });
}
