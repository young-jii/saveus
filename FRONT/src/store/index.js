import { createStore } from 'vuex';

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
        routes: [], // Add this line to store routes
        selectedRouteIndex: -1, // Add this line to store selected route index
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
    },
    actions: {
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
    },
    getters: {
        getFormData: state => state.formData,
        getRoutes: state => state.routes,
        getPayment : state => state.payment,
        getSelectedRouteIndex: state => state.selectedRouteIndex,
        getSelectedRoute: state => state.selectedRoute,
    },
});

export default store;
