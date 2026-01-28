/**
 * 나의 맞춤 정보 페이지 전용 스크립트
 */

document.addEventListener("DOMContentLoaded", function() {
    // 페이지 로드 시 초기값 세팅 (저장된 값이 있으면 텍스트 표시)
    initCustomInfo();
});

function initCustomInfo() {
    // 모든 select를 찾아서, 값이 있으면 display span에 업데이트
    var selects = document.querySelectorAll('select.hidden');
    selects.forEach(function(select) {
        if (select.value && select.value !== "") {
            var display = document.getElementById('display-' + select.id);
            if (display) {
                display.innerText = select.value;
                display.classList.remove('text-gray-400');
                display.classList.add('text-black', 'font-bold');
            }
        }
    });
}

// 모달 열기 (HTML의 Select Option을 읽어서 버튼 생성)
function openSizeModal(targetId) {
    var selectElement = document.getElementById(targetId);
    if (!selectElement) return;

    var modal = document.getElementById('size-modal');
    var modalOptions = document.getElementById('modal-options');
    var modalTitle = document.getElementById('modal-title');
    
    // 타이틀 설정 (라벨 찾아서 설정하거나 기본값)
    // 간단히 '사이즈 선택'으로 통일하거나, 필요시 이전 형제 요소 텍스트 가져오기
    modalTitle.innerText = '사이즈 선택'; 

    // 기존 버튼 초기화
    modalOptions.innerHTML = '';

    // Option 태그를 순회하며 버튼 생성
    for (var i = 0; i < selectElement.options.length; i++) {
        var option = selectElement.options[i];
        
        // '선택' 플레이스홀더나 빈 값은 건너뜀
        if (option.value === "" || option.disabled) continue;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.innerText = option.text;
        btn.value = option.value;
        
        // 현재 선택된 값인지 확인
        var isSelected = (selectElement.value === option.value);
        
        // 스타일 적용
        if (isSelected) {
            btn.className = 'py-4 px-2 rounded-xl border font-bold text-base transition-all border-black bg-black text-white shadow-md';
        } else {
            btn.className = 'py-4 px-2 rounded-xl border font-bold text-base transition-all border-gray-200 text-gray-700 bg-white hover:border-black hover:bg-gray-50';
        }

        // 클릭 이벤트 (클로저 문제 방지 위해 함수로 감쌈)
        btn.onclick = (function(val, text) {
            return function() {
                selectOption(targetId, val, text);
            }
        })(option.value, option.text);

        modalOptions.appendChild(btn);
    }

    // 모달 표시
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    setTimeout(function() {
        modal.classList.remove('opacity-0');
        modal.querySelector('div').classList.remove('scale-95');
        modal.querySelector('div').classList.add('scale-100');
    }, 10);
}

// 옵션 선택 및 취소 처리
function selectOption(targetId, value, text) {
    var selectElement = document.getElementById(targetId);
    var displayElement = document.getElementById('display-' + targetId);

    // 이미 선택된 값이면 취소 (값 비우기)
    if (selectElement.value === value) {
        selectElement.value = "";
        if (displayElement) {
            displayElement.innerText = "선택";
            displayElement.classList.add('text-gray-400');
            displayElement.classList.remove('text-black', 'font-bold');
        }
    } 
    // 새로운 값 선택
    else {
        selectElement.value = value;
        if (displayElement) {
            displayElement.innerText = text;
            displayElement.classList.remove('text-gray-400');
            displayElement.classList.add('text-black', 'font-bold');
        }
    }

    closeModal();
}

// 모달 닫기
function closeModal() {
    var modal = document.getElementById('size-modal');
    var container = modal.querySelector('div');

    modal.classList.add('opacity-0');
    container.classList.remove('scale-100');
    container.classList.add('scale-95');

    setTimeout(function() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

// 정보 삭제 기능
function deleteCustomInfo() {
    if (confirm("저장된 맞춤 정보를 삭제하시겠습니까?")) {
        // 모든 select 초기화
        var selects = document.querySelectorAll('select.hidden');
        selects.forEach(function(select) {
            select.value = "";
            var display = document.getElementById('display-' + select.id);
            if (display) {
                display.innerText = "선택";
                display.classList.add('text-gray-400');
                display.classList.remove('text-black', 'font-bold');
            }
        });

        // 입력창 초기화
        var inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(function(input) {
            input.value = "";
        });
        
        alert("삭제되었습니다.");
    }
}

// 폼 제출 검사
document.querySelector('form').addEventListener('submit', function(e) {
    var height = document.getElementById('height').value;
    var weight = document.getElementById('weight').value;

    if (!height || !weight) {
        e.preventDefault(); 
        alert("키와 몸무게를 입력해주세요.");
    }
});

// 모달 바깥 클릭 시 닫기
document.getElementById('size-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});