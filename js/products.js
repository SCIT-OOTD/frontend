/* products.js */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Lucide 아이콘 초기화
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 2. 요소 선택
    const sizeSelect = document.getElementById('size-select');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const totalPriceBox = document.getElementById('total-price-box');
    const tabLinks = document.querySelectorAll('.tab-link');
    const sections = document.querySelectorAll('.detail-section');

    // 3. 사이즈 선택 이벤트 (장바구니 버튼 활성화 및 가격 표시)
    if (sizeSelect) {
        sizeSelect.addEventListener('change', (e) => {
            const selectedValue = e.target.value;
            if (selectedValue) {
                addToCartBtn.disabled = false;
                totalPriceBox.classList.remove('hidden');
            } else {
                addToCartBtn.disabled = true;
                totalPriceBox.classList.add('hidden');
            }
        });
    }

    // 4. 장바구니 담기 이벤트 (로컬 스토리지 저장)
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (sizeSelect.value === "") {
                alert("옵션(사이즈)을 선택해주세요.");
                return;
            }
            addItemToCart();
        });
    }

    // 5. 탭 메뉴 스크롤 및 활성화 처리
    // 5.1. 탭 클릭 시 부드러운 이동
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 5.2. 스크롤 시 현재 위치에 맞는 탭 활성화 (IntersectionObserver)
    const observerOptions = {
        root: null, rootMargin: '-160px 0px -50% 0px', threshold: 0
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                tabLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);
    sections.forEach(section => observer.observe(section));

    // 초기 카트 카운트 업데이트
    updateCartCount();
});

/* * ============================================================
 * [핵심 기능] 메인 이미지 변경 함수
 * 왼쪽 썸네일(thumbElement) 클릭 시 호출되어 오른쪽 큰 이미지(mainImage)를 교체합니다.
 * ============================================================
 */
function changeMainImage(thumbElement) {
    const mainImage = document.getElementById('main-product-image');

    // 썸네일의 이미지 주소를 가져와서 메인 이미지 주소로 덮어씌움
    const newSrc = thumbElement.src;
    mainImage.src = newSrc;

    // 클릭된 썸네일에만 테두리 표시 (active 클래스 이동)
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumbElement.classList.add('active');
}

/* === 장바구니 담기 로직 (로컬 스토리지 활용) === */
function addItemToCart() {
    const productTitle = document.querySelector('.product-title').innerText;
    const productId = document.querySelector('.product-title').dataset.id;
    const selectedSize = document.getElementById('size-select').value;
    const priceStr = document.querySelector('.final-price').innerText;
    const price = parseInt(priceStr.replace(/[^0-9]/g, '')); // 숫자만 추출
    const imageUrl = document.getElementById('main-product-image').src;

    const newItem = {
        id: `${productId}-${selectedSize}`, // 유니크 ID 생성
        productId: productId,
        name: productTitle,
        option: selectedSize,
        price: price,
        quantity: 1,
        image: imageUrl
    };

    // 기존 카트 데이터 가져오기
    let cart = JSON.parse(localStorage.getItem('ootdCart')) || [];

    // 중복 상품 체크
    const existingItemIndex = cart.findIndex(item => item.id === newItem.id);

    if (existingItemIndex > -1) {
        // 이미 있으면 수량만 증가
        cart[existingItemIndex].quantity += 1;
        alert("이미 장바구니에 담긴 상품입니다. 수량이 추가되었습니다.");
    } else {
        // 없으면 새로 추가
        cart.push(newItem);
        alert("장바구니에 상품이 담겼습니다.");
    }

    // 로컬 스토리지 저장 및 카운트 업데이트
    localStorage.setItem('ootdCart', JSON.stringify(cart));
    updateCartCount();
}

/* === 헤더 카트 카운트 업데이트 === */
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('ootdCart')) || [];
        // 전체 수량 합산
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.innerText = totalQuantity;
    }
}