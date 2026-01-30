 // Lucide Icons 초기화
        lucide.createIcons();

        // 비밀번호 확인 AJAX 함수
        function verifyPassword(event) {
            event.preventDefault(); // 기본 폼 제출 방지

            const passwordInput = document.getElementById('check-password');
            const password = passwordInput.value;

            if (password.length === 0) {
                alert('비밀번호를 입력해주세요.');
                return;
            }

            // Spring Security CSRF 토큰 가져오기 (메타 태그가 없을 경우를 대비해 null 체크)
            const csrfMetaTag = document.querySelector('meta[name="_csrf"]');
            const csrfHeaderTag = document.querySelector('meta[name="_csrf_header"]');
            
            const headers = {
                'Content-Type': 'application/json'
            };

            // CSRF 토큰이 존재하면 헤더에 추가
            if (csrfMetaTag && csrfHeaderTag) {
                headers[csrfHeaderTag.getAttribute('content')] = csrfMetaTag.getAttribute('content');
            }

            // [테스트용] 백엔드 연동 전 UI 확인을 위한 Mock Fetch
            // '1234' 입력 시 성공, 그 외 실패 시뮬레이션
            // 실제 배포 시에는 이 Promise 블록을 제거하고 아래 주석 처리된 fetch를 활성화하세요.
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (password === '1234') {
                        resolve({ ok: true, json: () => Promise.resolve({}) });
                    } else {
                        resolve({ ok: false });
                    }
                }, 500); // 0.5초 네트워크 지연 시뮬레이션
            })
            /* // [실제 백엔드 연동 코드]
            fetch('/api/check-password', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ password: password })
            })
            */
            .then(response => {
                if (response.ok) {
                    // 성공 (HTTP 200 OK)
                    return response.json().catch(() => ({})); 
                } else {
                    // 실패 (401 Unauthorized 등)
                    throw new Error('비밀번호가 일치하지 않습니다.');
                }
            })
            .then(data => {
                // 검증 성공 시 화면 전환
                document.getElementById('password-check-view').classList.add('hidden');
                document.getElementById('login-info-view').classList.remove('hidden');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
                passwordInput.value = '';
                passwordInput.focus();
            });
        }