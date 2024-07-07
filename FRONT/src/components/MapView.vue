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
                        <div class="route_con" @click="handleRouteClick(route)">
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
                                    <li v-for="(subPath, subIndex) in filteredSubPaths(route.subPaths)" :key="subIndex" class="line">
                                        <span class="icon" :class="getTrafficClass(subPath)"></span>
                                        <span class="r_body">
                                            <span class="r_action">{{ getAction(subPath, subPath.startName, subPath.lane) }}</span>
                                        </span>
                                    </li>
                                    <li :key="route.subPaths.length" class="line">
                                        <span class="icon"></span>
                                        <span class="r_body">
                                            <span class="r_title"> ➜ {{ route.lastEndStation }} 하차</span>
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
import { ref, onMounted } from 'vue';
import { api } from '../assets/js/MapView.js';
import MapView from '../assets/js/MapView.js';
import odsayLogo from '../assets/img/ODsay_bi_mark.png';

export default {
    props: {
        memHome: String,
        startPoint: String,
        endPoint: String,
        memYoungY: Boolean,
        memYoungN: Boolean,
        memSubsidiaryYn: Boolean
    },
    setup(props) {
        const localStartPoint = ref(props.startPoint);
        const localEndPoint = ref(props.endPoint);
        const routes = ref([]);
        const map = ref(null);
        const polylines = ref([]);

        const findRoute = async () => {
            const result = await MapView.methods.findRoute({
                geocode: MapView.methods.geocode,
                showAlert: MapView.methods.showAlert,
                localStartPoint: localStartPoint.value,
                localEndPoint: localEndPoint.value,
                $odsayAxios: api
            });
            routes.value = result;
            };

        const initializeMap = () => {
            MapView.methods.initializeMap.call({
                map: map.value,
                showAlert: MapView.methods.showAlert,
                polylines: polylines
            });
        };

        const handleRouteClick = async (route) => {
            try {
                const { mapObj, sx, sy, ex, ey } = route;
                console.log('MapView.vue >> handleRouteClick >> mapObj:', mapObj);
                console.log('MapView.vue >> handleRouteClick >> sx, sy, ex, ey:', sx, sy, ex, ey);

                // ODsay API를 위한 별도의 Axios 인스턴스 생성
                const odsayApi = axios.create({
                baseURL: 'https://api.odsay.com/v1/api',
                params: {
                    apiKey: process.env.VUE_APP_ODSAY_API_KEY
                },
                withCredentials: false
                });

                const routeResponse = await odsayApi.get('/loadLane', {
                params: {
                    mapObject: `0:0@${mapObj}`
                },
                withCredentials: false
                });

                console.log('MapView.vue >> ODSAY loadLane API response:', routeResponse.data);

                // MapView.js의 메서드 호출
                MapView.methods.clearPolylines.call({ polylines: polylines.value });
                MapView.methods.drawNaverMarker.call({ map: map.value }, sx, sy);
                MapView.methods.drawNaverMarker.call({ map: map.value }, ex, ey);
                MapView.methods.drawNaverPolyLine.call({ map: map.value, polylines: polylines.value }, routeResponse.data);

                if (routeResponse.data.result.boundary) {
                const boundary = new window.naver.maps.LatLngBounds(
                    new window.naver.maps.LatLng(routeResponse.data.result.boundary.top, routeResponse.data.result.boundary.left),
                    new window.naver.maps.LatLng(routeResponse.data.result.boundary.bottom, routeResponse.data.result.boundary.right)
                );
                map.value.panToBounds(boundary);
                }
            } catch (error) {
                console.error('MapView.vue >> handleRouteClick >> Error:', error);
                if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
                } else if (error.request) {
                console.error('Error request:', error.request);
                } else {
                console.error('Error message:', error.message);
                }
            }
        };

        onMounted(() => {
            const script = document.createElement('script');
            script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.VUE_APP_NAVER_CLIENT_ID}`;
            script.async = true;
            document.head.appendChild(script);
            script.onload = () => {
                initializeMap();
                findRoute();
            };
        });

        return {
            localStartPoint,
            localEndPoint,
            routes,
            map,
            polylines,
            findRoute,
            handleRouteClick,
            odsayLogo,
            ...MapView.methods
        };
    }
};
</script>

<style scoped src="../assets/css/MapView.css"></style>