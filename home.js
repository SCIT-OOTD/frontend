document.addEventListener("DOMContentLoaded", () => {
    initCarousel(); // 캐러셀 초기화
    
    // Lucide 아이콘 리로드 (동적 생성된 요소 대응)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

/* =========================================
   1. Center Mode Carousel Logic (기존 유지 + 최적화)
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
        const itemMargin = 40; // CSS margin 좌우 합
        const totalItemWidth = itemWidth + itemMargin;

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

    // 전역 함수로 등록
    window.moveCarousel = (direction) => {
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = items.length - 1;
        if (currentIndex >= items.length) currentIndex = 0;
        updateCarousel();
    };

    window.addEventListener('resize', updateCarousel);
    // 초기 실행
    setTimeout(updateCarousel, 100); 
    
    // 자동 슬라이드
    setInterval(() => window.moveCarousel(1), 5000);
}


/* =========================================
   2. "Load More" 실제 구현 (AJAX Fetch)
   ========================================= */
let currentPage = 1; // 현재 페이지 상태 관리
let isLoading = false; // 중복 호출 방지

async function loadMoreProducts() {
    if (isLoading) return;
    
    const btn = document.querySelector('button[onclick="loadMoreProducts()"]');
    const originalText = btn.innerText;
    
    // 1. 로딩 UI 표시
    isLoading = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin w-4 h-4 inline mr-2"></i> LOADING...`;
    lucide.createIcons();
    btn.disabled = true;

    try {
        // 2. 실제 서버 데이터 요청 (GET /api/products?page=2)
        // 주의: 실제 백엔드 컨트롤러가 없으면 404 에러가 발생합니다.
        // 테스트를 위해 아래 URL을 실제 API 주소로 맞춰야 합니다.
        const response = await fetch(`/api/products?page=${currentPage + 1}`);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const newProducts = await response.json(); // JSON 데이터 수신

        // 3. 데이터가 없으면 버튼 숨기기
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
        lucide.createIcons();

    } catch (error) {
        console.error("Failed to load products:", error);
        // 에러 시 사용자 피드백 (Toast 혹은 텍스트 변경)
        btn.innerText = "TRY AGAIN";
    } finally {
        // 6. 로딩 종료 (성공했으면 버튼 복구)
        if (btn.innerText !== "NO MORE ITEMS" && btn.innerText !== "TRY AGAIN") {
            btn.innerText = originalText;
            btn.disabled = false;
        }
        isLoading = false;
    }
}

// 상품 카드 HTML 생성 함수 (Thymeleaf 구조와 동일하게 맞춤)
function createProductCard(product) {
    // 숫자 포맷팅 (예: 12000 -> 12,000)
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