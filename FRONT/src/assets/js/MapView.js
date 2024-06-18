import axios from 'axios';
import { EventBus } from '../../../eventBus';  // 이벤트 버스 불러오기


// CSRF 토큰을 가져와 Axios 인스턴스에 추가
const getCsrfToken = async () => {
    try {
        const response = await axios.get('https://d5bf569728f0.ngrok.app/odsay/set-csrf-token/', { withCredentials: true });
        console.log('MapView.js >> CSRF token received:', response.data);
        return response.data.csrfToken;
    } catch (error) {
        console.error('MapView.js >> Error fetching CSRF token:', error);
        throw error;  // 에러 발생 시 throw로 전달
    }
};

// Axios 인스턴스 생성 및 기본 설정 추가
const axiosInstance = axios.create({
    baseURL: 'https://d5bf569728f0.ngrok.app',  // ngrok 도메인 설정
    withCredentials: true  // 자격 증명 포함
});

axiosInstance.interceptors.request.use(async (config) => {
    try {
        const token = await getCsrfToken();
        config.headers['X-CSRFToken'] = token;
        console.log('MapView.js >> CSRF token set in request headers:', token);
        return config;
    } catch (error) {
        console.error('MapView.js >> Failed to set CSRF token in request headers:', error);
        return Promise.reject(error);  // 에러 발생 시 요청 중단
    }
});

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
            wsClient: null,
            polylines: []  // 폴리라인을 저장할 배열
        };
    },
    methods: {
        async geocode(address) {
            try {
                console.log('MapView.js >> Geocoding address:', address);
                const response = await axiosInstance.get('/odsay/geocode/', { params: { address } });
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
            try {
                console.log('MapView.js >> Finding route with start point:', this.localStartPoint, 'and end point:', this.localEndPoint);
                
                // localStartPoint와 localEndPoint가 유효한지 확인
                if (!this.localStartPoint || !this.localEndPoint) {
                    throw new Error('Start point or end point is missing');
                }

                // Geocoding 주소를 통해 좌표를 가져오는 부분 (백엔드에서 처리)
                const startResponse = await this.geocode(this.localStartPoint);  // GET 메서드를 사용하도록 수정
                console.log('MapView.js >> Start geocode response:', startResponse);
                const endResponse = await this.geocode(this.localEndPoint);  // GET 메서드를 사용하도록 수정
                console.log('MapView.js >> End geocode response:', endResponse);
                
                if (!startResponse || !endResponse) {
                    throw new Error('Failed to get coordinates');
                }

                // startResponse와 endResponse에서 올바르게 데이터를 추출
                const sx = startResponse.x;
                const sy = startResponse.y;
                const ex = endResponse.x;
                const ey = endResponse.y;
                
                console.log('MapView.js >> Start coordinates:', { sx, sy });
                console.log('MapView.js >> End coordinates:', { ex, ey });
                
                // ODSAY API를 통해 경로 찾기 요청
                const odsasApiUrl = `searchPubTransPathT?SX=${sx}&SY=${sy}&EX=${ex}&EY=${ey}&apiKey=${encodeURIComponent(process.env.VUE_APP_ODSAY_API_KEY)}`;
                console.log('MapView.js >> ODSAY API request URL:', odsasApiUrl); // 요청 URL을 로그에 출력
                
                const routeResponse = await this.$odsayAxios.get(odsasApiUrl);
                console.log('MapView.js >> ODSAY API response:', routeResponse.data);

                if (routeResponse.data && routeResponse.data.result && routeResponse.data.result.path) {
                    this.routes = routeResponse.data.result.path.map((path) => {
                        return {
                            totalTime: path.info.totalTime,
                            totalWalk: path.info.totalWalk,
                            busTransitCount: path.info.busTransitCount,
                            subwayTransitCount: path.info.subwayTransitCount,
                            payment: path.info.payment,
                            totalDistance: path.info.totalDistance,
                            firstStartStation: path.subPath[0].startName,
                            startNameKor: path.subPath[0].startName,
                            endName: path.subPath[path.subPath.length - 1].endName,
                            lastEndStation: path.subPath[path.subPath.length - 1].endName,
                            subPaths: path.subPath,
                            mapObj: path.info.mapObj,  // mapObj를 여기서 가져옴
                            sx: sx,  // 출발 좌표
                            sy: sy,  // 출발 좌표
                            ex: ex,  // 도착 좌표
                            ey: ey   // 도착 좌표
                        };
                    });
                    console.log('MapView.js >> Emitting route-found event with routes:', this.routes);
                    // 이벤트 발생
                    EventBus.emit('route-found', this.routes);
                } else {
                    console.error('MapView.js >> No valid route found');
                }
            } catch (error) {
                console.error('MapView.js >> Error finding route:', error);
            }
        },

        async handleRouteClick(route) {
            try {
                const { mapObj, sx, sy, ex, ey } = route;
                console.log('MapView.vue >> handleRouteClick >> mapObj:', mapObj);
                console.log('MapView.vue >> handleRouteClick >> sx, sy, ex, ey:', sx, sy, ex, ey);

                const odsasApiUrl = `https://api.odsay.com/v1/api/loadLane?mapObject=0:0@${mapObj}&apiKey=${encodeURIComponent(process.env.VUE_APP_ODSAY_API_KEY)}`;
                console.log('MapView.vue >> ODSAY loadLane API request URL:', odsasApiUrl);

                const routeResponse = await this.$odsayAxios.get(odsasApiUrl);
                console.log('MapView.js >> ODSAY loadLane API response:', routeResponse.data);
                
                this.clearPolylines();  // 기존 폴리라인 삭제

                this.drawNaverMarker(sx, sy);
                this.drawNaverMarker(ex, ey);
                this.drawNaverPolyLine(routeResponse.data);

                if (routeResponse.data.result.boundary) {
                    const boundary = new naver.maps.LatLngBounds(
                        new naver.maps.LatLng(routeResponse.data.result.boundary.top, routeResponse.data.result.boundary.left),
                        new naver.maps.LatLng(routeResponse.data.result.boundary.bottom, routeResponse.data.result.boundary.right)
                    );
                    this.map.panToBounds(boundary);
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
            if (window.naver) {
                var mapOptions = {
                    center: new naver.maps.LatLng(37.5665, 126.9780),
                    zoom: 10
                };
                this.map = new naver.maps.Map('map', mapOptions);
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
            let lineArray;
            for (let i = 0; i < data.result.lane.length; i++) {
                for (let j = 0; j < data.result.lane[i].section.length; j++) {
                    lineArray = [];
                    for (let k = 0; k < data.result.lane[i].section[j].graphPos.length; k++) {
                        lineArray.push(new naver.maps.LatLng(data.result.lane[i].section[j].graphPos[k].y, data.result.lane[i].section[j].graphPos[k].x));
                    }
                    // 교통수단에 따른 색상 지정
                    let lineColor = '#000';  // 기본 색상은 검정색
                    
                    const laneClass = data.result.lane[i].class;  // 교통수단 클래스 (1: 버스, 2: 지하철)
                    const laneType = data.result.lane[i].type;  // 교통수단 타입 (지하철 노선 코드 또는 버스 타입)
                    
                    if (laneClass === 1) {
                        /// 버스
                        lineColor = busLineColors[laneType]
                    } else if (laneClass === 2) {
                        // 지하철
                        lineColor = subwayLineColors[laneType] || lineColor;
                    } else if (laneClass === 3) {
                        // 도보
                        lineColor = '#EEEEEE';
                    }
                    
                    const polyline = new naver.maps.Polyline({
                        map: this.map,
                        path: lineArray,
                        strokeWeight: 5,
                        strokeColor: lineColor
                    });
                    this.polylines.push(polyline);  // 폴리라인 저장
                }
            }
        },
        
        displayRouteOnMap(data) {
            try {
                console.log('MapView.js >> Displaying route on map with data:', data);

                const resultJsonData = data.result;
                if (resultJsonData) {
                    // 지도에 마커 표시
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

        getAction(subPath, startName, lane) {
            if (subPath.trafficType === 1) {
                return `지하철 ${lane.map(l => l.name).join(', ')} - ${startName}역`;
            } else if (subPath.trafficType === 2) {
                return `버스 ${lane.map(l => l.busNo).join(', ')} 번 - ${startName}`;
            } else {
                return `도보 - ${startName}`;
            }
        }
    },
    async mounted() {
        // this.wsClient = new WebSocketClient('wss://3a145eca76f9.ngrok.app/ws/route/');
        // this.wsClient.connect();
        this.initializeMap();
        await this.findRoute();
    },
    watch: {
        startPoint(newStartPoint) {
            this.localStartPoint = newStartPoint;
        },
        endPoint(newEndPoint) {
            this.localEndPoint = newEndPoint;
        }
    }
};