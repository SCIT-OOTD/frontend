/**
 * 찜 목록(Wishlist) 페이지 전용 스크립트
 */

document.addEventListener("DOMContentLoaded", () => {
    // 필요한 초기화 로직이 있다면 여기에 작성
});

// 카테고리 필터링 함수
function filterCategory(category) {
    // 1. 탭 버튼 스타일 변경
    document.querySelectorAll('.category-btn').forEach(btn => {
        if(btn.dataset.category === category) {
            btn.classList.add('bg-black', 'text-white', 'border-black');
            btn.classList.remove('bg-white', 'text-gray-500', 'border-gray-200');
        } else {
            btn.classList.remove('bg-black', 'text-white', 'border-black');
            btn.classList.add('bg-white', 'text-gray-500', 'border-gray-200');
        }
    });

    // 2. 상품 그리드 필터링 (UI Only - 백엔드 연동 전 임시)
    const items = document.querySelectorAll('.product-card');
    
    items.forEach(item => {
        // 실제로는 백엔드 데이터에 category 필드가 있어야 함. 
        const itemCat = item.dataset.category || 'all'; 
        
        if (category === 'all' || itemCat === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// 개별 상품 삭제 (하트 버튼 클릭 시)
function removeWishItem(event, itemId) {
    event.stopPropagation(); // 부모 링크 클릭 방지
    event.preventDefault(); 

    // 확인 창 없이 즉시 삭제 로직 실행
    
    // TODO: 백엔드 API 연동 시 여기서 DELETE 요청 전송
    // fetch('/api/wishlist/' + itemId, { method: 'DELETE' })...
    
    // UI에서 즉시 제거
    const card = document.getElementById(`wish-item-${itemId}`);
    if (card) {
        card.remove();
        updateCount();
    }
}

// 장바구니 담기
function addToCart(event, itemId) {
    event.stopPropagation();
    event.preventDefault();
}

// 상품 개수 UI 업데이트
function updateCount() {
    const cards = document.querySelectorAll('.product-card');
    const countEl = document.getElementById('wishlist-count');
    
    // 현재 화면에 남아있는 카드 수로 갱신
    if(countEl) countEl.innerText = cards.length;
    
    // 모두 삭제되어 0개가 되면 페이지 새로고침 (Empty State 표시를 위해)
    if(cards.length === 0) {
        location.reload(); 
    }
}