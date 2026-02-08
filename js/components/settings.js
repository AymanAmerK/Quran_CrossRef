// Settings Component

import { AppState } from '../state/app-state.js';
import { StorageService } from '../services/storage-service.js';

let settingsModal = null;

export function initSettings() {
  settingsModal = document.getElementById('settings-modal');
  const closeBtn = document.getElementById('settings-close-btn');

  closeBtn?.addEventListener('click', closeSettingsModal);

  settingsModal?.querySelector('.modal-overlay')?.addEventListener('click', closeSettingsModal);

  // Language toggle
  const languageToggle = document.getElementById('language-toggle');
  languageToggle?.addEventListener('click', handleLanguageToggle);

  // Font size slider
  const fontSizeSlider = document.getElementById('font-size-slider');
  fontSizeSlider?.addEventListener('input', handleFontSizeChange);

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle?.addEventListener('click', handleThemeToggle);

  // Translation select
  const translationSelect = document.getElementById('translation-select');
  translationSelect?.addEventListener('change', handleTranslationChange);

  // Initialize with current values
  updateSettingsUI();
}

export function openSettingsModal() {
  if (settingsModal) {
    settingsModal.style.display = 'flex';
    updateSettingsUI();
  }
}

function closeSettingsModal() {
  if (settingsModal) {
    settingsModal.style.display = 'none';
  }
}

function updateSettingsUI() {
  const language = AppState.get('language');
  const fontSize = AppState.get('fontSize');
  const theme = AppState.get('theme');
  const translation = AppState.get('translation');

  // Language
  const languageLabel = document.getElementById('language-label');
  if (languageLabel) {
    languageLabel.textContent = language === 'ar' ? 'عربي' : 'English';
  }

  // Font size
  const fontSizeSlider = document.getElementById('font-size-slider');
  const fontSizeValue = document.getElementById('font-size-value');
  if (fontSizeSlider) fontSizeSlider.value = fontSize;
  if (fontSizeValue) fontSizeValue.textContent = `${fontSize}px`;

  // Theme
  const themeLabel = document.getElementById('theme-label');
  if (themeLabel) {
    themeLabel.textContent = theme === 'dark' ? '🌙 Dark' : '☀️ Light';
  }

  // Translation
  const translationSelect = document.getElementById('translation-select');
  if (translationSelect) translationSelect.value = translation;
}

function handleLanguageToggle() {
  const currentLanguage = AppState.get('language');
  const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';

  AppState.set('language', newLanguage);
  StorageService.saveLanguage(newLanguage);

  // Update UI
  updateSettingsUI();

  // Apply language change to document
  document.documentElement.lang = newLanguage;
  document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
}

function handleFontSizeChange(e) {
  const fontSize = parseInt(e.target.value);

  AppState.set('fontSize', fontSize);
  StorageService.saveFontSize(fontSize);

  // Update UI
  const fontSizeValue = document.getElementById('font-size-value');
  if (fontSizeValue) fontSizeValue.textContent = `${fontSize}px`;

  // Apply font size to root
  document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
}

function handleThemeToggle() {
  const currentTheme = AppState.get('theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  AppState.set('theme', newTheme);
  StorageService.saveTheme(newTheme);

  // Update UI
  updateSettingsUI();

  // Apply theme to document
  document.documentElement.setAttribute('data-theme', newTheme);
}

function handleTranslationChange(e) {
  const translation = e.target.value;

  AppState.set('translation', translation);
  StorageService.saveTranslation(translation);

  // Note: User will need to refresh current view to see new translation
  // We could add auto-refresh here if desired
}

// Apply all settings from state
export function applySettings() {
  const theme = AppState.get('theme');
  const fontSize = AppState.get('fontSize');
  const language = AppState.get('language');

  // Apply theme
  document.documentElement.setAttribute('data-theme', theme);

  // Apply font size
  document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);

  // Apply language
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
}
