import { createStore } from 'vuex';
import axios from 'axios';
import { getCookie } from '@/utils/getCookie';

// Axios 인스턴스 생성
const instance = axios.create({
    baseURL: 'https://jiyoung.pythonanywhere.com/',  // Django API의 기본 URL
    withCredentials: true  // 자격 증명을 포함한 요청 허용
});

instance.interceptors.request.use(
    config => {
        const csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    error => Promise.reject(error)
);

async function fetchCsrfToken() {
    try {
        // CSRF 토큰을 설정하기 위한 요청 (응답이 사용되지 않음)
        await axios.get('https://jiyoung.pythonanywhere.com/map/set-csrf-token/', { withCredentials: true });
        const csrfToken = getCookie('csrftoken');
        console.log('Fetched CSRF Token:', csrfToken);

        // Vuex 스토어에 CSRF 토큰을 저장합니다.
        store.commit('setCsrfToken', csrfToken);
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
}

const store = createStore({
    state: {
        selectedRoute: null,
        payment: null,
        formData: {
            mem_home: '',
            start_point: '',
            end_point: '',
            mem_young_y: false,
            mem_young_n: false,
            mem_subsidiary_yn: false,
        },
        routes: [],
        selectedRouteIndex: -1,
        csrfToken: null, // CSRF 토큰 상태 추가
    },
    mutations: {
        setSelectedRoute(state, route) {
            state.selectedRoute = route;
        },
        setPayment(state, payment) {
            state.payment = payment;
        },
        setFormData(state, formData) {
            state.formData = formData;
        },
        setRoutes(state, routes) {
            state.routes = routes;
        },
        setSelectedRouteIndex(state, index) {
            state.selectedRouteIndex = index;
        },
        setCsrfToken(state, csrfToken) {
            state.csrfToken = csrfToken;
        },
    },
    actions: {
        async initialize() {
            await fetchCsrfToken();
        },
        selectRoute({ commit }, { route, index }) {
            commit('setSelectedRoute', route);
            commit('setSelectedRouteIndex', index);
        },
        setPayment({ commit }, payment) {
            commit('setPayment', payment);
        },
        updateFormData({ commit }, formData) {
            commit('setFormData', formData);
        },
        updateRoutes({ commit }, routes) {
            commit('setRoutes', routes);
        },
        async sendPaymentToDjango({ state }) {
            try {
                // CSRF 토큰을 인스턴스 헤더에 설정
                instance.defaults.headers.common['X-CSRFToken'] = state.csrfToken;

                console.log('CSRF Token for request (sendPaymentToDjango):', state.csrfToken);

                const busLists = state.selectedRoute.subPaths
                    .filter(subPath => subPath.trafficType === 2)
                    .flatMap(subPath => subPath.lane.map(lane => lane.busNo));

                const response = await instance.post('/calculate/calculate-cost/', {
                    payment: state.selectedRoute.payment,
                    busLists: busLists,
                    start_point: state.formData.start_point,
                    end_point: state.formData.end_point,
                    young: state.formData.mem_young_y ? 'Y' : 'N',
                    home: state.formData.mem_home,
                    subsidiary: state.formData.mem_subsidiary_yn ? 'Y' : 'N',
                    pre_month: 0,
                    transport: 'bus,subway'
                });

                console.log(response.data);
            } catch (error) {
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                } else {
                    console.error('Error message:', error.message);
                }
            }
        },
    },
    getters: {
        getFormData: state => state.formData,
        getRoutes: state => state.routes,
        getPayment: state => state.payment,
        getSelectedRouteIndex: state => state.selectedRouteIndex,
        getSelectedRoute: state => state.selectedRoute,
    },
});

// 초기화 작업 수행
store.dispatch('initialize');

export default store;
