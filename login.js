document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 폼 제출 방지

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 로그인 API 호출
    fetch('https://example.com/api/login', { // 실제 API 엔드포인트로 변경
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('로그인 실패'); // 응답이 성공적이지 않을 경우 예외 발생
            }
            return response.json(); // JSON 형태로 응답 변환
        })
        .then(data => {
            // 로그인 성공 처리
            console.log('로그인 성공:', data);
            window.location.href = 'dashboard.html'; // 대시보드로 리다이렉트
        })
        .catch(error => {
            // 로그인 실패 처리
            console.error('오류:', error);
            alert('로그인에 실패했습니다. 다시 시도해 주세요.'); // 오류 메시지 출력
        });
});
