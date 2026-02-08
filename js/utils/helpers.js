// Helper Utility Functions

// Debounce function for search and other inputs
export function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Smooth scroll to element with offset
export function scrollToElement(elementId, offset = 100) {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    return true;
  }
  return false;
}

// Highlight element with animation
export function highlightElement(elementId, duration = 2000) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add('highlight-verse', 'target-verse');
    setTimeout(() => {
      element.classList.remove('highlight-verse');
    }, duration);
    return true;
  }
  return false;
}

// Format verse reference
export function formatVerseRef(surah, verse) {
  return `${surah}:${verse}`;
}

// Parse verse reference
export function parseVerseRef(ref) {
  const parts = ref.split(':');
  if (parts.length === 2) {
    return {
      surah: parseInt(parts[0]),
      verse: parseInt(parts[1])
    };
  }
  return null;
}

// Convert number to Arabic-Indic numerals
export function toArabicNumerals(num) {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => arabicNumerals[parseInt(d)] || d).join('');
}

// Show loading overlay
export function showLoading(message = 'Loading...') {
  const overlay = document.getElementById('loading-overlay');
  const text = overlay?.querySelector('.loading-text');
  if (overlay) {
    overlay.style.display = 'flex';
    if (text) text.textContent = message;
  }
}

// Hide loading overlay
export function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// Show error message
export function showError(message, containerId = 'main-content') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <span>⚠️ ${message}</span>
    <button onclick="this.parentElement.remove()">Dismiss</button>
  `;

  container.insertBefore(errorDiv, container.firstChild);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 5000);
}

// Truncate text with ellipsis
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Check if element is in viewport
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Generate unique ID
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Copy text to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Format number with commas
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Sanitize HTML to prevent XSS
export function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Get contrast color (black or white) for background
export function getContrastColor(hexColor) {
  // Remove # if present
  hexColor = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Wait for specified milliseconds
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry async function with exponential backoff
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await wait(delay);
    }
  }
}
