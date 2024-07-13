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
        updateRoutes({ commit }, routes) {
            commit('setRoutes', routes);
        },
        async sendPaymentToDjango({ state }) {
            try {
                // Extract busNo from subPaths where trafficType is 2
                const busLists = state.selectedRoute.subPaths
                    .filter(subPath => subPath.trafficType === 2)
                    .flatMap(subPath => subPath.lane.map(lane => lane.busNo));
        
                // Use the custom Axios instance with base URL and withCredentials
                const response = await this.$instance.post('/calculate/calculate-cost/', {
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
                console.error('Request failed:', error);
            }
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
