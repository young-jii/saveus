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
                        <div class="route_con" @click="onRouteClick(route)">
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { EventBus } from '../../eventBus.js';
import MapView from '../assets/js/MapView.js';

export default {
    components: {
        CustonAlert
    },
    props: {
        memHome: String,
        startPoint: String,
        endPoint: String,
        memYoungY: Boolean,
        memYoungN: Boolean,
        memSubsidiaryYn: Boolean
    },
    setup(props) {
        const store = useStore();
        const localStartPoint = ref(props.startPoint);
        const localEndPoint = ref(props.endPoint);
        const routes = ref([]);
        const map = ref(null);
        const polylines = ref([]);
        const alert = ref(null);

        const findRoute = async () => {
            await MapView.methods.findRoute.call({ 
                localStartPoint: localStartPoint.value, 
                localEndPoint: localEndPoint.value,
                routes: routes.value
            });
        };

        const onRouteClick = (route) => {
            console.log('onRouteClick method called in MapView.vue');
            store.dispatch('setSelectedRoute', route);
        };

        onMounted(async () => {
            MapView.methods.initializeMap.call({ map: map.value });
            await findRoute();
            alert.value = MapView.methods.$refs.customAlert;
            EventBus.on('route-selected', MapView.methods.handleRouteSelection);
        });

        onBeforeUnmount(() => {
            EventBus.off('route-selected', MapView.methods.handleRouteSelection);
        });

        return {
            localStartPoint,
            localEndPoint,
            routes,
            map,
            polylines,
            alert,
            findRoute,
            onRouteClick,
            ...MapView.methods
        };
    }
};
</script>

<style scoped src="../assets/css/MapView.css"></style>
