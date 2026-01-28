/* category_js.js */

let selectedPrice = 1000000;

// 찜 하트 토글 함수
function toggleWish(element, event) {
    // 이벤트 객체 가져오기 및 전파 방지 (상세페이지 이동 막기)
    const e = event || window.event;
    if (e) e.stopPropagation();

    // 클래스 토글
    element.classList.toggle('active');

    // 아이콘 형태 변경
    if (element.classList.contains('active')) {
        element.classList.replace('fa-regular', 'fa-solid');
        // 직접 색상 부여 (CSS 우선순위 문제 해결용)
        element.style.setProperty('color', '#ff4d4f', 'important');
    } else {
        element.classList.replace('fa-solid', 'fa-regular');
        element.style.setProperty('color', '', '');
    }
}

// 가격 슬라이더 업데이트
function updatePrice(val) {
    selectedPrice = val;
    document.getElementById('price-display').innerText = `0원 ~ ${Number(val).toLocaleString()}원`;
    renderChips();
}

// 필터 칩 렌더링
function renderChips() {
    const container = document.getElementById('selected-chips');
    if(!container) return;
    container.innerHTML = '';

    const checkboxes = document.querySelectorAll('.filter-check:checked');
    checkboxes.forEach(cb => {
        createChip(cb.getAttribute('data-name'), () => {
            cb.checked = false;
            renderChips();
        });
    });

    if (selectedPrice < 1000000) {
        createChip(`~${Number(selectedPrice).toLocaleString()}원`, () => {
            const slider = document.getElementById('price-range');
            if(slider) {
                slider.value = 1000000;
                updatePrice(1000000);
            }
        });
    }
}

function createChip(text, onRemove) {
    const container = document.getElementById('selected-chips');
    const chip = document.createElement('div');
    chip.className = 'filter-chip';
    chip.innerHTML = `<span class="remove-btn">✕</span> <span>${text}</span>`;
    chip.querySelector('.remove-btn').onclick = onRemove;
    container.appendChild(chip);
}

// 드롭다운 토글
function toggleDropdown(id) {
    const menu = document.getElementById(id);
    if(!menu) return;
    const isActive = menu.classList.contains('active');

    document.querySelectorAll('.filter-dropdown').forEach(m => m.classList.remove('active'));

    if (!isActive) menu.classList.add('active');
}

// 페이지 로드 시 초기화
window.onload = () => {
    const productCountDisplay = document.getElementById('product-count');
    if(productCountDisplay) {
        const productCount = document.querySelectorAll('.product-card').length;
        productCountDisplay.innerText = productCount;
    }
};