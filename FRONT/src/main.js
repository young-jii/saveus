import { createApp } from 'vue';
import App from './App.vue';

import router from './router';
import axios from 'axios';

// Axios 기본 설정
axios.defaults.withCredentials = true; // withCredentials 설정 추가
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// API 기본 URL 설정
const apiBaseUrl = process.env.VUE_APP_USE_NGROK === 'true'
    ? process.env.VUE_APP_API_BASE_URL_NGROK
    : process.env.VUE_APP_API_BASE_URL_LOCAL;

    if (!apiBaseUrl) {
        console.error('API Base URL is not defined. Check your .env file.');
    } else {
        console.log(`API Base URL: ${apiBaseUrl}`); // 디버깅용 로그
    }

// CSRF 토큰을 가져와 Axios에 설정
axios.get(`${apiBaseUrl}/map/set-csrf-token/`)
    .then(response => {
        console.log('main.js >> CSRF Token response:', response); // 디버깅용 로그
        axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
    })
    .catch(error => {
        console.error('Error getting CSRF Token: ', error); // 디버깅용 로그
    });

// WebSocket URL 설정
const wsProtocol = location.protocol === 'https:' ? 'wss' : 'ws'; // HTTPS일 때 WSS를 사용하도록 설정
const wsBaseUrl = process.env.VUE_APP_USE_NGROK === 'true'
    ? process.env.VUE_APP_WS_BASE_URL_NGROK
    : process.env.VUE_APP_WS_BASE_URL_LOCAL;

if (!wsBaseUrl) {
    console.error('WebSocket Base URL is not defined. Check your .env file.');
} else {
    console.log(`WebSocket Base URL: ${wsBaseUrl}`); // 디버깅용 로그
}

const socket = new WebSocket(`${wsProtocol}://${wsBaseUrl}/ws/some_path/`);

socket.onopen = () => {
    console.log('WebSocket connection opened.');
};

socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
};

socket.onclose = () => {
    console.log('WebSocket connection closed.');
};

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};

// ODSAY API 호출용 Axios 인스턴스 생성 (withCredentials 비활성화)
const odsayAxiosInstance = axios.create({
    baseURL: 'https://api.odsay.com/v1/api/',
    withCredentials: false, // withCredentials 옵션 비활성화
});

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$odsayAxios = odsayAxiosInstance; // ODSAY API 호출용 인스턴스 설정
app.config.globalProperties.$apiBaseUrl = apiBaseUrl; // apiBaseUrl 전역 속성으로 설정
app.config.globalProperties.$socket = socket; // WebSocket 전역 속성으로 설정

app.use(router).mount('#app');