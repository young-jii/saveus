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
                                    <li v-for="(subPath, subIndex) in route.subPaths" :key="subIndex" class="line">
                                        <span class="icon" :class="{ [getTrafficDetail(subPath)]: getTrafficDetail(subPath) }"></span>
                                        <span class="r_body">
                                            <span class="r_action">{{ getAction(subPath, subPath.startName, subPath.lane, subPath.sectionTime) }}</span>
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
// import EventBus from '../../eventBus.js';

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
        const isComponentMounted = ref(false);

        onMounted(() => {
            isComponentMounted.value = true;
            const script = document.createElement('script');
            script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.VUE_APP_NAVER_CLIENT_ID}`;
            script.async = true;
            document.head.appendChild(script);
            script.onload = () => {
                initializeMap();
                console.log('MapView.js >> Naver Maps script loaded');
                if (props.startPoint && props.endPoint) {
                    findRoute();
                } else {
                    console.warn('Start point or end point is not provided');
                }
            };
        });

        const findRoute = async () => {
            await MapView.methods.findRoute.call({
                geocode: MapView.methods.geocode,
                showAlert: MapView.methods.showAlert,
                localStartPoint: localStartPoint.value,
                localEndPoint: localEndPoint.value,
                routes: routes,
                $odsayAxios: api // axiosInstance가 미리 정의되어 있어야 합니다.
            });
        };

        const initializeMap = () => {
            MapView.methods.initializeMap.call({
                map: map.value,
                showAlert: MapView.methods.showAlert,
                polylines: polylines
            });
        };

        const handleRouteClick = async (route) => {
            if (!isComponentMounted.value) {
                console.error('MapView.js >> Component is not mounted yet');
                return;
            }
            await MapView.methods.handleRouteClick.call({
                map: map.value,
                clearPolylines: MapView.methods.clearPolylines,
                drawNaverMarker: MapView.methods.drawNaverMarker,
                drawNaverPolyLine: MapView.methods.drawNaverPolyLine,
                polylines: polylines.value,
                $odsayAxios: api
        }, route);


    };

    return {
        isComponentMounted,
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