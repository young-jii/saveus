import { createStore } from 'vuex';

const store = createStore({
    state: {
        selectedRoute: null, // 선택된 경로를 저장할 상태
        payment: null, // 결제 정보를 저장할 상태
    },
    mutations: {
        setSelectedRoute(state, route) {
        state.selectedRoute = route;
        },
        setPayment(state, payment) {
        state.payment = payment;
        },
    },
    actions: {
        selectRoute({ commit }, route) {
        commit('setSelectedRoute', route);
        },
        setPayment({ commit }, payment) {
        commit('setPayment', payment);
        },
    },
});

export default store;
