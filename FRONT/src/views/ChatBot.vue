<template>
    <div class="chatbot">
        <div class="chat-window">
            <!-- 채팅 메시지가 여기에 나타납니다 -->
            <div v-for="(message, index) in messages" :key="index" class="chat-message">
                <div :class="['message', message.sender]">{{ message.text }}</div>
            </div>
        </div>
        <div class="message-input">
            <input v-model="userInput" @keyup.enter="sendMessage" placeholder="질문을 입력하세요" />
            <button @click="sendMessage">전송</button>
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useStore } from 'vuex';
import mitt from 'mitt';

const eventBus = mitt();

export default {
    name: 'ChatBot',
    props: ['selectedPayment'],
    setup(props) {
        const store = useStore();
        const messages = ref([]);
        const userInput = ref('');

        // Vuex 상태와 게터를 computed 속성으로 매핑
        const formData = computed(() => store.state.formData);
        const selectedRoute = computed(() => store.getters.getSelectedRoute);

        const sendMessage = () => {
            if (userInput.value.trim() !== '') {
                messages.value.push({ sender: 'user', text: userInput.value });
                const userMessage = userInput.value;
                userInput.value = '';
                getBotResponse(userMessage);
            }
        };

        const getBotResponse = async (message) => {
            let botResponse = '';
            console.log("User message:", message);
            if (message.toLowerCase().includes('안녕하세요')) {
                botResponse = '안녕하세요! 무엇을 도와드릴까요?';
            } else if (message.toLowerCase().includes('도움')) {
                botResponse = '물론이죠, 무엇을 도와드릴까요?';
            } else {
                botResponse = '이것은 봇의 응답입니다.';
            }
            messages.value.push({ sender: 'bot', text: botResponse });
            scrollToEnd();
        };

        const scrollToEnd = () => {
            const chatWindow = document.querySelector('.chat-window');
            if (chatWindow) {
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }
        };

        const formatNumber = (value) => {
            return value.toLocaleString();
        };

        const handleRouteClickPayment = async (payment) => {
            console.log("Handling route click payment in ChatBot:", payment);
            if (payment) {
                try {
                    console.log("Calling calculateCost...");
                    const data = await store.dispatch('sendPaymentToDjango');
                    const minValue = data.minValue;
                    const maxValue = data.maxValue;
                    console.log(`Calculated cost: min=${minValue}, max=${maxValue}`);
                    const botResponse = `현재 선택한 경로의 편도 교통비는 ${selectedRoute.value.payment}원 입니다. \n<해당 경로로 한 달 동안 이용한다고 했을 때 예상 비용>\n ↡ 최소 : ${formatNumber(minValue)}원\n ↟ 최대 : ${formatNumber(maxValue)}원`;
                    messages.value.push({ sender: 'bot', text: botResponse });
                    scrollToEnd();
                } catch (error) {
                    console.error("Error in handleRouteClickPayment:", error);
                }
            }
        };

        const updateFormData = (data) => {
            Object.assign(formData.value, data);
        };

        // watch를 통해 selectedPayment 변경 감지
        watch(() => props.selectedPayment, async (newPayment) => {
            console.log("Selected payment in ChatBot:", newPayment);
            if (newPayment) {
                // handleRouteClickPayment를 호출하여 처리
                await handleRouteClickPayment(newPayment);
            }
        });

        onMounted(() => {
            eventBus.on('formSubmitted', updateFormData);
            eventBus.on('handleRouteClickPayment', handleRouteClickPayment);

            // Vuex 상태 확인
            console.log('Vuex formData:', formData.value);
            console.log('Vuex selectedRoute:', selectedRoute.value);
        });

        onBeforeUnmount(() => {
            eventBus.off('formSubmitted', updateFormData);
            eventBus.off('handleRouteClickPayment', handleRouteClickPayment);
        });

        return {
            messages,
            userInput,
            formData,
            selectedRoute,
            sendMessage,
            getBotResponse,
            scrollToEnd,
            formatNumber,
            handleRouteClickPayment
        };
    }
};
</script>

<style scoped src="../assets/css/ChatBot.css"></style>
