// API Service for Al Quran Cloud API

const API_BASE_URL = 'https://api.alquran.cloud/v1';
const CACHE = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const ApiService = {
  // Generic fetch with caching
  async fetchWithCache(url, cacheKey) {
    // Check cache
    if (CACHE[cacheKey] && Date.now() - CACHE[cacheKey].timestamp < CACHE_DURATION) {
      return CACHE[cacheKey].data;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();

      if (json.code !== 200 || json.status !== 'OK') {
        throw new Error(json.data || 'API returned error');
      }

      // Cache the result
      CACHE[cacheKey] = {
        data: json.data,
        timestamp: Date.now()
      };

      return json.data;
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  },

  // Fetch entire surah
  async fetchSurah(surahNumber, edition = 'quran-uthmani') {
    const url = `${API_BASE_URL}/surah/${surahNumber}/${edition}`;
    const cacheKey = `surah_${surahNumber}_${edition}`;
    return this.fetchWithCache(url, cacheKey);
  },

  // Fetch multiple editions of a surah in parallel
  async fetchSurahMultiEdition(surahNumber, editions = ['quran-uthmani', 'en.sahih']) {
    const promises = editions.map(edition => this.fetchSurah(surahNumber, edition));
    return Promise.all(promises);
  },

  // Fetch single verse
  async fetchVerse(surah, verse, edition = 'quran-uthmani') {
    const url = `${API_BASE_URL}/ayah/${surah}:${verse}/${edition}`;
    const cacheKey = `verse_${surah}_${verse}_${edition}`;
    return this.fetchWithCache(url, cacheKey);
  },

  // Fetch multiple verses in parallel
  async fetchMultipleVerses(verseRefs, edition = 'quran-uthmani') {
    const promises = verseRefs.map(ref => {
      const [surah, verse] = ref.split(':').map(Number);
      return this.fetchVerse(surah, verse, edition);
    });
    return Promise.all(promises);
  },

  // Fetch page
  async fetchPage(pageNumber, edition = 'quran-uthmani') {
    const url = `${API_BASE_URL}/page/${pageNumber}/${edition}`;
    const cacheKey = `page_${pageNumber}_${edition}`;
    return this.fetchWithCache(url, cacheKey);
  },

  // Fetch multiple editions of a page in parallel
  async fetchPageMultiEdition(pageNumber, editions = ['quran-uthmani', 'en.sahih']) {
    const promises = editions.map(edition => this.fetchPage(pageNumber, edition));
    return Promise.all(promises);
  },

  // Fetch tafsir
  async fetchTafsir(surah, verse, edition = 'ar.muyassar') {
    const url = `${API_BASE_URL}/ayah/${surah}:${verse}/${edition}`;
    const cacheKey = `tafsir_${surah}_${verse}_${edition}`;
    return this.fetchWithCache(url, cacheKey);
  },

  // Search Quran
  async searchQuran(query, surah = 'all', edition = 'quran-uthmani') {
    if (!query || query.trim().length < 2) {
      return { matches: [] };
    }

    const url = surah === 'all'
      ? `${API_BASE_URL}/search/${encodeURIComponent(query)}/${edition}`
      : `${API_BASE_URL}/search/${encodeURIComponent(query)}/${surah}/${edition}`;

    const cacheKey = `search_${query}_${surah}_${edition}`;

    try {
      return await this.fetchWithCache(url, cacheKey);
    } catch (error) {
      console.error('Search error:', error);
      return { matches: [] };
    }
  },

  // Get surah info
  async fetchSurahInfo(surahNumber) {
    const url = `${API_BASE_URL}/surah/${surahNumber}`;
    const cacheKey = `surah_info_${surahNumber}`;
    return this.fetchWithCache(url, cacheKey);
  },

  // Clear cache
  clearCache() {
    Object.keys(CACHE).forEach(key => delete CACHE[key]);
  },

  // Clear specific cache entry
  clearCacheEntry(key) {
    delete CACHE[key];
  }
};
