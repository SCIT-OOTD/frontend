/**
 * OOTD Home JavaScript
 * - Center Mode Carousel (롤링 배너)
 * - Load More Products (상품 더보기)
 */

document.addEventListener("DOMContentLoaded", () => {
    initCarousel(); // 캐러셀 초기화
});

/* =========================================
   1. Center Mode Carousel Logic
   ========================================= */
function initCarousel() {
    const track = document.getElementById('track');
    if (!track) return;

    const items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    function updateCarousel() {
        const container = document.querySelector('.carousel-container');
        if (!container) return;
        
        const containerWidth = container.offsetWidth;
        const itemWidth = items[0].offsetWidth; 
        const itemMargin = 40; // CSS margin 좌우 합 (margin: 0 20px)
        const totalItemWidth = itemWidth + itemMargin;

        // 중앙 정렬을 위한 오프셋 계산
        const centerOffset = (containerWidth - itemWidth) / 2;
        // 첫 번째 아이템의 왼쪽 마진(20px) 보정
        const moveAmount = centerOffset - (totalItemWidth * currentIndex) - 20;

        track.style.transform = `translateX(${moveAmount}px)`;

        items.forEach((item, idx) => {
            if (idx === currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // 전역 함수로 등록 (HTML 버튼에서 호출 가능하도록)
    window.moveCarousel = (direction) => {
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = items.length - 1;
        if (currentIndex >= items.length) currentIndex = 0;
        updateCarousel();
    };

    window.addEventListener('resize', updateCarousel);
    
    // 초기 실행 (레이아웃 안정화 후)
    setTimeout(updateCarousel, 100); 
    
    // 자동 슬라이드 (5초마다)
    const autoSlide = setInterval(() => window.moveCarousel(1), 5000);
    
    // (선택 사항) 사용자가 직접 조작 시 자동 슬라이드 멈춤 등 추가 가능
}


/* =========================================
   2. "Load More" Products (AJAX Fetch)
   ========================================= */
let currentPage = 1; // 현재 페이지 상태
let isLoading = false; // 중복 호출 방지

async function loadMoreProducts() {
    if (isLoading) return;
    
    const btn = document.querySelector('button[onclick="loadMoreProducts()"]');
    const originalText = btn.innerText;
    
    // 1. 로딩 UI 표시
    isLoading = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-4 h-4 inline mr-2"></i> LOADING...`;
    
    // 새로 추가된 아이콘 렌더링 (common.js에 의존하거나 직접 호출)
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    btn.disabled = true;

    try {
        // 2. 실제 서버 데이터 요청 (예시 URL)
        // 실제 API 경로에 맞게 수정 필요 (/api/products 등)
        const response = await fetch(`/api/products?page=${currentPage + 1}`);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const newProducts = await response.json();

        // 3. 데이터가 없으면 버튼 숨기기 및 종료
        if (!newProducts || newProducts.length === 0) {
            btn.innerText = "NO MORE ITEMS";
            btn.classList.add('bg-gray-100', 'text-gray-400', 'border-gray-100');
            btn.classList.remove('hover:bg-black', 'hover:text-white');
            return;
        }

        // 4. 받아온 데이터로 HTML 생성 및 추가
        const grid = document.getElementById('product-grid');
        
        newProducts.forEach(product => {
            const productHTML = createProductCard(product);
            grid.insertAdjacentHTML('beforeend', productHTML);
        });

        // 5. 상태 업데이트
        currentPage++;
        
        // 동적으로 추가된 아이콘 렌더링
        if (typeof lucide !== 'undefined') lucide.createIcons();

    } catch (error) {
        console.warn("Failed to load products (Demo mode):", error);
        // 데모 모드일 경우 에러 대신 메시지 변경 (실제 구현 시 삭제)
        // btn.innerText = "TRY AGAIN";
    } finally {
        // 6. 로딩 종료 (성공했거나 더 이상 없을 때 제외하고 복구)
        if (btn.innerText !== "NO MORE ITEMS") {
            btn.innerText = "LOAD MORE +"; // 원래 텍스트로 복구
            btn.disabled = false;
        }
        isLoading = false;
    }
}

// 상품 카드 HTML 생성 함수
function createProductCard(product) {
    const formattedPrice = new Intl.NumberFormat('ko-KR').format(product.price);

    return `
        <div class="group cursor-pointer fade-in-up">
            <div class="relative aspect-[3/4] overflow-hidden mb-3 bg-gray-100 rounded-lg">
                <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <button class="absolute top-2 right-2 text-white hover:text-red-500 transition-colors drop-shadow-md">
                    <i data-lucide="heart" width="20" height="20"></i>
                </button>
            </div>
            <div>
                <p class="text-[9px] font-bold text-gray-400 uppercase mb-0.5">${product.brand}</p>
                <h4 class="text-xs text-gray-900 font-bold truncate mb-0.5">${product.name}</h4>
                <span class="text-sm font-bold block">${formattedPrice}</span>
            </div>
        </div>
    `;
}