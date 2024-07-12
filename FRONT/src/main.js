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
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Axios 기본 설정
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// API 기본 URL 설정 (HTTPS 사용)
const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'https://jiyoung.pythonanywhere.com';

if (!apiBaseUrl) {
    console.error('API Base URL is not defined. Check your .env file.');
} else {
    console.log(`API Base URL: ${apiBaseUrl}`);
    axios.defaults.baseURL = apiBaseUrl; // Axios 기본 URL 설정
}

// CSRF 토큰을 가져와 Axios에 설정
axios.get(`${apiBaseUrl}/map/set-csrf-token/`, { withCredentials: true })
    .then(() => {
        const csrfToken = getCookie('csrftoken');
        console.log('CSRF Token received:', csrfToken);
        axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
    })
    .catch(error => {
        console.error('Error getting CSRF Token:', error.response || error.message);
    });

// ODSAY API 호출용 Axios 인스턴스 생성
const odsayAxiosInstance = axios.create({
    baseURL: 'https://api.odsay.com/v1/api/',
    withCredentials: false,
});

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$odsayAxios = odsayAxiosInstance;
app.config.globalProperties.$apiBaseUrl = apiBaseUrl;
app.config.globalProperties.EventBus = EventBus ;

app.use(router).use(store).mount('#app');