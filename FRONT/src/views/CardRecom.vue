<template>
    <div class="map-view">
        <div class="controls-results-chart-container">
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
            <div class="results-chart">
                <div id="results">
                    <h3> 🧭 경로를 선택하세요! 🧭 </h3>
                    <div class="route-list-box">
                        <ul class="route-list">
                            <li v-for="(route, index) in routes" :key="index" class="route-data">
                            <div class="route_con" @click="handleRouteClick(route)">
                                <div class="route_time_header"> [총 소요 시간] {{ formatTime(route.totalTime) }}</div>
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
                                        <span class="r_title">➪ {{ route.lastEndStation }} 하차</span>
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
                <div id="chat">
                    <img :src="odsayLogo" alt="ODsay Logo" class="odsay-logo"/> <!-- Add the logo here -->
                    <ChatBot :selectedPayment="selectedPayment" />
                </div>
            </div>
        </div>
        <div id="cardsList">
            <!-- 카드 목록 -->
            <div id="cards">
            <div v-for="card in cards" :key="card.id" class="card" @click="modalOpen(card.id)">
                <img :src="card.imgSrc" :alt="card.altText"/>
                <p>{{ getFormattedAltText(card.altText) }}</p>
            </div>
    
            <div class="modal-wrap" ref="modalWrap">
                <div class="modal-container">
                <div class="modal-content" v-if="selectedCardId">
                    <!-- 여기에 CardDetail 컴포넌트 불러오기 -->
                    <CardDetail :id="selectedCardId" />
                </div>
                    <div class="modal-footer">
                        <button @click="modalClose">close</button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import CardRecomMixin from '../assets/js/CardRecom.js';
import CardDetail from './CardDetail.vue';
import ChatBot from './ChatBot.vue';
import odsayLogo from '../assets/img/ODsay_bi_mark.png';
// eslint-disable-next-line vue/no-unused-vars
if (false) console.log(odsayLogo);

export default {
    name: 'CardRecom',
    components: { CardDetail, ChatBot },
    mixins: [CardRecomMixin],
    props: {
        startPoint: String,
        endPoint: String
    },
    data() {
        return {
            payment: 0,
            formData: {
                home: '',
                start_point: '',
                end_point: '',
                young: 'N',
                subsidiary: 'N'
            },
            selectedPayment: null,
            selectedCardId: null
        };
    },
    created() {
        this.$eventBus.$on('formSubmitted', this.updateFormData);
    },
    methods: {
        updateFormData(data) {
            this.formData = { ...data };
        },
        handleRouteClick(route) {
            this.selectedPayment = route.payment;
            console.log("Selected route payment:", this.selectedPayment);
            this.$emit('payment-selected', this.selectedPayment);
        },
        modalOpen(cardId) {
            console.log("Opening modal for card:", cardId);
            this.selectedCardId = cardId;
            this.$refs.modalWrap.classList.add('show');
        },
        modalClose() {
            this.selectedCardId = null;
            this.$refs.modalWrap.classList.remove('show');
        },
        filteredSubPaths(subPaths) {
            return subPaths.filter(subPath => subPath.trafficType !== 3);
        },
        goToDetail(cardId) {
            console.log(`Navigating to card detail for card id: ${cardId}`);
            this.$router.push({ name: 'CardDetail', params: { id: cardId } });
        },
        getFormattedAltText(altText) {
            const parts = altText.split('*');
            if (parts.length === 2) {
                return `[${parts[1]}] ${parts[0]}`;
            } else if (parts.length === 3) {
                return `[${parts[2]}] ${parts[0]} : ${parts[1]}`;
            } else if (parts.length === 4) {
                return `[${parts[2]}: ${parts[3]}] ${parts[0]} : ${parts[1]}`;
            }
            return altText;
        },
        getTrafficClass(subPath, isBar = false) {
            const prefix = isBar ? 'bar_' : '';
            if (subPath.trafficType === 2) {
                const busClass = `${prefix}bus${subPath.lane && subPath.lane[0] ? subPath.lane[0].type : ''}`;
                return busClass;
            } else if (subPath.trafficType === 1) {
                const subClass = `${prefix}sub${subPath.lane && subPath.lane[0] ? subPath.lane[0].subwayCode : ''}`;
                return subClass;
            } else {
                const walkClass = `${prefix}line_walk`;
                return walkClass;
            }
        },
        async sendParameters() {
            const params = {
                payment: this.selectedPayment,
                home: this.formData.home,
                start_point: this.formData.start_point,
                end_point: this.formData.end_point,
                young: this.formData.young,
                subsidiary: this.formData.subsidiary,
                pre_month: 0 // You might want to add this to formData if needed
            };
            try {
                const response = await fetch(`https://jiyoung.pythonanywhere.com/calculate/calculate-cost/?${new URLSearchParams(params)}`);
                const data = await response.json();
                this.$emit('calculationResult', data);
            } catch (error) {
                console.error('Error sending parameters:', error);
            }
        }
    },
    watch: {
        startPoint(newVal) {
            this.formData.start_point = newVal;
        },
        endPoint(newVal) {
            this.formData.end_point = newVal;
        },
        selectedPayment(newVal) {
            if (newVal) {
                this.sendParameters();
            }
        }
    },
    provide() {
        return {
            selectedPayment: () => this.selectedPayment
        };
    },
    mounted() {
        console.log('Received routes:', this.routes);
    },
    beforeUnmount() {
        this.$eventBus.$off('formSubmitted', this.updateFormData);
    }
};
</script>

<style scoped src="../assets/css/CardRecom.css"></style>