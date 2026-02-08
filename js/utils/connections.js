// Connection Lookup Logic for QURAN_LINKS

// Get QURAN_LINKS from global scope (loaded from quran_links.js)
function getQuranLinks() {
  return window.QURAN_LINKS || {};
}

// Parse verse range (e.g., "2:1-5" or "2:1")
export function parseVerseRange(rangeStr) {
  const parts = rangeStr.split(':');
  if (parts.length !== 2) return null;

  const surah = parseInt(parts[0]);
  const versePart = parts[1];

  if (versePart.includes('-')) {
    const [start, end] = versePart.split('-').map(Number);
    return {
      surah,
      verseStart: start,
      verseEnd: end,
      isRange: true
    };
  } else {
    const verse = parseInt(versePart);
    return {
      surah,
      verse,
      isRange: false
    };
  }
}

// Check if a verse is in a range
export function isVerseInRange(surah, verse, rangeStr) {
  const range = parseVerseRange(rangeStr);
  if (!range) return false;

  if (range.isRange) {
    return range.surah === surah && verse >= range.verseStart && verse <= range.verseEnd;
  } else {
    return range.surah === surah && range.verse === verse;
  }
}

// Get all connections for a specific verse
export function getConnectionsForVerse(surah, verse) {
  const links = getQuranLinks();
  const connections = [];
  const ref = `${surah}:${verse}`;

  // Direct lookup
  if (links[ref]) {
    connections.push(...links[ref]);
  }

  // Check for range keys that include this verse
  Object.keys(links).forEach(key => {
    if (key.includes('-') && isVerseInRange(surah, verse, key)) {
      connections.push(...links[key]);
    }
  });

  // Remove duplicates based on surah:verse combination
  const unique = [];
  const seen = new Set();

  connections.forEach(conn => {
    const connRef = `${conn.surah}:${conn.verse}`;
    if (!seen.has(connRef)) {
      seen.add(connRef);
      unique.push(conn);
    }
  });

  return unique;
}

// Get all connections for multiple verses (used in Reading Mode)
export function getConnectionsForVerses(verseRefs) {
  const allConnections = [];
  const seenTargets = new Set();

  verseRefs.forEach(ref => {
    const parsed = parseVerseRef(ref);
    if (parsed) {
      const connections = getConnectionsForVerse(parsed.surah, parsed.verse);
      connections.forEach(conn => {
        const targetRef = `${conn.surah}:${conn.verse}`;
        if (!seenTargets.has(targetRef)) {
          seenTargets.add(targetRef);
          allConnections.push({
            ...conn,
            originRef: ref
          });
        }
      });
    }
  });

  return allConnections;
}

// Parse simple verse reference
function parseVerseRef(ref) {
  const parts = ref.split(':');
  if (parts.length === 2) {
    return {
      surah: parseInt(parts[0]),
      verse: parseInt(parts[1])
    };
  }
  return null;
}

// Check if QURAN_LINKS is loaded
export function isQuranLinksLoaded() {
  return typeof window.QURAN_LINKS !== 'undefined' && window.QURAN_LINKS !== null;
}

// Get statistics about connections
export function getConnectionStats() {
  const links = getQuranLinks();
  const keys = Object.keys(links);
  let totalConnections = 0;

  keys.forEach(key => {
    totalConnections += links[key].length;
  });

  return {
    totalKeys: keys.length,
    totalConnections,
    averagePerKey: (totalConnections / keys.length).toFixed(2)
  };
}

// Get all verses that have connections
export function getVersesWithConnections() {
  const links = getQuranLinks();
  return Object.keys(links);
}

// Check if a verse has connections
export function hasConnections(surah, verse) {
  const connections = getConnectionsForVerse(surah, verse);
  return connections.length > 0;
}

// Group connections by type
export function groupConnectionsByType(connections) {
  const grouped = {};

  connections.forEach(conn => {
    const type = conn.type || 'Unknown';
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(conn);
  });

  return grouped;
}
