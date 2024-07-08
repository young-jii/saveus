import axios from 'axios';
import EventBus from '../../../eventBus';  // 이벤트 버스 불러오기
import { useStore } from 'vuex';

const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'https://jiyoung.pythonanywhere.com';

let csrfToken = null;

const getCsrfToken = async () => {
    if (csrfToken) return csrfToken;
    try {
        const response = await axios.get(`${apiBaseUrl}/api/set-csrf-token/`, { withCredentials: true });
        csrfToken = response.data.csrfToken;
        console.log('MapView.js >> CSRF token received:', csrfToken);
        return csrfToken;
    } catch (error) {
        console.error('MapView.js >> Error fetching CSRF token:', error);
        throw error;
    }
};

// Axios 인스턴스 생성 및 기본 설정 추가
const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    async (config) => {
        try {
            const token = await getCsrfToken();
            config.headers['X-CSRFToken'] = token;
            console.log('MapView.js >> CSRF token set in request headers:', token);
            return config;
        } catch (error) {
            console.error('MapView.js >> Failed to set CSRF token in request headers:', error);
            return Promise.reject(error);
        }
    },
    (error) => {
        console.error('MapView.js >> Request interceptor error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 403 && error.response.data.code === 'csrf_token_missing') {
            // CSRF 토큰 오류 시 토큰을 새로 가져오고 요청 재시도
            csrfToken = null; // 캐시된 토큰 초기화
            const originalRequest = error.config;
            const token = await getCsrfToken();
            originalRequest.headers['X-CSRFToken'] = token;
            return api(originalRequest);
        }
        return Promise.reject(error);
    }
);

// 지하철 노선 색상 매핑 객체
const subwayLineColors = {
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
};

const busLineColors = {
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
};

const store = useStore();

export { api };  // Add this line to export api

export default {
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
            routes: [],
            map: null,
            polylines: []  // 폴리라인을 저장할 배열
        };
    },
    methods: {
        async geocode(address) {
            try {
                console.log('MapView.js >> Geocoding address:', address);
                const response = await api.get('/odsay/geocode/', { params: { address } });
                console.log('MapView.js >> Geocode response:', response.data);
                return response.data;
            } catch (error) {
                console.error('MapView.js >> Error geocoding address:', error);
                if (error.response) {
                    console.error('MapView.js >> Error response data:', error.response.data);
                }
                throw error;
            }
        },
        
        async findRoute() {
            console.log('VUE_APP_ODSAY_API_KEY:', process.env.VUE_APP_ODSAY_API_KEY);

            try {
                console.log('MapView.js >> Finding route with start point:', this.localStartPoint, 'and end point:', this.localEndPoint);
                
                if (!this.localStartPoint || !this.localEndPoint) {
                    throw new Error('Start point or end point is missing');
                }
        
                // Geocoding addresses to coordinates
                const startResponse = await this.geocode(this.localStartPoint);
                const endResponse = await this.geocode(this.localEndPoint);

                console.log('MapView.js >> Start geocode response:', startResponse);
                console.log('MapView.js >> End geocode response:', endResponse);
                
                if (!startResponse || !endResponse) {
                    throw new Error('Failed to get coordinates');
                }
        
                const sx = startResponse.x;
                const sy = startResponse.y;
                const ex = endResponse.x;
                const ey = endResponse.y;
                
                console.log('MapView.js >> Start coordinates:', { sx, sy });
                console.log('MapView.js >> End coordinates:', { ex, ey });

                
                const encodedApiKey = encodeURIComponent(process.env.VUE_APP_ODSAY_API_KEY);
                const url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${sx}&SY=${sy}&EX=${ex}&EY=${ey}&apiKey=${encodedApiKey}`;

                const response = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open("GET", url, true);
                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            resolve(xhr.responseText);
                        } else {
                            reject(new Error(`HTTP error! status: ${xhr.status}`));
                        }
                    };
                    xhr.onerror = () => reject(new Error('Network error'));
                    xhr.send();
                });

                const routeResponse = JSON.parse(response);
                console.log('MapView.js >> ODSAY API response:', routeResponse);

                if (routeResponse && routeResponse.result && routeResponse.result.path) {
                    this.routes = routeResponse.result.path.map((path) => {
                        return {
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
                            sx: sx,
                            sy: sy,
                            ex: ex,
                            ey: ey
                        };
                    });
                    console.log('MapView.js >> Emitting route-found event with routes:', this.routes);
                    EventBus.emit('route-found', this.routes);
                    this.$store.commit('setRoutes', this.routes); // Add this line
                    store.commit('setRoutes', this.routes);
                } else {
                    console.error('MapView.js >> No valid route found');
                }
            } catch (error) {
                console.error('MapView.js >> Error finding route:', error);
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
        },

        async handleRouteClick(route, index) {
            try {
                const { mapObj, sx, sy, ex, ey } = route;
                console.log('MapView.vue >> handleRouteClick >> mapObj:', mapObj);
                console.log('MapView.vue >> handleRouteClick >> sx, sy, ex, ey:', sx, sy, ex, ey);
                    
                const encodedApiKey = encodeURIComponent(process.env.VUE_APP_ODSAY_API_KEY);
                const url = `https://api.odsay.com/v1/api/loadLane?apiKey=${encodedApiKey}&mapObject=0:0@${mapObj}`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const routeResponse = await response.json();
                console.log('MapView.js >> ODSAY loadLane API response:', routeResponse);

                this.clearPolylines();
                this.drawNaverMarker(sx, sy);
                this.drawNaverMarker(ex, ey);
                this.drawNaverPolyLine(routeResponse);

                this.$store.dispatch('selectRoute', { route, index });
                console.log('선택된 경로:', route);
                
                if (this.map) {
                    if (routeResponse.result && routeResponse.result.boundary) {
                        const boundary = new naver.maps.LatLngBounds(
                            new naver.maps.LatLng(routeResponse.result.boundary.top, routeResponse.result.boundary.left),
                            new naver.maps.LatLng(routeResponse.result.boundary.bottom, routeResponse.result.boundary.right)
                        );
                        this.map.panToBounds(boundary);
                    }
                } else {
                    console.error('MapView.js >> Map object is null')
                }

            } catch (error) {
                console.error('MapView.vue >> handleRouteClick >> Error:', error);
            }
        },
        
        clearPolylines() {
            this.polylines.forEach(polyline => polyline.setMap(null));
            this.polylines = [];
        },

        initializeMap() {
            if (window.naver && window.naver.maps) {
                var mapOptions = {
                    center: new naver.maps.LatLng(37.5665, 126.9780),
                    zoom: 10
                };
                this.map = { value: new window.naver.maps.Map('map', mapOptions) };
                console.log('Map initialized:', this.map.value);
            } else {
                console.error('MapView.js >> Naver Maps API is not loaded.');
            }
        },
        drawNaverMarker(x, y) {
            new naver.maps.Marker({
                position: new naver.maps.LatLng(y, x),
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
                        lineArray.push(new naver.maps.LatLng(data.result.lane[i].section[j].graphPos[k].y, data.result.lane[i].section[j].graphPos[k].x));
                    }
                    let lineColor = '#000';

                    const laneClass = data.result.lane[i].class;
                    const laneType = data.result.lane[i].type;

                    if (laneClass === 1) {
                        lineColor = busLineColors[laneType];
                    } else if (laneClass === 2) {
                        lineColor = subwayLineColors[laneType] || lineColor;
                    } else if (laneClass === 3) {
                        lineColor = '#EEEEEE';
                    }

                    const polyline = new naver.maps.Polyline({
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
                console.log('MapView.js >> Displaying route on map with data:', data);

                const resultJsonData = data.result;
                if (resultJsonData) {
                this.drawNaverMarker(data.sx, data.sy);
                this.drawNaverMarker(data.ex, data.ey);
                this.drawNaverPolyLine(resultJsonData);

                if (resultJsonData.result.boundary) {
                    const boundary = new naver.maps.LatLngBounds(
                    new naver.maps.LatLng(resultJsonData.result.boundary.top, resultJsonData.result.boundary.left),
                    new naver.maps.LatLng(resultJsonData.result.boundary.bottom, resultJsonData.result.boundary.right)
                    );
                    this.map.panToBounds(boundary);
                }
                } else {
                console.error('MapView.js >> Invalid response data:', resultJsonData);
                }
            } catch (error) {
                console.error('MapView.js >> Error displaying route:', error);
            }
        },
        
        getTrafficClass(subPath) {
            if (subPath.trafficType === 2) {
                const busClass = `line_bus${subPath.lane && subPath.lane[0] ? subPath.lane[0].type : ''}`;
                // console.log('Bus class:', busClass);
                return busClass;
            } else if (subPath.trafficType === 1) {
                const subwayClass = `line_sub${subPath.lane && subPath.lane[0] ? subPath.lane[0].subwayCode : ''}`;
                // console.log('Subway class:', subClass);
                return subwayClass;
            } else {
                const walkClass = 'line_walk';
                // console.log('Walk class:', walkClass);
                return walkClass;
            }
        },

        getTrafficDetail(subPath) {
            if (subPath.trafficType === 2) {
                const busClass = `bus${subPath.lane && subPath.lane[0] ? subPath.lane[0].type : ''}`;
                // console.log('Bus class:', busClass);
                return busClass;
            } else if (subPath.trafficType === 1) {
                const subwayClass = `sub${subPath.lane && subPath.lane[0] ? subPath.lane[0].subwayCode : ''}`;
                // console.log('Subway class:', subClass);
                return subwayClass;
            }  else {
                const walkClass = 'walk';
                // console.log('Walk class:', walkClass);
                return walkClass;
            }
        },
        
        formatTime(minutes) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours}시간 ${mins}분`;
        },

        getLineClass(trafficType, subwaycode) {
            if (trafficType === 1) {
                return 'bus';
            } else if (trafficType === 2) {
                return `sub${subwaycode}`;
            } else {
                return 'walk';
            }
        },

        getAction(subPath, startName, lane, sectionTime) {
            if (subPath.trafficType === 1) {
                return `지하철 ${lane.map(l => l.name).join(', ')} - ${startName}역`;
            } else if (subPath.trafficType === 2) {
                return `버스 ${lane.map(l => l.busNo).join(', ')} 번 - ${startName}`;
            } else {
                return `도보 ${sectionTime} 분`;
            }
        }
    }
};