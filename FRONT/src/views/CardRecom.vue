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
        <!-- <Teleport to="body"> -->
        <div v-show="isModalOpen" class="modal-overlay" @click="modalClose">
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
        <!-- </Teleport> -->
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import CardRecomMixin from '../assets/js/CardRecom.js'; // Mixin
import CardDetail from './CardDetail.vue'; // Component
import ChatBot from './ChatBot.vue'; // Component

export default {
    name: 'CardRecom',
    components: { CardDetail, ChatBot },
    mixins: [CardRecomMixin],

    setup() {
        const store = useStore();
        const selectedCardId = ref(null);
        const isModalOpen = ref(false);

        const modalOpen = (cardId) => {
            console.log("Opening modal for card:", cardId);
            selectedCardId.value = cardId;
            isModalOpen.value = true;
            document.querySelector('.modal-wrap').classList.add('show');
        };

        const modalClose = () => {
            console.log("Closing modal")
            selectedCardId.value = null;
            isModalOpen.value = false;
            document.querySelector('.modal-wrap').classList.remove('show');
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

        const formData = computed(() => store.state.formData);
        const selectedRoute = computed(() => store.getters.getSelectedRoute);

        onMounted(() => {
            console.log('Vuex formData:', formData.value);
            console.log('Vuex selectedRoute:', selectedRoute.value);
        });

        return {
            selectedCardId,
            isModalOpen,
            modalOpen,
            modalClose,
            getFormattedAltText,
            formData,
            selectedRoute
        };
    }
};
</script>

<style scoped src="../assets/css/CardRecom.css"></style>
