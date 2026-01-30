   // Lucide Icons 초기화
        lucide.createIcons();

        // [간단한 기능 예시]
        document.querySelectorAll('.btn-outline-gray').forEach(btn => {
            btn.addEventListener('click', function() {
                console.log('Button clicked:', this.innerText);
            });
        });