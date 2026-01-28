/* cart.js */
document.addEventListener('DOMContentLoaded', () => {
    // Lucide 아이콘 초기화
    if (window.lucide) lucide.createIcons();

    // 1. 체크박스 계층 로직
    const selectAll = document.getElementById('select-all');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const allChecks = document.querySelectorAll('.brand-checkbox, .item-checkbox');
            allChecks.forEach(c => c.checked = this.checked);
            updateTotalPrice();
        });
    }

    // 브랜드 및 상품 체크박스 이벤트 바인딩
    setupCheckboxEvents();

    // 초기 금액 및 카운트 계산
    updateTotalPrice();
    updateCartCount();
});

function setupCheckboxEvents() {
    document.querySelectorAll('.cart-brand-section').forEach(section => {
        const brandCheck = section.querySelector('.brand-checkbox');
        const itemsInBrand = section.querySelectorAll('.item-checkbox');

        if(brandCheck) {
            brandCheck.addEventListener('change', function() {
                itemsInBrand.forEach(c => c.checked = this.checked);
                syncSelectAll();
                updateTotalPrice();
            });
        }

        itemsInBrand.forEach(itemCheck => {
            itemCheck.addEventListener('change', () => {
                const checkedCount = section.querySelectorAll('.item-checkbox:checked').length;
                if(brandCheck) brandCheck.checked = (itemsInBrand.length === checkedCount);
                syncSelectAll();
                updateTotalPrice();
            });
        });
    });
}

function updateTotalPrice() {
    let total = 0;
    document.querySelectorAll('.item-checkbox:checked').forEach(check => {
        const item = check.closest('.cart-item');
        if(item) total += parseInt(item.getAttribute('data-price')) || 0;
    });
    const formatted = total.toLocaleString() + '원';
    ['final-price', 'btn-total-price', 'total-product-price'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.innerText = formatted;
    });
}

function syncSelectAll() {
    const selectAll = document.getElementById('select-all');
    const allItems = document.querySelectorAll('.item-checkbox');
    const checkedItems = document.querySelectorAll('.item-checkbox:checked');
    if (selectAll) selectAll.checked = (allItems.length === checkedItems.length && allItems.length > 0);
}

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    const items = document.querySelectorAll('.cart-item');
    if (countElement) countElement.innerText = items.length;
}