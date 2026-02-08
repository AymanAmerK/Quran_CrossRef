const SURAH_NAMES = [
    { id: 1, name: "الفاتحة", englishName: "Al-Faatiha" },
    { id: 2, name: "البقرة", englishName: "Al-Baqara" },
    { id: 3, name: "آل عمران", englishName: "Aal-i-Imraan" },
    { id: 4, name: "النساء", englishName: "An-Nisaa" },
    { id: 5, name: "المائدة", englishName: "Al-Maaida" },
    { id: 6, name: "الأنعام", englishName: "Al-An'aam" },
    { id: 7, name: "الأعراف", englishName: "Al-A'raaf" },
    { id: 8, name: "الأنفال", englishName: "Al-Anfaal" },
    { id: 9, name: "التوبة", englishName: "At-Tawba" },
    { id: 10, name: "يونس", englishName: "Yunus" },
    { id: 11, name: "هود", englishName: "Hud" },
    { id: 12, name: "يوسف", englishName: "Yusuf" },
    { id: 13, name: "الرعد", englishName: "Ar-Ra'd" },
    { id: 14, name: "إبراهيم", englishName: "Ibrahim" },
    { id: 15, name: "الحجر", englishName: "Al-Hijr" },
    { id: 16, name: "النحل", englishName: "An-Nahl" },
    { id: 17, name: "الإسراء", englishName: "Al-Israa" },
    { id: 18, name: "الكهف", englishName: "Al-Kahf" },
    { id: 19, name: "مريم", englishName: "Maryam" },
    { id: 20, name: "طه", englishName: "Taa-Haa" },
    { id: 21, name: "الأنبياء", englishName: "Al-Anbiyaa" },
    { id: 22, name: "الحج", englishName: "Al-Hajj" },
    { id: 23, name: "المؤمنون", englishName: "Al-Mu'minoon" },
    { id: 24, name: "النور", englishName: "An-Noor" },
    { id: 25, name: "الفرقان", englishName: "Al-Furqaan" },
    { id: 26, name: "الشعراء", englishName: "Ash-Shu'araa" },
    { id: 27, name: "النمل", englishName: "An-Naml" },
    { id: 28, name: "القصص", englishName: "Al-Qasas" },
    { id: 29, name: "العنكبوت", englishName: "Al-Ankaboot" },
    { id: 30, name: "الروم", englishName: "Ar-Room" },
    { id: 31, name: "لقمان", englishName: "Luqman" },
    { id: 32, name: "السجدة", englishName: "As-Sajda" },
    { id: 33, name: "الأحزاب", englishName: "Al-Ahzaab" },
    { id: 34, name: "سبأ", englishName: "Saba" },
    { id: 35, name: "فاطر", englishName: "Faatir" },
    { id: 36, name: "يس", englishName: "Yaseen" },
    { id: 37, name: "الصافات", englishName: "As-Saaffaat" },
    { id: 38, name: "ص", englishName: "Saad" },
    { id: 39, name: "الزمر", englishName: "Az-Zumar" },
    { id: 40, name: "غافر", englishName: "Ghafir" },
    { id: 41, name: "فصلت", englishName: "Fussilat" },
    { id: 42, name: "الشورى", englishName: "Ash-Shura" },
    { id: 43, name: "الزخرف", englishName: "Az-Zukhruf" },
    { id: 44, name: "الدخان", englishName: "Ad-Dukhaan" },
    { id: 45, name: "الجاثية", englishName: "Al-Jaathiya" },
    { id: 46, name: "الأحقاف", englishName: "Al-Ahqaaf" },
    { id: 47, name: "محمد", englishName: "Muhammad" },
    { id: 48, name: "الفتح", englishName: "Al-Fath" },
    { id: 49, name: "الحجرات", englishName: "Al-Hujuraat" },
    { id: 50, name: "ق", englishName: "Qaaf" },
    { id: 51, name: "الذاريات", englishName: "Adh-Dhaariyat" },
    { id: 52, name: "الطور", englishName: "At-Toor" },
    { id: 53, name: "النجم", englishName: "An-Najm" },
    { id: 54, name: "القمر", englishName: "Al-Qamar" },
    { id: 55, name: "الرحمن", englishName: "Ar-Rahmaan" },
    { id: 56, name: "الواقعة", englishName: "Al-Waaqia" },
    { id: 57, name: "الحديد", englishName: "Al-Hadid" },
    { id: 58, name: "المجادلة", englishName: "Al-Mujaadila" },
    { id: 59, name: "الحشر", englishName: "Al-Hashr" },
    { id: 60, name: "الممتحنة", englishName: "Al-Mumtahana" },
    { id: 61, name: "الصف", englishName: "As-Saff" },
    { id: 62, name: "الجمعة", englishName: "Al-Jumu'a" },
    { id: 63, name: "المنافقون", englishName: "Al-Munaafiqoon" },
    { id: 64, name: "التغابن", englishName: "At-Taghaabun" },
    { id: 65, name: "الطلاق", englishName: "At-Talaaq" },
    { id: 66, name: "التحريم", englishName: "At-Tahreem" },
    { id: 67, name: "الملك", englishName: "Al-Mulk" },
    { id: 68, name: "القلم", englishName: "Al-Qalam" },
    { id: 69, name: "الحاقة", englishName: "Al-Haaqqa" },
    { id: 70, name: "المعارج", englishName: "Al-Ma'aarij" },
    { id: 71, name: "نوح", englishName: "Nooh" },
    { id: 72, name: "الجن", englishName: "Al-Jinn" },
    { id: 73, name: "المزمل", englishName: "Al-Muzzammil" },
    { id: 74, name: "المدثر", englishName: "Al-Muddaththir" },
    { id: 75, name: "القيامة", englishName: "Al-Qiyaama" },
    { id: 76, name: "الإنسان", englishName: "Al-Insaan" },
    { id: 77, name: "المرسلات", englishName: "Al-Mursalaat" },
    { id: 78, name: "النبأ", englishName: "An-Naba" },
    { id: 79, name: "النازعات", englishName: "An-Naazi'aat" },
    { id: 80, name: "عبس", englishName: "Abasa" },
    { id: 81, name: "التكوير", englishName: "At-Takweer" },
    { id: 82, name: "الانفطار", englishName: "Al-Infitaar" },
    { id: 83, name: "المطففين", englishName: "Al-Mutaffifeen" },
    { id: 84, name: "الانشقاق", englishName: "Al-Inshiqaaq" },
    { id: 85, name: "البروج", englishName: "Al-Burooj" },
    { id: 86, name: "الطارق", englishName: "At-Taariq" },
    { id: 87, name: "الأعلى", englishName: "Al-A'laa" },
    { id: 88, name: "الغاشية", englishName: "Al-Ghaashiya" },
    { id: 89, name: "الفجر", englishName: "Al-Fajr" },
    { id: 90, name: "البلد", englishName: "Al-Balad" },
    { id: 91, name: "الشمس", englishName: "Ash-Shams" },
    { id: 92, name: "الليل", englishName: "Al-Layl" },
    { id: 93, name: "الضحى", englishName: "Ad-Duhaa" },
    { id: 94, name: "الشرح", englishName: "Ash-Sharh" },
    { id: 95, name: "التين", englishName: "At-Teen" },
    { id: 96, name: "العلق", englishName: "Al-Alaq" },
    { id: 97, name: "القدر", englishName: "Al-Qadr" },
    { id: 98, name: "البينة", englishName: "Al-Bayyina" },
    { id: 99, name: "الزلزلة", englishName: "Az-Zalzala" },
    { id: 100, name: "العاديات", englishName: "Al-Aadiyaat" },
    { id: 101, name: "القارعة", englishName: "Al-Qaari'a" },
    { id: 102, name: "التكاثر", englishName: "At-Takaathur" },
    { id: 103, name: "العصر", englishName: "Al-Asr" },
    { id: 104, name: "الهمزة", englishName: "Al-Humaza" },
    { id: 105, name: "الفيل", englishName: "Al-Feel" },
    { id: 106, name: "قريش", englishName: "Quraish" },
    { id: 107, name: "الماعون", englishName: "Al-Maa'oon" },
    { id: 108, name: "الكوثر", englishName: "Al-Kawthar" },
    { id: 109, name: "الكافرون", englishName: "Al-Kaafiroon" },
    { id: 110, name: "النصر", englishName: "An-Nasr" },
    { id: 111, name: "المسد", englishName: "Al-Masad" },
    { id: 112, name: "الإخلاص", englishName: "Al-Ikhlaas" },
    { id: 113, name: "الفلق", englishName: "Al-Falaq" },
    { id: 114, name: "الناس", englishName: "An-Naas" }
];

// App State
let state = {
    viewMode: 'study', // 'study' or 'reading'
    currentSurah: 1,
    currentPage: 1,
    currentVerse: 1,
    language: 'en', // 'en' or 'ar'
    bookmarks: JSON.parse(localStorage.getItem('bookmarks') || '[]'),
    history: [], // For "go back" functionality
    cache: {}
};

// API Base URL
const API_BASE = 'https://api.alquran.cloud/v1';

// API Client
async function fetchQuranData(endpoint) {
    if (state.cache[endpoint]) {
        return state.cache[endpoint];
    }
    
    // Check if running via file:// protocol
    const isFileProtocol = window.location.protocol === 'file:';
    
    try {
        if (isFileProtocol) {
            // Use a JSONP-like approach or a CORS proxy that specifically handles file://
            // For api.alquran.cloud, we can try using their JSONP support if available, 
            // but usually, we can use a fetch with 'no-cors' only for simple requests.
            // Since we need the data, we'll try a standard fetch first and fallback to an informative error.
            const response = await fetch(`${API_BASE}/${endpoint}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            state.cache[endpoint] = data.data;
            return data.data;
        } else {
            const response = await fetch(`${API_BASE}/${endpoint}`);
            const data = await response.json();
            state.cache[endpoint] = data.data;
            return data.data;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        if (isFileProtocol) {
            alert("Security Error: Browsers block API calls when opening files directly. \\n\\nPlease use a local server (e.g., Python, Live Server) or try a browser like Safari which is more lenient with local files.");
        }
        return null;
    }
}


async function getSurah(surahNumber) {
    const [arabic, english] = await Promise.all([
        fetchQuranData(`surah/${surahNumber}/quran-uthmani`),
        fetchQuranData(`surah/${surahNumber}/en.asad`)
    ]);
    return { arabic, english };
}

async function getPage(pageNumber) {
    const [arabic, english] = await Promise.all([
        fetchQuranData(`page/${pageNumber}/quran-uthmani`),
        fetchQuranData(`page/${pageNumber}/en.asad`)
    ]);
    return { arabic, english };
}

// DOM Elements
const contentArea = document.getElementById('content-area');
const surahSelector = document.getElementById('surah-selector');
const studyBtn = document.getElementById('study-mode-btn');
const readingBtn = document.getElementById('reading-mode-btn');
const connectionsFooter = document.getElementById('connections-footer');
const footerContent = document.getElementById('footer-content');
const modalOverlay = document.getElementById('modal-overlay');
const modalBody = document.getElementById('modal-body');

// Initialization
function init() {
    populateSurahSelector();
    setupEventListeners();
    render();
}

function populateSurahSelector() {
    SURAH_NAMES.forEach(surah => {
        const option = document.createElement('option');
        option.value = surah.id;
        option.textContent = `${surah.id}. ${surah.englishName} (${surah.name})`;
        surahSelector.appendChild(option);
    });
}

function setupEventListeners() {
    surahSelector.addEventListener('change', (e) => {
        if (e.target.value) {
            state.currentSurah = parseInt(e.target.value);
            state.currentVerse = 1;
            render();
        }
    });

    document.getElementById('quick-jump-btn').addEventListener('click', showQuickJump);
    document.getElementById('search-toggle-btn').addEventListener('click', showSearch);
    document.getElementById('settings-btn').addEventListener('click', showSettings);
    document.querySelector('.close-modal').addEventListener('click', closeModal);
}

// Settings Functionality
function showSettings() {
    let html = `
        <h3>Settings</h3>
        <div style="margin: 1.5rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <span>Dark Mode</span>
                <button onclick="toggleTheme()" style="padding: 0.5rem 1rem; border-radius: 20px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-color); cursor: pointer;">
                    ${document.body.classList.contains('dark-mode') ? '🌙 On' : '☀️ Off'}
                </button>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem;">Font Size</label>
                <input type="range" min="1" max="3" step="0.1" value="${state.fontSize || 1.5}" oninput="updateFontSize(this.value)" style="width: 100%;">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem;">Translation Language</label>
                <select id="setting-lang" onchange="updateLanguage(this.value)" style="width: 100%; padding: 0.5rem;">
                    <option value="en" ${state.language === 'en' ? 'selected' : ''}>English (Asad)</option>
                    <option value="ar" ${state.language === 'ar' ? 'selected' : ''}>Arabic (Tafsir coming soon)</option>
                </select>
            </div>
        </div>
    `;
    modalBody.innerHTML = html;
    modalOverlay.classList.remove('hidden');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    showSettings(); // Refresh UI
}

function updateFontSize(val) {
    state.fontSize = val;
    document.documentElement.style.setProperty('--font-size-arabic', `${val}rem`);
}

function updateLanguage(lang) {
    state.language = lang;
    render();
}


// Search Functionality
let searchTimeout;
function showSearch() {
    let html = `
        <h3>Search Quran</h3>
        <input type="text" id="search-input" placeholder="Search Arabic or English..." style="width: 100%; padding: 0.75rem; margin: 1rem 0; border: 1px solid var(--border-color); border-radius: 4px;">
        <div id="search-results" style="max-height: 50vh; overflow-y: auto;"></div>
    `;
    modalBody.innerHTML = html;
    modalOverlay.classList.remove('hidden');

    const searchInput = document.getElementById('search-input');
    searchInput.focus();
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => performSearch(e.target.value), 500);
    });
}

async function performSearch(query) {
    if (query.length < 3) return;
    const resultsArea = document.getElementById('search-results');
    resultsArea.innerHTML = '<p>Searching...</p>';

    try {
        const response = await fetch(`${API_BASE}/search/${query}/all/en.asad`);
        const data = await response.json();
        
        if (!data.data || data.data.results.length === 0) {
            resultsArea.innerHTML = '<p>No results found.</p>';
            return;
        }

        let html = '';
        data.data.results.slice(0, 20).forEach(result => {
            html += `
                <div class="search-item" onclick="jumpToVerse(${result.surah.number}, ${result.numberInSurah}); closeModal()" style="padding: 0.75rem; border-bottom: 1px solid var(--border-color); cursor: pointer;">
                    <div style="font-size: 0.8rem; color: var(--accent-color);">${result.surah.englishName} (${result.surah.number}:${result.numberInSurah})</div>
                    <p style="font-size: 0.9rem;">${result.text}</p>
                </div>`;
        });
        resultsArea.innerHTML = html;
    } catch (error) {
        resultsArea.innerHTML = '<p>Search error.</p>';
    }
}


function setViewMode(mode) {
    state.viewMode = mode;
    studyBtn.classList.toggle('active', mode === 'study');
    readingBtn.classList.toggle('active', mode === 'reading');
    render();
}

// Data Helpers
function getLinksForVerse(surah, verse) {
    const key = `${surah}:${verse}`;
    return QURAN_LINKS[key] || [];
}

async function getVerseText(surah, verse) {
    const data = await fetchQuranData(`ayah/${surah}:${verse}/quran-uthmani`);
    return data ? data.text : 'Text not found';
}

async function renderStudyMode() {
    const { arabic, english } = await getSurah(state.currentSurah);
    if (!arabic || !english) {
        contentArea.innerHTML = '<p>Error loading data. Please try again.</p>';
        return;
    }

    let html = `<div class="study-view">
        <h2 class="surah-title" style="text-align: center; margin-bottom: 2rem;">${state.currentSurah}. ${arabic.name} (${arabic.englishName})</h2>`;

    for (let i = 0; i < arabic.ayahs.length; i++) {
        const ayahAr = arabic.ayahs[i];
        const ayahEn = english.ayahs[i];
        const links = getLinksForVerse(state.currentSurah, ayahAr.numberInSurah);

        html += `
            <div class="verse-card" id="verse-${ayahAr.numberInSurah}">
                <div class="verse-header">
                    <span>${state.currentSurah}:${ayahAr.numberInSurah}</span>
                    <div class="verse-actions">
                        <button onclick="toggleBookmark(${state.currentSurah}, ${ayahAr.numberInSurah})">🔖</button>
                    </div>
                </div>
                <p class="arabic-text" style="font-size: 1.8rem; margin-bottom: 1rem;">${ayahAr.text}</p>
                <p class="english-text" style="color: var(--text-color); opacity: 0.8; margin-bottom: 1rem;">${ayahEn.text}</p>
                ${links.length > 0 ? `
                    <div class="connections-container" style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
                        <details>
                            <summary style="cursor: pointer; color: var(--accent-color); font-weight: bold;">${links.length} Connection${links.length > 1 ? 's' : ''}</summary>
                            <div class="connections-list" style="margin-top: 0.5rem;">
                                ${links.map(link => `
                                    <div class="connected-verse" onclick="jumpToVerse(${link.surah}, ${link.verse})" style="background: rgba(39, 174, 96, 0.05); padding: 0.5rem; border-radius: 4px; margin-bottom: 0.5rem; cursor: pointer;">
                                        <div style="font-size: 0.8rem; color: var(--accent-color);">${link.surah}:${link.verse} (${link.type})</div>
                                        <p class="connected-text-placeholder" data-surah="${link.surah}" data-verse="${link.verse}" style="font-family: var(--font-arabic); direction: rtl; font-size: 1.2rem;"></p>
                                    </div>
                                `).join('')}
                            </div>
                        </details>
                    </div>
                `: ''}
            </div>`;
    }

    html += '</div>';
    contentArea.innerHTML = html;

    fetchConnectedTexts();
}

async function fetchConnectedTexts() {
    const placeholders = document.querySelectorAll('.connected-text-placeholder');
    for (const el of placeholders) {
        const surah = el.dataset.surah;
        const verse = el.dataset.verse;
        const text = await getVerseText(surah, verse);
        el.textContent = text;
    }
}

async function renderReadingMode() {
    const { arabic, english } = await getPage(state.currentPage);
    if (!arabic) {
        contentArea.innerHTML = '<p>Error loading page data.</p>';
        return;
    }

    let html = `<div class="reading-view">
        <div class="page-header" style="text-align: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
            Page ${state.currentPage}
        </div>
        <div class="mushaf-container" style="text-align: justify; direction: rtl; line-height: 2.5;">`;

    const allLinksOnPage = [];

    arabic.ayahs.forEach((ayah, index) => {
        const links = getLinksForVerse(ayah.surah.number, ayah.numberInSurah);
        if (links.length > 0) {
            allLinksOnPage.push({ from: `${ayah.surah.number}:${ayah.numberInSurah}`, links });
        }

        html += `<span class="arabic-text" id="verse-${ayah.surah.number}-${ayah.numberInSurah}" style="font-size: 1.8rem;">
            ${ayah.text} 
            <span class="verse-number" style="font-size: 0.8rem; color: var(--accent-color); border: 1px solid var(--accent-color); border-radius: 50%; padding: 2px 5px; margin: 0 5px;">${ayah.numberInSurah}</span>
            ${links.length > 0 ? `<sup style="color: var(--accent-color); font-size: 0.6rem; margin-left: -10px;">${links.length}</sup>`: ''}
        </span> `;
    });

    html += `</div>
        <div class="pagination-controls" style="display: flex; justify-content: space-between; margin-top: 2rem;">
            <button onclick="changePage(-1)" ${state.currentPage <= 1 ? 'disabled' : ''}>Previous Page</button>
            <button onclick="changePage(1)" ${state.currentPage >= 604 ? 'disabled' : ''}>Next Page</button>
        </div>
    </div>`;

    contentArea.innerHTML = html;
    renderConnectionsFooter(allLinksOnPage);
}

async function renderConnectionsFooter(allLinks) {
    if (allLinks.length === 0) {
        connectionsFooter.classList.add('hidden');
        return;
    }

    connectionsFooter.classList.remove('hidden');
    let footerHtml = `<h3 style="margin-bottom: 1rem; border-bottom: 2px solid var(--accent-color);">Page Connections</h3>`;

    for (const item of allLinks) {
        footerHtml += `<div class="footer-group" style="margin-bottom: 1.5rem;">
            <div style="font-weight: bold; color: var(--accent-color); margin-bottom: 0.5rem;">From Verse ${item.from}</div>`;
        for (const link of item.links) {
            const connectedText = await getVerseText(link.surah, link.verse);
            footerHtml += `
                <div class="connected-item" onclick="jumpToVerse(${link.surah}, ${link.verse})" style="background: rgba(39, 174, 96, 0.05); padding: 0.8rem; border-radius: 6px; margin-bottom: 0.5rem; cursor: pointer;">
                    <div style="font-size: 0.8rem; opacity: 0.7;">To ${link.surah}:${link.verse} (${link.type})</div>
                    <p class="arabic-text" style="font-size: 1.2rem;">${connectedText}</p>
                </div>`;
        }
        footerHtml += `</div>`;
    }
    footerContent.innerHTML = footerHtml;
}

function changePage(delta) {
    state.currentPage += delta;
    if (state.currentPage < 1) state.currentPage = 1;
    if (state.currentPage > 604) state.currentPage = 604;
    render();
}

async function jumpToVerse(surah, verse) {
    state.history.push({ viewMode: state.viewMode, currentSurah: state.currentSurah, currentPage: state.currentPage, currentVerse: state.currentVerse });
    state.currentSurah = surah;
    state.currentVerse = verse;

    if (state.viewMode === 'reading') {
        const metadata = await fetchQuranData(`ayah/${surah}:${verse}`);
        if (metadata) state.currentPage = metadata.page;
    }
    await render();
    const verseId = state.viewMode === 'reading' ? `verse-${surah}-${verse}`: `verse-${verse}`;
    const verseEl = document.getElementById(verseId);
    if (verseEl) verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function goBack() {
    if (state.history.length > 0) {
        const prevState = state.history.pop();
        state.viewMode = prevState.viewMode;
        state.currentSurah = prevState.currentSurah;
        state.currentPage = prevState.currentPage;
        state.currentVerse = prevState.currentVerse;
        setViewMode(state.viewMode);
    }
}

function showQuickJump() {
    let html = `
        <h3>Quick Jump</h3>
        <div style="margin: 1rem 0;">
            <label>Surah:</label>
            <select id="jump-surah" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;">
                ${SURAH_NAMES.map(s => `<option value="${s.id}" ${s.id === state.currentSurah ? 'selected' : ''}>${s.id}. ${s.englishName}</option>`).join('')}
            </select>
            <label>Verse:</label>
            <input type="number" id="jump-verse" value="${state.currentVerse}" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;">
            <button onclick="performJump()" style="width: 100%; padding: 0.75rem; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Jump</button>
        </div>
        ${state.history.length > 0 ? `<button onclick="goBack(); closeModal()" style="width: 100%; padding: 0.5rem; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 4px; margin-top: 0.5rem; cursor: pointer; width: 100%;">Go Back to Previous Location</button>`: ''}
    `;
    modalBody.innerHTML = html;
    modalOverlay.classList.remove('hidden');
}

function performJump() {
    const surah = parseInt(document.getElementById('jump-surah').value);
    const verse = parseInt(document.getElementById('jump-verse').value);
    closeModal();
    jumpToVerse(surah, verse);
}

function closeModal() {
    modalOverlay.classList.add('hidden');
}

function toggleBookmark(surah, verse) {
    const key = `${surah}:${verse}`;
    const index = state.bookmarks.indexOf(key);
    if (index === -1) state.bookmarks.push(key);
    else state.bookmarks.splice(index, 1);
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

async function render() {
    contentArea.innerHTML = `<p style="text-align: center; margin-top: 2rem;">Loading...</p>`;
    if (state.viewMode === 'study') {
        connectionsFooter.classList.add('hidden');
        await renderStudyMode();
    } else {
        await renderReadingMode();
    }
}

window.addEventListener('DOMContentLoaded', init);