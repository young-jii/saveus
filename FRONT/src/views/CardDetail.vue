<template>
    <div class="card-info" v-if="card">
        <h1>{{ card.title }}</h1>
        <ul>
            <li v-if="card.issuance" class="section-title">발급 대상</li>
            <li v-if="card.issuance" v-html="formatText(card.issuance)"></li>
            <li v-if="card.brand" class="section-title">브랜드</li>
            <li v-if="card.brand" v-html="formatText(card.brand)"></li>
            <li v-if="card.annualFee" class="section-title">연회비</li>
            <li v-if="card.annualFee" v-html="formatText(card.annualFee)"></li>
            <li v-if="card.discount" class="section-title">할인혜택</li>
            <li v-if="card.discount" v-html="formatText(card.discount)"></li>
            <li v-if="card.discountDetails" v-html="formatText(card.discountDetails)"></li>
            <li v-if="card.postpaid" class="section-title">후불교통카드</li>
            <li v-if="card.postpaid" v-html="formatText(card.postpaid)"></li>
            <li class="section-title">상세 정보 확인하기</li>
            <li>
                <button @click="openLink(card.link)">세이버스 바로 발급</button>
            </li>
        </ul>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>

</template>

<script>
import cardData from '../assets/js/cardData';

export default {
    name: 'CardDetail',
    props: ['id'],
    data() {
        return {
            card: null
        };
    },
    watch: {
        id: {
            immediate: true,
            handler(newId) {
                this.fetchCardDetail(newId);
            }
        }
    },
    methods: {
        fetchCardDetail(cardId) {
            console.log("fetchCardDetail called with id:", cardId);
            const parsedCardId = parseInt(cardId);
            this.card = cardData.find(card => card.id === parsedCardId);
            if (!this.card) {
                console.error(`Card with id ${parsedCardId} not found`);
            }
        },
        openLink(url) {
            window.location.href = url;
        },
        formatText(text) {
            return text.replace(/\n/g, '<br>');
        }
    }
};
</script>

<style scoped src="../assets/css/cardDetail.css"></style>
