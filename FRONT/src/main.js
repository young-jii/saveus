import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import EventBus from '../eventBus';
import store from './store'; // store 파일 import 추가

// CSRF 토큰을 쿠키에서 가져오는 함수
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {  // 수정된 for 루프 조건
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// API 기본 URL 설정 (HTTPS 사용)
const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'https://jiyoung.pythonanywhere.com';

if (!apiBaseUrl) {
    console.error('API Base URL is not defined. Check your .env file.');
} else {
    console.log(`API Base URL: ${apiBaseUrl}`);
    axios.defaults.baseURL = apiBaseUrl; // Axios 기본 URL 설정
}

// CSRF 토큰을 가져와 Axios에 설정
axios.interceptors.request.use(
    config => {
        const csrfToken = getCookie('csrftoken');
        console.log('CSRF Token for request:', csrfToken); // 로그 추가
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    error => Promise.reject(error)
);

// ODSAY API 호출용 Axios 인스턴스 생성
const odsayAxiosInstance = axios.create({
    baseURL: 'https://api.odsay.com/v1/api/',
    withCredentials: false,
});

// Django API 호출용 Axios 인스턴스 생성
const instance = axios.create({
    baseURL: 'https://jiyoung.pythonanywhere.com/',  // Django API의 기본 URL
    withCredentials: true  // 자격 증명을 포함한 요청 허용
});

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$odsayAxios = odsayAxiosInstance;
app.config.globalProperties.$instance = instance; // 추가된 인스턴스 설정
app.config.globalProperties.$apiBaseUrl = apiBaseUrl;
app.config.globalProperties.EventBus = EventBus;

app.use(router).use(store).mount('#app');
