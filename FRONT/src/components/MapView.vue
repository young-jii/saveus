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
                <ul class="route-list" v-if="routes && routes.length > 0">
                    <li v-for="(route, index) in routes" :key="index" class="route-data">
                        <div class="route_con" @click="handleRouteClick(route, index)">
                            <div class="route_time_header">[총 소요 시간] {{ route.formattedTotalTime }}</div>
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
                                    :class="['bar_area', getTrafficClass(subPath)]"
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
                                        <span class="icon" :class="getTrafficDetail(subPath)"></span>
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

                <p v-else>Loading routes...</p>

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
            subwayLineColors : {
                1: '#133499',
                2: '#36B12A',
                3: '#F55F2C',
                4: '#1C97DB',
                5: '#893CB6',
                6: '#9A4F10',
                7: '#5F6D00',
                8: '#E71F6E',
                9: '#BF9F1D',
                21: '#6691C9',
                22: '#ED8000',
                101: '#0095D4',
                102: '#F78D46',
                104: '#7DC4A5',
                107: '#9AD296',
                108: '#26A97F',
                109: '#A8022D',
                110: '#FF8E00',
                112: '#003499',
                113: '#B6C15D',
                114: '#80A62C',
                115: '#AD8602',
                116: '#EDB217',
                117: '#6789CA',
                31: '#36B42D',
                41: '#FA5F2D',
                42: '#36B42D',
                43: '#EDB217',
                51: '#36B42D',
                71: '#FA5F2D',
                72: '#34B12B',
                73: '#BF9F1D',
                74: '#6F8CC0',
                78: '#0054A6',
                79: '#893CB6',
                91: '#996883',
                92: '#2e81e2',
                93: '#00ad79',
                94: '#756be9',
                95: '#ee7a0c',
                96: '#fcb706'
            },
            busLineColors : {
                1: '#39f',
                2: '#3d5bab',
                3: '#53b332',
                4: '#f30',
                5: '#00a0e9',
                6: '#f30',
                10: '#53b332',
                11: '#1c78cf',
                12: '#53b332',
                13: '#f2b70a',
                14: '#e60012',
                15: '#f30',
                16: '#ffba00',
                20: '#ed8b32',
                21: '#21b3f5',
                22: '#b84efc',
                26: '#f30',
                34: '#c91017',
                36: '#993797'
            },
            isComponentMounted: false,
            odsayLogo
        };
    },
    computed: {
        ...mapState(['routes', 'selectedRouteIndex']),
        ...mapGetters(['getSelectedRoute']),
        formattedRoutes() {
            return this.routes.map(route => ({
                ...route,
                formattedTotalTime: this.formatTime(route.totalTime)
            }));
        },
        formatTime() {
            return (minutes) => {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                return `${hours}시간 ${mins}분`;
            };
        },
        getTrafficClass() {
            return (subPath) => {
                if (subPath.trafficType === 2) {
                    return `line_bus${subPath.lane && subPath.lane[0] ? subPath.lane[0].type : ''}`;
                } else if (subPath.trafficType === 1) {
                    return `line_sub${subPath.lane && subPath.lane[0] ? subPath.lane[0].subwayCode : ''}`;
                } else {
                    return 'line_walk';
                }
            };
        },
        getTrafficDetail() {
            return (subPath) => {
                if (subPath.trafficType === 2) {
                return `bus${subPath.lane && subPath.lane[0] ? subPath.lane[0].type : ''}`;
                } else if (subPath.trafficType === 1) {
                return `sub${subPath.lane && subPath.lane[0] ? subPath.lane[0].subwayCode : ''}`;
                } else {
                return 'walk';
                }
            };
        },
        getLineClass() {
            return (trafficType, subwaycode) => {
                if (trafficType === 1) {
                return 'bus';
                } else if (trafficType === 2) {
                return `sub${subwaycode}`;
                } else {
                return 'walk';
                }
            };
        },
        getAction() {
            return (subPath, startName, lane, sectionTime) => {
                if (subPath.trafficType === 1) {
                return `지하철 ${lane.map(l => l.name).join(', ')} - ${startName}역`;
                } else if (subPath.trafficType === 2) {
                return `버스 ${lane.map(l => l.busNo).join(', ')} 번 - ${startName}`;
                } else {
                return `도보 ${sectionTime} 분`;
                }
            };
        }
    },
    methods: {
        ...mapActions(['selectRoute', 'updateRoutes']),

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
                    const routes = response.result.path.map(path => ({
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
                    this.updateRoutes(routes);
                    // Add console logging here
                    console.log('Routes after updating:', this.routes);
                        if (this.routes && this.routes.length > 0) {
                            console.log('Total time of first route:', this.routes[0].totalTime);
                        }

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
            try {
                this.clearPolylines();
                // 새로운 polyline을 그리기 전 길이 출력
                console.log('Before drawing new polylines, current count:', this.polylines.length);

                await MapView.methods.handleRouteClick.call({
                    map: this.map,
                    clearPolylines: this.clearPolylines,
                    drawNaverMarker: this.drawNaverMarker,
                    drawNaverPolyLine: this.drawNaverPolyLine,
                    polylines: this.polylines,
                    $odsayAxios: api
                }, route);

                // 새로운 polyline을 그린 후 길이 출력
                console.log('After drawing new polylines, current count:', this.polylines.length);

                this.selectRoute({ route, index });
            } catch (error) {
                console.error('Error handling route click:', error);
            }
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

        clearPolylines() {
            console.log('Clearing polylines. Current count:', this.polylines.length);
            this.polylines.forEach(polyline => {
                if (polyline && typeof polyline.setMap === 'function') {
                    polyline.setMap(null);
                }
            });
            this.polylines = [];
            console.log('Polylines cleared. New count:', this.polylines.length);
        },

        drawNaverMarker(x, y) {
            new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(y, x),
                map: this.map
            });
        },

        drawNaverPolyLine(data) {
            if (!data?.result?.lane) {
                console.error('Invalid data structure:', data);
                return;
            }
        
            let lineArray;
            for (let i = 0; i < data.result.lane.length; i++) {
                for (let j = 0; j < data.result.lane[i].section.length; j++) {
                    lineArray = [];
                    for (let k = 0; k < data.result.lane[i].section[j].graphPos.length; k++) {
                        lineArray.push(new window.naver.maps.LatLng(data.result.lane[i].section[j].graphPos[k].y, data.result.lane[i].section[j].graphPos[k].x));
                    }
                    let lineColor = '#000';

                    const laneClass = data.result.lane[i].class;
                    const laneType = data.result.lane[i].type;

                    if (laneClass === 1) {
                        lineColor = this.busLineColors[laneType];
                    } else if (laneClass === 2) {
                        lineColor = this.subwayLineColors[laneType] || lineColor;
                    } else if (laneClass === 3) {
                        lineColor = '#EEEEEE';
                    }

                    const polyline = new window.naver.maps.Polyline({
                        map: this.map,
                        path: lineArray,
                        strokeWeight: 5,
                        strokeColor: lineColor
                    });
                    this.polylines.push(polyline);
                }
            }
        },

        displayRouteOnMap(data) {
            try {
                console.log('MapView.vue >> Displaying route on map with data:', data);

                const resultJsonData = data.result;
                if (resultJsonData) {
                    this.drawNaverMarker(data.sx, data.sy);
                    this.drawNaverMarker(data.ex, data.ey);
                    this.drawNaverPolyLine(resultJsonData);

                    if (resultJsonData.result.boundary) {
                        const boundary = new window.naver.maps.LatLngBounds(
                            new window.naver.maps.LatLng(resultJsonData.result.boundary.top, resultJsonData.result.boundary.left),
                            new window.naver.maps.LatLng(resultJsonData.result.boundary.bottom, resultJsonData.result.boundary.right)
                        );
                        this.map.panToBounds(boundary);
                    }
                } else {
                    console.error('MapView.vue >> Invalid response data:', resultJsonData);
                }
            } catch (error) {
                console.error('MapView.vue >> Error displaying route:', error);
            }
        },
    },

    mounted() {
        console.log('Mounting component...');

        // Add console logging for initial routes state
        console.log('Initial routes in Vuex store:', this.routes);
        if (this.routes && this.routes.length > 0) {
            console.log('Initial total time of first route:', this.routes[0].totalTime);
        }

        this.isComponentMounted = true;

        // 네이버 지도 API 스크립트 로드
        const script = document.createElement('script');
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.VUE_APP_NAVER_CLIENT_ID}`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            console.log('Naver Maps script loaded successfully');
            this.initializeMap();
            if (this.startPoint && this.endPoint) {
                this.findRoute();
            } else {
                console.warn('Start point or end point is not provided');
            }
        };

        script.onerror = (error) => {
            console.error('Error loading Naver Maps script:', error);
        };
    },

    // Add a watch for routes
    watch: {
        routes: {
            handler(newRoutes) {
                console.log('Routes updated:', newRoutes);
                if (newRoutes && newRoutes.length > 0) {
                    console.log('Updated total time of first route:', newRoutes[0].totalTime);
                }
            },
            deep: true
        }
    }
};
</script>

<style scoped src="../assets/css/MapView.css"></style>
