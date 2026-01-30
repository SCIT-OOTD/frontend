/**
 * 마이페이지(Dashboard) 전용 스크립트
 * - 대시보드 내 관심상품 미리보기 삭제 기능 등 페이지 고유 로직
 */

// 관심상품 삭제 핸들러 (대시보드 미리보기용)
function removeWish(event, id) {
    // 부모 요소(카드 이동 링크)로 클릭 이벤트가 전파되는 것을 방지
    event.stopPropagation();

    if(confirm("관심 상품에서 삭제하시겠습니까?")) {
        // TODO: 백엔드 API 연동 시 실제 삭제 AJAX 요청 (fetch/axios) 구현 필요
        // 예: fetch('/api/wishlist/' + id, { method: 'DELETE' })...

        // UI에서 즉시 제거 (낙관적 업데이트)
        // .group 클래스는 product-card를 감싸고 있는 컨테이너
        const card = event.target.closest('.group');
        
        if(card) {
            // 삭제 애니메이션 효과 (선택 사항)
            card.style.transition = "opacity 0.3s, transform 0.3s";
            card.style.opacity = "0";
            card.style.transform = "scale(0.9)";
            
            setTimeout(() => {
                card.remove();
                
                // 모든 카드가 지워졌을 때 '상품 없음' 메시지 표시 로직 등을 여기에 추가 가능
                checkEmptyState(); 
            }, 300);
        }
    }
}

// (선택사항) 리스트가 비었는지 확인하여 UI 갱신하는 헬퍼 함수
function checkEmptyState() {
    const remainingItems = document.querySelectorAll('.group'); // .group은 위시리스트 아이템 카드 클래스라고 가정
    const container = document.querySelector('.grid'); // 그리드 컨테이너
    
    // 만약 남아있는 아이템이 없고, 컨테이너가 존재한다면
    if (remainingItems.length === 0 && container) {
        // 기존 그리드 내용을 비우고 메시지 표시
        container.innerHTML = `
            <div class="col-span-4 text-center py-10 text-xs text-gray-400 bg-gray-50 rounded-lg">
                관심 상품이 없습니다.
            </div>
        `;
    }
}