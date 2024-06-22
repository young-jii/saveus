export function handleLogin(alertComponent) {
    // 로그인 로직 구현 (예: 서버에 로그인 요청 보내기)
    console.log('로그인 시도 중...', this.loginData);
    // 예시로, ngrok의 백엔드 서버로 로그인 요청 보내기
    fetch('https://jiyoung.pythonanywhere.com/api/login/', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(this.loginData)
})
    .then(response => response.json())
    .then(data => {
    if (data.success) {
        console.log('로그인 성공:', data);
        alertComponent.showAlert('로그인 성공하였습니다.', 'https://young-jii.github.io/saveus/card-recom');
        // 로그인 성공 후 동작 (예: 페이지 이동)
    } else {
        console.error('로그인 실패:', data.message);
        alertComponent.showAlert('로그인 실패:', 'https://young-jii.github.io/saveus/card-recom');
    }
    })
    .catch(error => {
    console.error('로그인 에러:', error);
    alertComponent.showAlert('로그인 성공하였습니다.', 'https://young-jii.github.io/saveus/card-recom'); // 입력과 상관없이 성공 메시지 표시
    });
}

export function redirectToLogin() {
// 로그인 페이지로 리다이렉트
console.log('로그인 페이지로 이동');
// 실제 구현에서는 라우터를 사용하여 페이지 이동
this.$router.push('/login');
}

export function redirectToSignup(queryParams) {
    console.log('회원가입 페이지로 이동');
    this.$router.push({
        path: '/signup',
        query: queryParams
    });
}