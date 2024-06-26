<template>
    <div class="map-view">
        <div class="controls-results-chart-container">
            <!-- <div id="controls"> -->
                <!-- <div class="control-item">
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
                </div> -->
            <!-- </div> -->
            <div id="chat">
                <ChatBot :selectedPayment="selectedPayment" />
            </div>
        </div>
        <div id="cardsList">
            <!-- 카드 목록 -->
            <div id="cards">
                <div v-for="card in cards" :key="card.id" class="card" @click="modalOpen(card.id)">
                    <img :src="card.imgSrc" :alt="card.altText">
                    <p>{{ getFormattedAltText(card.altText) }}</p>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <Teleport to="body">
            <div v-if="isModalOpen" class="modal-overlay" @click="modalClose">
                <div class="modal-wrap" @click.stop>
                    <div class="modal-container">
                        <div class="modal-content" v-if="selectedCardId">
                        <CardDetail :id="selectedCardId" />
                        </div>
                        <div class="modal-footer">
                            <button @click="modalClose">close</button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue'; // Vue 3 Composition API
import CardRecomMixin from '../assets/js/CardRecom.js'; // Mixin
import CardDetail from './CardDetail.vue'; // Component
import ChatBot from './ChatBot.vue'; // Component

export default {
    name: 'CardRecom',
    components: { CardDetail, ChatBot },
    mixins: [CardRecomMixin],
    props: {
        startPoint: String,
        endPoint: String,
        memHome: String,
        memYoungY: Boolean,
        memYoungN: Boolean,
        memSubsidiaryYn: Boolean,
        payment: Number
    },
    
    setup(props, { emit }) {
        const formData = reactive({
            home: props.memHome || '',
            start_point: props.startPoint || '',
            end_point: props.endPoint || '',
            young: props.memYoungY ? 'Y' : 'N',
            subsidiary: props.memSubsidiaryYn ? 'Y' : 'N'
        });
        const selectedPayment = ref(props.payment);
        const selectedCardId = ref(null);
        const isModalOpen = ref(false);

        const updateFormData = (data) => {
            Object.assign(formData, data);
        };

        const modalOpen = (cardId) => {
            console.log("Opening modal for card:", cardId);
            selectedCardId.value = cardId;
            isModalOpen.value = true;
        };

        const modalClose = () => {
            selectedCardId.value = null;
            isModalOpen.value = false;
        };

        const getFormattedAltText = (altText) => {
        const parts = altText.split('*');
            if (parts.length === 2) {
                return `[${parts[1]}] ${parts[0]}`;
            } else if (parts.length === 3) {
                return `[${parts[2]}] ${parts[0]} : ${parts[1]}`;
            } else if (parts.length === 4) {
                return `[${parts[2]}: ${parts[3]}] ${parts[0]} : ${parts[1]}`;
            }
            return altText;
        };

        const sendParameters = async () => {
        const params = {
            payment: selectedPayment.value,
            home: formData.home,
            start_point: formData.start_point,
            end_point: formData.end_point,
            young: formData.young,
            subsidiary: formData.subsidiary,
            pre_month: 0
        };
        try {
            const response = await fetch(`https://jiyoung.pythonanywhere.com/calculate/calculate-cost/?${new URLSearchParams(params)}`);
            const data = await response.json();
            emit('calculationResult', data);
        } catch (error) {
            console.error('Error sending parameters:', error);
        }
        };

        watch(() => props.startPoint, (newVal) => {
            formData.start_point = newVal;
        });

        watch(() => props.endPoint, (newVal) => {
            formData.end_point = newVal;
        });

        watch(selectedPayment, (newVal) => {
            if (newVal) {
                sendParameters();
            }
        });

        onMounted(() => {
            console.log('Received routes:', CardRecomMixin.data().routes);
        });

        return {
            formData,
            selectedPayment,
            selectedCardId,
            isModalOpen,
            updateFormData,
            modalOpen,
            modalClose,
            getFormattedAltText,
            sendParameters
        };
    }
};
</script>


<style scoped src="../assets/css/CardRecom.css"></style>
