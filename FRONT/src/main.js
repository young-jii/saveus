import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import EventBus from '../eventBus';
import store from './store'; // store 파일 import 추가
import { getCookie } from './utils/getCookie'

// API 기본 URL 설정 (HTTPS 사용)
const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'https://jiyoung.pythonanywhere.com';

if (!apiBaseUrl) {
    console.error('API Base URL is not defined. Check your .env file.');
} else {
    console.log(`API Base URL: ${apiBaseUrl}`);
    axios.defaults.baseURL = apiBaseUrl; // Axios 기본 URL 설정
    axios.defaults.withCredentials = true; // 자격 증명을 포함한 요청 허용
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
}

// CSRF 토큰을 가져오는 함수
async function fetchCsrfToken() {
    try {
        const response = await axios.get(`${apiBaseUrl}/map/set-csrf-token/`, { withCredentials: true });
        console.log('CSRF token set successfully.');
        console.log('Response data:', response.data);
        const csrfToken = getCookie('csrftoken');
        console.log('Retrieved CSRF token from cookie:', csrfToken);
        return csrfToken;
    } catch (error) {
        console.error('Error setting CSRF token:', error);
        throw error;
    }
}

// 초기화 함수
async function initialize() {
    const csrfToken = await fetchCsrfToken();
    if (csrfToken) {
        axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
    }

    // CSRF 토큰을 가져와 Axios에 설정
    axios.interceptors.request.use(
        config => {
            const token = getCookie('csrftoken');
            console.log('CSRF Token for request:', token); // 로그 추가
            if (token) {
                config.headers['X-CSRFToken'] = token;
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
}

// 초기화 함수 호출
initialize();
