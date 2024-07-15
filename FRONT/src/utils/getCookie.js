// utils/getCookie.js

export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        console.log('getCookie >> All cookies:', cookies); // 모든 쿠키 출력
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            console.log('getCookie >> Checking cookie:', cookie); // 각 쿠키 확인
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                console.log(`getCookie >> Cookie found - Name: ${name}, Value: ${cookieValue}`); // 쿠키 찾았을 때 출력
                break;
            }
        }
    }
    if (cookieValue === null) {
        console.log(`getCookie >> Cookie not found - Name: ${name}`); // 쿠키를 찾지 못했을 때 출력
    }
    return cookieValue;
}
