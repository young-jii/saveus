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
export default {
    name: 'ChatBot',
    props: ['selectedPayment'], // selectedPayment를 props로 받기
    data() {
        return {
            messages: [],
            userInput: ''
        };
    },
    watch: {
        async selectedPayment(newPayment) {
            console.log("Selected payment in ChatBot:", newPayment); // 콘솔에 출력
            if (newPayment) {
                await this.handleRouteClickPayment(newPayment);
            }
        }
    },
    methods: {
        sendMessage() {
            if (this.userInput.trim() !== '') {
                this.messages.push({ sender: 'user', text: this.userInput });
                const userMessage = this.userInput;
                this.userInput = '';
                this.getBotResponse(userMessage);
            }
        },
        async getBotResponse(message) {
            let botResponse = '';
            console.log("User message:", message); // 추가
            if (message.toLowerCase().includes('안녕하세요')) {
                botResponse = '안녕하세요! 무엇을 도와드릴까요?';
            } else if (message.toLowerCase().includes('도움')) {
                botResponse = '물론이죠, 무엇을 도와드릴까요?';
            } else {
                botResponse = '이것은 봇의 응답입니다.';
            }
            this.messages.push({ sender: 'bot', text: botResponse });
            this.scrollToEnd();
        },
        scrollToEnd() {
            const chatWindow = this.$el.querySelector('.chat-window');
            if (chatWindow) {
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }
        },
        formatNumber(value) {
            return value.toLocaleString();
        },
        async calculateCost(payment) {
            console.log(`Sending request to calculate cost with payment: ${payment}`); // 콘솔에 출력
            try {
                const response = await fetch(`https://3.35.141.132/calculate/calculate-cost/?payment=${payment}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Response data:', data); // 응답 데이터 콘솔에 출력
                return data;
            } catch (error) {
                console.error('Error calculating cost:', error);
                return { minValue: 0, maxValue: 0 };
            }
        },
        async handleRouteClickPayment(payment) {
            console.log("Handling route click payment in ChatBot:", payment); // 콘솔에 출력
            if (payment) {
                try {
                    console.log("Calling calculateCost..."); // 추가
                    const { minValue, maxValue } = await this.calculateCost(payment);
                    console.log(`Calculated cost: min=${minValue}, max=${maxValue}`); // 추가
                    const botResponse = `현재 선택한 경로의 편도 교통비는 ${this.formatNumber(payment)}원 입니다. \n<해당 경로로 한 달 동안 이용한다고 했을 때 예상 비용>\n ↡ 최소 : ${this.formatNumber(minValue)}원\n ↟ 최대 : ${this.formatNumber(maxValue)}원`;
                    this.messages.push({ sender: 'bot', text: botResponse });
                    this.scrollToEnd();
                } catch (error) {
                    console.error("Error in handleRouteClickPayment:", error);
                }
            }
        }
    }
};
</script>

<style scoped src="../assets/css/ChatBot.css"></style>
