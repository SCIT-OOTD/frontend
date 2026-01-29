/**
 * 로그인 페이지 전용 스크립트
 * - 아이디/비밀번호 입력 감지 및 로그인 버튼 활성화
 * - 로그인 실패(URL 파라미터 error) 감지 및 인라인 에러 문구 표시
 */

document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');

    const labelUsername = document.getElementById('label-username');
    const labelPassword = document.getElementById('label-password');
    const errorUsername = document.getElementById('error-username');
    const errorPassword = document.getElementById('error-password');

    // 1. 입력값 체크 함수
    function checkInputs() {
        const idValue = usernameInput.value.trim();
        const pwValue = passwordInput.value.trim();

        // 입력 시 에러 스타일 초기화 (사용자가 수정을 시도하면 빨간색 제거)
        resetErrorStyles();

        // 둘 다 값이 있으면 버튼 활성화
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

    // 에러 스타일 초기화 함수
    function resetErrorStyles() {
        if (usernameInput.classList.contains('input-error')) {
            usernameInput.classList.remove('input-error');
            labelUsername.classList.remove('label-error');
            errorUsername.classList.add('hidden');
        }
        if (passwordInput.classList.contains('input-error')) {
            passwordInput.classList.remove('input-error');
            labelPassword.classList.remove('label-error');
            errorPassword.classList.add('hidden');
        }
    }

    // 이벤트 리스너 등록 (키 입력 시마다 체크)
    if (usernameInput && passwordInput && loginBtn) {
        usernameInput.addEventListener('input', checkInputs);
        passwordInput.addEventListener('input', checkInputs);
    }

    // 2. 로그인 실패 감지 로직 (URL 파라미터 확인)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('error')) {
        // 아이디 입력칸 에러 표시
        if (errorUsername) {
            errorUsername.textContent = "다시 확인해주세요";
            errorUsername.classList.remove('hidden');
            usernameInput.classList.add('input-error');
            labelUsername.classList.add('label-error');
        }

        // 비밀번호 입력칸 에러 표시
        if (errorPassword) {
            errorPassword.textContent = "일치하지 않습니다";
            errorPassword.classList.remove('hidden');
            passwordInput.classList.add('input-error');
            labelPassword.classList.add('label-error');
        }
    }
});