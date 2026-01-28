/**
 * OOTD Common JavaScript
 * - 전역 아이콘 초기화 (Lucide)
 * - 헤더 스크롤 인터랙션 (Sticky Header)
 * - 검색창 UI 및 데이터 로딩 로직
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. 아이콘 초기화
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. 헤더 스크롤 로직 (스크롤 시 검색창 숨김/표시)
    const headerSearchRow = document.getElementById('header-search-row');
    const stickySearchBtn = document.getElementById('sticky-search-btn');

    if (headerSearchRow && stickySearchBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                headerSearchRow.classList.add('hidden-row');
                stickySearchBtn.classList.add('visible');
            } else {
                headerSearchRow.classList.remove('hidden-row');
                stickySearchBtn.classList.remove('visible');
            }
        });
    }

    // 3. 검색창 이벤트 (포커스 시 데이터 동적 로드)
    const searchInput = document.getElementById('main-search-input');
    if (searchInput) {
        searchInput.addEventListener('focus', loadSearchData);
    }
});

/* ========== 검색창 열기 (Sticky 돋보기 아이콘 클릭 시) ========== */
function openSearch() {
    const headerSearchRow = document.getElementById('header-search-row');
    const stickySearchBtn = document.getElementById('sticky-search-btn');
    const mainSearchInput = document.getElementById('main-search-input');

    if (headerSearchRow && stickySearchBtn) {
        headerSearchRow.classList.remove('hidden-row');
        stickySearchBtn.classList.remove('visible');
        if (mainSearchInput) setTimeout(() => mainSearchInput.focus(), 100);
    }
}

/* ========== 검색 데이터 로드 (API) ========== */
let isSearchDataLoaded = false;

async function loadSearchData() {
    if (isSearchDataLoaded) return; // 이미 로드했으면 중복 요청 방지

    // 최근 검색어 & 인기 검색어 병렬 요청
    await Promise.all([fetchRecentSearches(), fetchTrendingKeywords()]);
    isSearchDataLoaded = true;
}

async function fetchRecentSearches() {
    const listContainer = document.getElementById('recent-search-list');
    if (!listContainer) return;

    try {
        const response = await fetch('/api/search/recent');
        if (!response.ok) throw new Error('No recent history');

        const keywords = await response.json();
        
        if (keywords.length === 0) {
            listContainer.innerHTML = '<span class="text-gray-600 text-[10px]">최근 검색 내역이 없습니다.</span>';
        } else {
            listContainer.innerHTML = keywords.map(keyword => `
                <span class="bg-black/40 px-3 py-1 rounded-full cursor-pointer hover:bg-black/60 transition-colors border border-white/5" 
                      onclick="insertKeyword('${keyword}')">
                    ${keyword}
                </span>
            `).join('');
        }
    } catch (error) {
        // API 오류 또는 데이터 없음 처리
        console.warn('Recent searches fetch failed (Backend might be offline):', error);
        listContainer.innerHTML = '<span class="text-gray-600 text-[10px]">검색 내역 없음</span>';
    }
}

async function fetchTrendingKeywords() {
    const listContainer = document.getElementById('trending-search-list');
    if (!listContainer) return;

    try {
        const response = await fetch('/api/search/trending');
        if (!response.ok) throw new Error('Failed to fetch trending');

        const trends = await response.json(); 
        
        listContainer.innerHTML = trends.map(item => {
            let statusIcon = '';
            if (item.status === 'UP') statusIcon = '<span class="text-red-500 text-[10px]">▲</span>';
            else if (item.status === 'DOWN') statusIcon = '<span class="text-blue-500 text-[10px]">▼</span>';
            else statusIcon = '<span class="text-gray-500 text-[10px]">-</span>';

            return `
                <li class="flex justify-between cursor-pointer hover:text-indigo-400 transition-colors py-1 border-b border-gray-800/50 last:border-0"
                    onclick="insertKeyword('${item.keyword}')">
                    <div class="flex gap-3">
                        <span class="font-black text-indigo-500 w-3">${item.rank}</span>
                        <span>${item.keyword}</span>
                    </div>
                    ${statusIcon}
                </li>
            `;
        }).join('');

    } catch (error) {
        console.warn('Trending keywords fetch failed (Backend might be offline):', error);
        listContainer.innerHTML = '<li class="text-gray-600 text-[10px]">순위 정보를 불러올 수 없습니다.</li>';
    }
}

function insertKeyword(keyword) {
    const input = document.getElementById('main-search-input');
    if (input) {
        input.value = keyword;
        input.focus();
    }
}