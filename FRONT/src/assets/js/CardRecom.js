import axios from 'axios';
import { getCsrfToken } from './csrfToken.js';

const axiosInstance = axios.create({
    baseURL: 'https://3.35.141.132',
    withCredentials: true
});

axiosInstance.interceptors.request.use(async (config) => {
    try {
        const token = await getCsrfToken();
        config.headers['X-CSRFToken'] = token;
        console.log('CardRecom.js >> CSRF token set in request headers:', token);
        return config;
    } catch (error) {
        console.error('CardRecom.js >> Failed to set CSRF token in request headers:', error);
        return Promise.reject(error);
    }
});

const CardRecomMixin = {
    props: {
        memHome: String,
        startPoint: String,  // 수정된 부분
        endPoint: String,    // 수정된 부분
        memYoungY: Boolean,
        memYoungN: Boolean,
        memSubsidiaryYn: Boolean
    },
    data() {
        return {
            localStartPoint: this.startPoint,  // 수정된 부분
            localEndPoint: this.endPoint,      // 수정된 부분
            routes: [],
            wsClient: null,
            cards: [
                { id: 1, imgSrc: require('../img/cards/광주은행_신용_후불.png'), altText: "광주은행_신용_후불", link: "/card-detail/1" },
                { id: 2, imgSrc: require('../img/cards/기업은행_신용_후불.webp'), altText: "기업은행_신용_후불", link: "/card-detail/2" },
                { id: 3, imgSrc: require('../img/cards/기업은행_체크_후불.webp'), altText: "기업은행_체크_후불", link: "/card-detail/3" },
                { id: 4, imgSrc: require('../img/cards/기후동행카드.png'), altText: "기후동행카드", link: "/card-detail/4" },
                { id: 5, imgSrc: require('../img/cards/농협_체크_후불.webp'), altText: "농협_체크_후불", link: "/card-detail/5" },
                { id: 6, imgSrc: require('../img/cards/농협카드_신용_후불.webp'), altText: "농협카드_신용_후불", link: "/card-detail/6" },
                { id: 7, imgSrc: require('../img/cards/바로카드_신용_후불.png'), altText: "바로카드_신용_후불", link: "/card-detail/7" },
                { id: 8, imgSrc: require('../img/cards/삼성카드_신용_후불.gif'), altText: "삼성카드_신용_후불", link: "/card-detail/8" },
                { id: 9, imgSrc: require('../img/cards/신한_신용_후불.webp'), altText: "신한_신용_후불", link: "/card-detail/9" },
                { id: 10, imgSrc: require('../img/cards/신한카드_신용_후불_모바일.webp'), altText: "신한카드_신용_후불_모바일", link: "/card-detail/10" },
                { id: 11, imgSrc: require('../img/cards/신한카드_체크_후불.webp'), altText: "신한카드_체크_후불", link: "/card-detail/11" },
                { id: 12, imgSrc: require('../img/cards/우리카드_신용_후불.webp'), altText: "우리카드_신용_후불", link: "/card-detail/12" },
                { id: 13, imgSrc: require('../img/cards/우리카드_체크_후불.webp'), altText: "우리카드_체크_후불", link: "/card-detail/13" },
                { id: 14, imgSrc: require('../img/cards/이동의즐거움_선불_모바일.jpg'), altText: "이동의즐거움_선불_모바일", link: "/card-detail/14" },
                { id: 15, imgSrc: require('../img/cards/이동의즐거움_선불.gif'), altText: "이동의즐거움_선불", link: "/card-detail/15" },
                { id: 16, imgSrc: require('../img/cards/카카오페이_선불_모바일.webp'), altText: "카카오페이_선불_모바일", link: "/card-detail/16" },
                { id: 17, imgSrc: require('../img/cards/케이뱅크_체크_후불.webp'), altText: "케이뱅크_체크_후불", link: "/card-detail/17" },
                { id: 18, imgSrc: require('../img/cards/하나_신용_후불.webp'), altText: "하나_신용_후불", link: "/card-detail/18" },
                { id: 19, imgSrc: require('../img/cards/하나카드_체크_후불.webp'), altText: "하나카드_체크_후불", link: "/card-detail/19" },
                { id: 20, imgSrc: require('../img/cards/DGB유페이_선불_모바일.webp'), altText: "DGB유페이_선불_모바일", link: "/card-detail/20" },
                { id: 21, imgSrc: require('../img/cards/DGB유페이_선불_실물.webp'), altText: "DGB유페이_선불_실물", link: "/card-detail/21" },
                { id: 22, imgSrc: require('../img/cards/KB국민카드_신용_후불.webp'), altText: "KB국민카드_신용_후불", link: "/card-detail/22" },
                { id: 23, imgSrc: require('../img/cards/KB국민카드_체크_후불.webp'), altText: "KB국민카드_체크_후불", link: "/card-detail/23" }
            ],
        };
    },
    watch: {
        startPoint(newStartPoint) {  // 수정된 부분
            this.localStartPoint = newStartPoint;
        },
        endPoint(newEndPoint) {  // 수정된 부분
            this.localEndPoint = newEndPoint;
        }
    },
    methods: {
        async geocode(address) {
            try {
                console.log('CardRecom.js >> Geocoding address:', address);
                const response = await axiosInstance.get('/odsay/geocode/', { params: { address } });
                console.log('CardRecom.js >> Geocode response:', response.data);
                return response.data;
            } catch (error) {
                console.error('CardRecom.js >> Error geocoding address:', error);
                if (error.response) {
                    console.error('CardRecom.js >> Error response data:', error.response.data);
                }
                throw error;
            }
        },
        
        async findRoute() {
            try {
                console.log('CardRecom.js >> Finding route with start point:', this.localStartPoint, 'and end point:', this.localEndPoint);
                
                const startResponse = await this.geocode(this.localStartPoint);
                console.log('CardRecom.js >> Start geocode response:', startResponse);
                const endResponse = await this.geocode(this.localEndPoint);
                console.log('CardRecom.js >> End geocode response:', endResponse);
                
                if (!startResponse || !endResponse) {
                    throw new Error('Failed to get coordinates');
                }

                const sx = startResponse.x;
                const sy = startResponse.y;
                const ex = endResponse.x;
                const ey = endResponse.y;
                
                console.log('CardRecom.js >> Start coordinates:', { sx, sy });
                console.log('CardRecom.js >> End coordinates:', { ex, ey });
                
                const odsasApiUrl = `searchPubTransPathT?SX=${sx}&SY=${sy}&EX=${ex}&EY=${ey}&apiKey=${encodeURIComponent(process.env.VUE_APP_ODSAY_API_KEY)}`;
                console.log('CardRecom.js >> ODSAY API request URL:', odsasApiUrl);
                
                const routeResponse = await this.$odsayAxios.get(odsasApiUrl);
                console.log('CardRecom.js >> ODSAY API response:', routeResponse.data);

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
                            mapObj: path.info.mapObj,
                            sx: sx,
                            sy: sy,
                            ex: ex,
                            ey: ey
                        };
                    });
                } else {
                    console.error('CardRecom.js >> No valid route found');
                }
            } catch (error) {
                console.error('CardRecom.js >> Error finding route:', error);
            }
        },

        
        getTrafficClass(subPath) {
            if (subPath.trafficType === 2) {
                const busClass = `bus${subPath.lane && subPath.lane[0] ? subPath.lane[0].type : ''}`;
                // console.log('Bus class:', busClass);
                return busClass;
            } else if (subPath.trafficType === 1) {
                const subClass = `sub${subPath.lane && subPath.lane[0] ? subPath.lane[0].subwayCode : ''}`;
                // console.log('Subway class:', subClass);
                return subClass;
            } else {
                const walkClass = 'line_walk';
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
        
        getAction(subPath, startName, lane) {
            if (subPath.trafficType === 1) {
                return `지하철 ${lane.map(l => l.name).join(', ')} - ${startName}역`;
            } else if (subPath.trafficType === 2) {
                return `버스 ${lane.map(l => l.busNo).join(', ')} 번 - ${startName}`;
            } else {
                return `도보 - ${startName}`;
            }
        },

    }


};

export default CardRecomMixin;