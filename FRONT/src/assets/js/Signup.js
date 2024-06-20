import axios from 'axios';

export function handleSignup(alertComponent) {
    // 비밀번호와 비밀번호 확인 일치 여부 확인
    if (this.signupData.password !== this.signupData.confirmPassword) {
        alertComponent.showAlert('비밀번호가 일치하지 않습니다.');
        return;
    }

    // 회원가입 로직 구현 (예: 서버에 회원가입 요청 보내기)
    console.log('회원가입 시도 중...', this.signupData);

    // signupData를 URL 쿼리 문자열로 변환
    const queryParams = new URLSearchParams(this.signupData).toString();

    axios.get(`https://3.35.141.132/api/signup/?${queryParams}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    })
    .then(response => {
        console.log('회원가입 성공:', response.data);
        const routeQueryParams = this.$route.query;
        alertComponent.showAlert('회원가입 성공하였습니다.', () => {
            // 회원가입 성공 후 CardRecom 페이지로 이동
            this.$router.push({
                name: 'CardRecom',
                query: routeQueryParams
            });
        });
    })
    .catch(error => {
        console.error('회원가입 에러:', error);
        const routeQueryParams = this.$route.query;
        alertComponent.showAlert('회원가입 에러가 발생했습니다.', () => {
            // 회원가입 에러 발생 후에도 CardRecom 페이지로 이동
            this.$router.push({
                name: 'CardRecom',
                query: routeQueryParams
            });
        });
    });
}

export function redirectToLogin() {
    // 로그인 페이지로 리다이렉트
    console.log('로그인 페이지로 이동');
    // 실제 구현에서는 라우터를 사용하여 페이지 이동
    this.$router.push('/login');
}
