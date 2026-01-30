/**
 * 로그인 페이지 전용 스크립트
 * - 아이디/비밀번호 입력 감지 및 로그인 버튼 활성화
 */

document.addEventListener("DOMContentLoaded", () => {
    // [수정] HTML ID 변경 반영 (username -> userId)
    const usernameInput = document.getElementById('userId');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');

    // 입력값 체크 함수
    function checkInputs() {
        const idValue = usernameInput.value.trim();
        const pwValue = passwordInput.value.trim();

        // 아이디와 비밀번호가 모두 입력되었을 때
        if (idValue.length > 0 && pwValue.length > 0) {
            loginBtn.disabled = false;
            loginBtn.classList.remove('btn-disabled');
            loginBtn.classList.add('btn-active');
        } else {
            loginBtn.disabled = true;
            loginBtn.classList.remove('btn-active');
            loginBtn.classList.add('btn-disabled');
        }
    }

    // 이벤트 리스너 등록 (키 입력 시마다 체크)
    if (usernameInput && passwordInput && loginBtn) {
        usernameInput.addEventListener('input', checkInputs);
        passwordInput.addEventListener('input', checkInputs);
    }
});