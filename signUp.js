/**
 * 회원가입 페이지 전용 스크립트 (signUp.js)
 * - 아이디/이메일 중복 확인
 * - 비밀번호 일치 확인
 * - 주소 찾기 (Daum Postcode API)
 * - 생년월일 동적 생성
 * - 약관 상세 팝업 제어
 */

// 약관 데이터 (더미 -> 실제 내용 채움)
const termsData = {
    terms: `제1조 (목적)
본 약관은 OOTD(이하 "회사")가 제공하는 인터넷 관련 서비스(이하 "서비스")를 이용함에 있어 사이버 몰과 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "몰"이란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.
2. "이용자"란 "몰"에 접속하여 본 약관에 따라 "몰"이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.

(중략: 상세 내용은 실제 운영 정책에 따름)`,

    privacy: `1. 개인정보 수집 및 이용 목적
회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.

2. 수집하는 개인정보 항목
이름, 로그인ID, 비밀번호, 자택 전화번호, 자택 주소, 휴대전화번호, 이메일, 생년월일

3. 개인정보의 보유 및 이용기간
원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.`,
    
    marketing: `1. 마케팅 정보 수신 동의
OOTD는 회원이 동의한 경우에 한하여, 할인 쿠폰 및 혜택, 이벤트, 신상품 소식 등 유익한 정보를 SMS나 이메일로 발송할 수 있습니다.

단, 주문/배송 관련 필수 안내는 수신 동의 여부와 상관없이 발송됩니다.`
};

// 약관 모달 열기
function openTermsModal(type) {
    const modal = document.getElementById('terms-modal');
    const title = document.getElementById('terms-title');
    const content = document.getElementById('terms-content');
    
    if (!modal || !content) return;

    if (type === 'terms') title.innerText = '서비스 이용 약관';
    else if (type === 'privacy') title.innerText = '개인정보 수집 및 이용';
    else if (type === 'marketing') title.innerText = '마케팅 정보 수신 동의';

    content.innerText = termsData[type] || '내용이 없습니다.';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('div').classList.remove('scale-95');
        modal.querySelector('div').classList.add('scale-100');
    }, 10);
}

// 약관 모달 닫기
function closeTermsModal() {
    const modal = document.getElementById('terms-modal');
    if (!modal) return;

    modal.classList.add('opacity-0');
    modal.querySelector('div').classList.remove('scale-100');
    modal.querySelector('div').classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('terms-modal');
    if (modal && e.target === modal) {
        closeTermsModal();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    initBirthDate();

    // 1. 아이디 유효성 검사 (실시간 경고)
    const userId = document.getElementById('userId');
    const idCheckMsg = document.getElementById('idCheckMsg');

    if (userId) {
        userId.addEventListener('input', () => {
            const value = userId.value;
            const regex = /^[a-z0-9]{5,10}$/; // 영문 소문자/숫자 5~10자

            if (value.length === 0) {
                idCheckMsg.innerText = "";
            } else if (!regex.test(value)) {
                idCheckMsg.innerText = "5~10자의 영문 소문자, 숫자만 사용 가능합니다.";
                idCheckMsg.style.color = "#ef4444"; // Red
            } else {
                idCheckMsg.innerText = ""; // 형식 맞으면 메시지 삭제 (중복확인은 버튼으로)
            }
            validateForm();
        });
    }

    // 2. 비밀번호 일치 확인
    const password = document.getElementById('password');
    const passwordCheck = document.getElementById('passwordCheck');
    const pwdMsg = document.getElementById('pwdMsg');

    function checkPasswordMatch() {
        if (!password.value || !passwordCheck.value) {
            pwdMsg.innerText = "";
            return;
        }
        if (password.value !== passwordCheck.value) {
            pwdMsg.innerText = "비밀번호가 일치하지 않습니다.";
            pwdMsg.style.color = "#ef4444"; // Red
        } else {
            pwdMsg.innerText = "비밀번호가 일치합니다.";
            pwdMsg.style.color = "#22c55e"; // Green
        }
        validateForm();
    }
    
    if (password && passwordCheck) {
        password.addEventListener('input', checkPasswordMatch);
        passwordCheck.addEventListener('input', checkPasswordMatch);
    }

    // 3. 주소 찾기
    const btnPostCode = document.getElementById('btnPostCode');
    if (btnPostCode) {
        btnPostCode.addEventListener('click', () => {
            new daum.Postcode({
                oncomplete: function(data) {
                    var roadAddr = data.roadAddress; 
                    document.getElementById('zipcode').value = data.zonecode;
                    document.getElementById("address").value = roadAddr;
                    document.getElementById("addressDetail").focus();
                    validateForm();
                }
            }).open();
        });
    }

    // 4. 아이디 중복 확인 (Mock)
    const btnIdCheck = document.getElementById('btnIdCheck');
    if (btnIdCheck) {
        btnIdCheck.addEventListener('click', () => {
            const idVal = document.getElementById('userId').value;
            const regex = /^[a-z0-9]{5,10}$/;
            
            if(!idVal) { alert("아이디를 입력해주세요."); return; }
            if (!regex.test(idVal)) { alert("아이디 형식을 확인해주세요."); return; }

            // TODO: fetch('/user/checkId', ...)
            
            // 임시 로직
            if (idVal === "admin") {
                idCheckMsg.innerText = "이미 사용 중인 아이디입니다.";
                idCheckMsg.style.color = "#ef4444";
            } else {
                idCheckMsg.innerText = "사용 가능한 아이디입니다.";
                idCheckMsg.style.color = "#22c55e";
            }
        });
    }

    // 5. 전체 동의 및 버튼 활성화
    const checkAll = document.getElementById('check-all');
    const subChecks = document.querySelectorAll('.sub-check');
    const joinBtn = document.getElementById('join-btn');
    const requiredInputs = document.querySelectorAll('input[required], select[required]');

    if (checkAll) {
        checkAll.addEventListener('change', (e) => {
            subChecks.forEach(cb => cb.checked = e.target.checked);
            validateForm();
        });
    }

    subChecks.forEach(cb => {
        cb.addEventListener('change', () => {
            const allChecked = Array.from(subChecks).every(c => c.checked);
            if (checkAll) checkAll.checked = allChecked;
            validateForm();
        });
    });

    function validateForm() {
        let isAllFilled = true;
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) isAllFilled = false;
        });

        // 아이디 유효성 체크
        const idVal = document.getElementById('userId').value;
        const idRegex = /^[a-z0-9]{5,10}$/;
        if (!idRegex.test(idVal)) isAllFilled = false;

        // 필수 약관 체크
        const requiredChecks = document.querySelectorAll('.sub-check[required]');
        const isAllChecked = Array.from(requiredChecks).every(c => c.checked);

        if (isAllFilled && isAllChecked) {
            joinBtn.disabled = false;
            joinBtn.classList.remove('btn-disabled');
            joinBtn.classList.add('btn-black');
            joinBtn.classList.add('shadow-lg');
        } else {
            joinBtn.disabled = true;
            joinBtn.classList.add('btn-disabled');
            joinBtn.classList.remove('btn-black');
            joinBtn.classList.remove('shadow-lg');
        }
    }

    const formInputs = document.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('change', validateForm);
    });
});

function initBirthDate() {
    const yearSelect = document.getElementById('birthYear');
    const monthSelect = document.getElementById('birthMonth');
    const daySelect = document.getElementById('birthDay');
    
    if (!yearSelect || !monthSelect || !daySelect) return;

    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 100; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        yearSelect.appendChild(option);
    }
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        monthSelect.appendChild(option);
    }
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        daySelect.appendChild(option);
    }
}