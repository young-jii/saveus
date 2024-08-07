<template>
    <div class="container">
        <form id="main-form" @submit.prevent="handleSubmit">
            <!-- 거주지 입력 필드 -->
            <div class="input-data">
                <div class="guide-text">
                    <p>🏠 현재 등록된 거주지를 동까지 입력해주세요. 🏠</p>
                </div>
                <div class="input-wrapper">
                    <span>거주지</span>
                    <input 
                        type="text" 
                        v-model="inputs.mem_home" 
                        placeholder="경기 하남시 감이동"
                    >
                </div>
            </div>
            <!-- 출발지/도착지 입력 필드 -->
            <div class="input-data">
                <div class="guide-text">
                    <p>🚎 매일 왕복해서 다니는 곳의 출발지/도착지를 입력하세요. 🚎</p>
                    <p>📍 해당 주소지를 도로명 주소로 정확하게 입력해 주세요. 📍</p>
                </div>
                <div class="input-wrapper">
                    <span>출발지</span>
                    <input 
                        type="text" 
                        v-model="inputs.start_point" 
                        placeholder="경기 하남시 감일백제로 70"
                    >
                </div>
                <div class="input-wrapper">
                    <span>도착지</span>
                    <input 
                        type="text" 
                        v-model="inputs.end_point" 
                        placeholder="서울 서초구 동작대로 132"
                    >
                </div>
            </div>
            <!-- 개인 정보 입력 필드 -->
            <div class="input-data">
                <div class="guide-text">
                    <p>🧐 본인이 해당되는 영역을 선택하세요. 🧐</p>
                </div>
                <!-- 연령대 입력 필드 -->
                <div class="input-wrapper checkbox-group">
                    <span> 연령대 </span>
                    <div class="checkbox-wrapper">
                        <label :class="{ selected: inputs.mem_young_y }">
                            <input 
                                type="checkbox" 
                                v-model="inputs.mem_young_y"
                                @change="handleCheckboxChange('mem_young_y')"
                            >
                            청년 (19세 ~ 34세)
                        </label>
                    </div>
                    <div class="checkbox-wrapper">
                        <label :class="{ selected: inputs.mem_young_n }">
                            <input 
                                type="checkbox" 
                                v-model="inputs.mem_young_n"
                                @change="handleCheckboxChange('mem_young_n')"
                            >
                            일반
                        </label>
                    </div>
                </div>
                <!-- 소득 여부 입력 필드 -->
                <div class="input-wrapper checkbox-wrapper single-checkbox">
                    <span class="chceck-text"> 소득 여부 </span>
                    <label :class="{ selected: inputs.mem_subsidiary_yn }">
                        <input 
                            type="checkbox" 
                            v-model="inputs.mem_subsidiary_yn"
                        >
                        저소득층
                    </label>
                </div>
            </div>
            <!-- form 태그 제출 버튼 -->
            <div class="submit-data">
                <input type="submit" value="제출하기">
            </div>
        </form>
        <!-- 최적 경로 탐색 코드 -->
        <div id="map-api" v-if="showMapApi">
            <div class="guide-text">
                <p>🗺️ 자주 다니는 최적의 경로를 선택하세요. 🗺️</p>
            </div>
            <div class="map-view-container">
                <map-view
                    :memHome="inputs.mem_home"
                    :startPoint="inputs.start_point"
                    :endPoint="inputs.end_point"
                    :memYoungY="inputs.mem_young_y"
                    :memYoungN="inputs.mem_young_n"
                    :memSubsidiaryYn="inputs.mem_subsidiary_yn"
                    class="full-width"
                />
            </div>
        </div>
        <div id="check-mycost" v-if="showCheckButton">
            <div class="check-mycost">
                <input type="button" value="결과 확인하기" @click="handleResultCheck">
            </div>
        </div>
        <!-- CardRecom 컴포넌트를 props로 데이터를 전달 -->
        <CardRecom v-if="showCardRecom" ref="cardRecom" />
    </div>
</template>

<script>
import mainOne from '../assets/js/MainOne.js';
import MapView from '../components/MapView.vue';
import CardRecom from './CardRecom.vue';
import EventBus from '../../eventBus.js';  // 이벤트 버스 불러오기
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
    mixins: [mainOne],
    components: {
        MapView,
        CardRecom
    },  
    data() {
        return {
            ...mainOne.data(),
            showMapApi: false,
            showMapView: false,
            showCheckButton: false,
            showCardRecom: false,
        };
    },

    computed: {
        ...mapState(['routes']),
        ...mapGetters(['getSelectedRouteIndex']),
        selectedRouteIndex() {
            return this.getSelectedRouteIndex;
        },
    },

    methods: {
        ...mapActions(['selectRoute']),
        
        handleSubmit() {
            console.log("handleSubmit 눌림");
            const formData = {
                mem_home: this.inputs.mem_home,
                start_point: this.inputs.start_point,
                end_point: this.inputs.end_point,
                mem_young_y: this.inputs.mem_young_y,
                mem_young_n: this.inputs.mem_young_n,
                mem_subsidiary_yn: this.inputs.mem_subsidiary_yn,
            };
            this.$store.dispatch('updateFormData', formData);
            this.findRoute();
        },
        
        findRoute() {
            this.showMapApi = true;
            this.showMapView = true;
            this.showCheckButton = true;
        },

        async handleResultCheck() {
            try {
                await new Promise(resolve => setTimeout(resolve, 100));
                const selectedRoute = this.$store.getters.getSelectedRoute;
                console.log('선택된 경로:', selectedRoute);

                console.log('Vuex store 전체:', this.$store);
                console.log('모든 getters:', this.$store.getters);

                if (!selectedRoute || !selectedRoute.payment) {
                    console.error('선택된 경로 또는 결제 정보가 없습니다.');
                    return;
                }

                // Django로 데이터 전송
                await this.$store.dispatch('sendPaymentToDjango');

                this.showCardRecom = true;

                console.log('CardRecom 컴포넌트가 표시됩니다.');
            } catch (error) {
                console.error('handleResultCheck 에러:', error);
            }
        },
    },

    mounted() {
        console.log('초기 Vuex 상태:', this.$store.state);
        EventBus.on('formSubmitted', (formData) => {
            this.inputs.start_point = formData.start_point;
            this.inputs.end_point = formData.end_point;
            this.showMapApi = true;
        });

        this.$store.subscribe((mutation, state) => {
            console.log('Vuex mutation:', mutation.type);
            console.log('새로운 상태:', state);
        });
    },
};
</script>

<style scoped src="@/assets/css/MainOne.css"></style>