   // Lucide Icons 초기화
        lucide.createIcons();

        // [AJAX] 기본 배송지 설정
        function setDefaultAddress(id) {
            if(!confirm("기본 배송지로 설정하시겠습니까?")) return;
            
            fetch('/api/address/default', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [document.querySelector('meta[name="_csrf_header"]').content]: document.querySelector('meta[name="_csrf"]').content
                },
                body: JSON.stringify({ id: id })
            })
            .then(res => {
                if(res.ok) location.reload();
                else alert("설정 실패했습니다.");
            });
        }

        // [AJAX] 주소 삭제
        function deleteAddress(id) {
            if(!confirm("이 배송지를 삭제하시겠습니까?")) return;

            fetch('/api/address/' + id, {
                method: 'DELETE',
                headers: {
                    [document.querySelector('meta[name="_csrf_header"]').content]: document.querySelector('meta[name="_csrf"]').content
                }
            })
            .then(res => {
                if(res.ok) location.reload();
                else alert("삭제 실패했습니다.");
            });
        }

        /* --- 모달 및 주소 저장 로직 --- */

        const modal = document.getElementById('address-modal');
        const modalContent = modal.querySelector('.modal-content');

        // 모달 열기
        function openAddressModal(addressId = null) {
            const form = document.getElementById('address-form');
            form.reset(); // 폼 초기화
            document.getElementById('addr-id').value = ''; // ID 초기화

            if (addressId) {
                document.getElementById('modal-title').innerText = '배송지 수정';
                // [AJAX] 기존 주소 데이터 가져오기 (API 호출 필요)
                fetch('/api/address/' + addressId)
                    .then(res => res.json())
                    .then(data => {
                        document.getElementById('addr-id').value = data.id;
                        document.getElementById('recipient').value = data.recipient;
                        document.getElementById('phone').value = data.phone;
                        document.getElementById('zipcode').value = data.zipcode;
                        document.getElementById('address').value = data.address;
                        document.getElementById('detailAddress').value = data.detailAddress;
                        document.getElementById('isDefault').checked = data.isDefault;
                    })
                    .catch(err => alert("정보를 불러오는데 실패했습니다."));
            } else {
                document.getElementById('modal-title').innerText = '새 배송지 추가';
            }

            modal.classList.remove('hidden', 'flex');
            modal.classList.add('flex');
            document.body.classList.add('modal-open');
            // 애니메이션
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
            }, 10);
        }

        // 모달 닫기
        function closeAddressModal() {
            modal.classList.add('opacity-0');
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
                document.body.classList.remove('modal-open');
            }, 250);
        }

        // 주소 수정 버튼 클릭 시
        function editAddress(id) {
            openAddressModal(id);
        }

        // [AJAX] 주소 저장/수정
        function saveAddress(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            // 체크박스 처리
            data.isDefault = document.getElementById('isDefault').checked;

            const url = data.id ? '/api/address/update' : '/api/address/create';
            const method = data.id ? 'PUT' : 'POST';

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    [document.querySelector('meta[name="_csrf_header"]').content]: document.querySelector('meta[name="_csrf"]').content
                },
                body: JSON.stringify(data)
            })
            .then(res => {
                if(res.ok) location.reload();
                else alert("저장 실패했습니다.");
            });
        }

        // Daum 주소 검색
        function execDaumPostcode() {
            new daum.Postcode({
                oncomplete: function(data) {
                    var addr = '';
                    if (data.userSelectedType === 'R') {
                        addr = data.roadAddress;
                    } else {
                        addr = data.jibunAddress;
                    }
                    document.getElementById('zipcode').value = data.zonecode;
                    document.getElementById("address").value = addr;
                    document.getElementById("detailAddress").focus();
                }
            }).open();
        }