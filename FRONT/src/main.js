import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

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
axios.get('/map/set-csrf-token/', { withCredentials: true })
    .then(response => {
        const csrfToken = response.data.csrfToken;
        console.log('CSRF Token received:', csrfToken);
        axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
    })
    .catch(error => {
        console.error('Error getting CSRF Token:', error.response || error.message);
    });

// WebSocket URL 설정 (HTTPS에 맞춰 WSS 사용)
const wsBaseUrl = process.env.VUE_APP_WS_BASE_URL || 'wss://https://jiyoung.pythonanywhere.com';

if (!wsBaseUrl) {
    console.error('WebSocket Base URL is not defined. Check your .env file.');
} else {
    console.log(`WebSocket Base URL: ${wsBaseUrl}`);
}

// WebSocket 연결 (오류 처리 개선)
let socket;
try {
    socket = new WebSocket(`${wsBaseUrl}/ws/some_path/`);

    socket.onopen = () => console.log('WebSocket connection opened.');
    socket.onmessage = (event) => console.log('WebSocket message received:', event.data);
    socket.onclose = () => console.log('WebSocket connection closed.');
    socket.onerror = (error) => console.error('WebSocket error:', error);
} catch (error) {
    console.error('Failed to establish WebSocket connection:', error);
}

// ODSAY API 호출용 Axios 인스턴스 생성
const odsayAxiosInstance = axios.create({
    baseURL: 'https://api.odsay.com/v1/api/',
    withCredentials: false,
});

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$odsayAxios = odsayAxiosInstance;
app.config.globalProperties.$apiBaseUrl = apiBaseUrl;
app.config.globalProperties.$socket = socket;

app.use(router).mount('#app');