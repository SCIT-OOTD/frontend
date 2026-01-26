/* category_js.js */

let selectedPrice = 1000000;

// 찜 하트 토글 함수
function toggleWish(element) {
    element.classList.toggle('active');
    if (element.classList.contains('active')) {
        element.classList.replace('fa-regular', 'fa-solid');
    } else {
        element.classList.replace('fa-solid', 'fa-regular');
    }
    event.stopPropagation();
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
    container.innerHTML = '';

    // 체크박스 기반 필터
    const checkboxes = document.querySelectorAll('.filter-check:checked');
    checkboxes.forEach(cb => {
        createChip(cb.getAttribute('data-name'), () => {
            cb.checked = false;
            renderChips();
        });
    });

    // 가격 기반 필터 (100만원 이하일 때 표시)
    if (selectedPrice < 1000000) {
        createChip(`~${Number(selectedPrice).toLocaleString()}원`, () => {
            const slider = document.getElementById('price-range');
            slider.value = 1000000;
            updatePrice(1000000);
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
    const isActive = menu.classList.contains('active');

    // 다른 열려있는 드롭다운 닫기
    document.querySelectorAll('.filter-dropdown').forEach(m => m.classList.remove('active'));

    if (!isActive) menu.classList.add('active');
}

// 페이지 로드 시 초기화
window.onload = () => {
    const productCount = document.querySelectorAll('.product-card').length;
    document.getElementById('product-count').innerText = productCount;
};