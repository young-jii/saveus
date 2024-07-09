<template>
    <div class="map-view">
        <div id="controls">
            <div class="control-item">
                <label for="startAddress">출발지</label>
                <input type="text" id="startAddress" v-model="localStartPoint">
            </div>
            <div class="control-item">
                <label for="endAddress">도착지</label>
                <input type="text" id="endAddress" v-model="localEndPoint">
            </div>
            <button @click="findRoute">길찾기</button>
        </div>
        <div id="results">
            <h3>🧭 경로를 선택하세요! 🧭</h3>
            <div class="route-list-box">
                <ul class="route-list">
                    <li v-for="(route, index) in routes" :key="index" class="route-data">
                        <div class="route_con" @click="handleRouteClick(route, index)">
                            <div class="route_time_header">[총 소요 시간] {{ formatTime(route.totalTime) }}</div>
                            <div class="route_time">
                                <span class="info_sub">
                                    <span>환승 {{ route.subwayTransitCount + route.busTransitCount - 1 }}회 | </span>
                                    <span>{{ route.payment }}원 | </span>
                                    <span>{{ (route.totalDistance / 1000).toFixed(1) }}km</span>
                                </span>
                            </div>
                            <div class="route_bar">
                                <span 
                                    v-for="(subPath, subIndex) in route.subPaths" 
                                    :key="subIndex"
                                    :class="['bar_area', getTrafficClass(subPath, true)]"
                                    :style="{ flexBasis: `${subPath.sectionTime * 100}%`, minWidth: '6.5%' }"
                                >
                                    <span class="bar">
                                        <span class="time">{{ subPath.sectionTime }}분</span>
                                    </span>
                                </span>
                            </div>
                            <div class="route_detail">
                                <ul class="route-detail-list">
                                    <li v-for="(subPath, subIndex) in route.subPaths" :key="subIndex" class="line">
                                        <span class="icon" :class="{ [getTrafficDetail(subPath)]: getTrafficDetail(subPath) }"></span>
                                        <span class="r_body">
                                            <span class="r_action">{{ getAction(subPath, subPath.startName, subPath.lane, subPath.sectionTime) }}</span>
                                        </span>
                                    </li>
                                    <li :key="route.subPaths.length" class="line">
                                        <span class="icon"></span>
                                        <span class="r_body">
                                            <span class="r_title"> ➜ {{ route.endName }} 하차</span>
                                        </span>
                                    </li>
                                </ul>
                                <div class="maker" style="display: none;">powered by<em>www.ODsay.com</em></div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <img :src="odsayLogo" alt="ODsay Logo" />
        <div id="map"></div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import MapView, { api } from '../assets/js/MapView.js';
import odsayLogo from '../assets/img/ODsay_bi_mark.png';

export default {
    name: 'MapView',
    props: {
        memHome: String,
        startPoint: String,
        endPoint: String,
        memYoungY: Boolean,
        memYoungN: Boolean,
        memSubsidiaryYn: Boolean
    },
    data() {
        return {
            localStartPoint: this.startPoint,
            localEndPoint: this.endPoint,
            map: null,
            polylines: [],
            isComponentMounted: false,
            odsayLogo
        };
    },
    computed: {
        ...mapState(['routes', 'selectedRouteIndex']),
        ...mapGetters(['getSelectedRoute']),
    },
    methods: {
        ...mapActions(['selectRoute']),
        
        async findRoute() {
            try {
                const context = {
                    geocode: MapView.methods.geocode,
                    showAlert: MapView.methods.showAlert,
                    localStartPoint: this.localStartPoint,
                    localEndPoint: this.localEndPoint,
                    routes: this.routes,
                    $odsayAxios: api
                };
                
                console.log('Calling findRoute with context:', context);
                const response = await MapView.methods.findRoute.call(context);
                console.log('API Response:', response);

                if (response && response.result && response.result.path) {
                    this.routes = response.result.path.map(path => ({
                        totalTime: path.info.totalTime,
                        totalWalk: path.info.totalWalk,
                        busTransitCount: path.info.busTransitCount,
                        subwayTransitCount: path.info.subwayTransitCount,
                        payment: path.info.payment,
                        totalDistance: path.info.totalDistance,
                        startNameKor: path.info.firstStartStation,
                        endName: path.info.lastEndStation,
                        subPaths: path.subPath,
                        mapObj: path.info.mapObj,
                        busStopList: path.subPath
                            .filter(subPath => subPath.trafficType === 2)
                            .flatMap(subPath => {
                                if (subPath.passStopList && Array.isArray(subPath.passStopList.stations)) {
                                    return subPath.passStopList.stations.map(station => station.stationName);
                                }
                                return [];
                            }),
                        subwayStopList: path.subPath
                            .filter(subPath => subPath.trafficType === 1)
                            .flatMap(subPath => {
                                if (subPath.passStopList && Array.isArray(subPath.passStopList.stations)) {
                                    return subPath.passStopList.stations.map(station => station.stationName);
                                }
                                return [];
                            }),
                        sx: path.info.sx,
                        sy: path.info.sy,
                        ex: path.info.ex,
                        ey: path.info.ey
                    }));
                    this.$store.commit('setRoutes', this.routes);
                } else {
                    console.error('No routes found in the response:', response);
                }
            } catch (error) {
                console.error('Error fetching routes:', error);
            }
        },

        async handleRouteClick(route, index) {
            if (!this.isComponentMounted) {
                console.error('MapView.js >> Component is not mounted yet');
                return;
            }
            if (!this.map) {
                console.error('MapView.js >> Map is not initialized');
                return;
            }
            await MapView.methods.handleRouteClick.call({
                map: this.map,
                clearPolylines: MapView.methods.clearPolylines,
                drawNaverMarker: MapView.methods.drawNaverMarker,
                drawNaverPolyLine: MapView.methods.drawNaverPolyLine,
                polylines: this.polylines,
                $odsayAxios: api
            }, route);

            this.selectRoute({ route, index });
        },

        initializeMap() {
            if (window.naver && window.naver.maps) {
                var mapOptions = {
                    center: new window.naver.maps.LatLng(37.5665, 126.9780),
                    zoom: 10
                };
                this.map = new window.naver.maps.Map('map', mapOptions);
                console.log('MapView.vue >> Map initialized:', this.map);
            } else {
                console.error('MapView.vue >> Naver Maps API is not loaded.');
            }
        },
    },
    mounted() {
        console.log('Mounting component...');
        this.isComponentMounted = true;
        const script = document.createElement('script');
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.VUE_APP_NAVER_CLIENT_ID}`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            console.log('Naver Maps script loaded successfully');
            if (this.startPoint && this.endPoint) {
                this.findRoute();
            } else {
                console.warn('Start point or end point is not provided');
            }
        };

        script.onerror = (error) => {
            console.error('Error loading Naver Maps script:', error);
        };
    }
};
</script>

<style scoped src="../assets/css/MapView.css"></style>
