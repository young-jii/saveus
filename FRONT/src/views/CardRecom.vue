<template>
    <div class="map-view">
        <div class="controls-results-chart-container">
            <!-- 결과 및 경로 선택을 위한 컨테이너 -->
            <div id="chat">
                <ChatBot :selectedPayment="localSelectedPayment" />
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
        selectedPayment: Number
    },
    
    setup(props, { emit }) {
        const formData = reactive({
            home: props.memHome || '',
            start_point: props.startPoint || '',
            end_point: props.endPoint || '',
            young: props.memYoungY ? 'Y' : 'N',
            subsidiary: props.memSubsidiaryYn ? 'Y' : 'N'
        });
        const localSelectedPayment = ref(props.selectedPayment); // props.selectedPayment를 localSelectedPayment로 변경
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
                payment: localSelectedPayment.value,
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

        watch(localSelectedPayment, (newVal) => {
            if (newVal) {
                sendParameters();
            }
        });

        onMounted(() => {
            console.log('Received routes:', CardRecomMixin.data().routes);
        });

        return {
            formData,
            localSelectedPayment,
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
