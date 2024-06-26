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
                    :memHome="formData.mem_home"
                    :startPoint="formData.start_point"
                    :endPoint="formData.end_point"
                    :memYoungY="formData.mem_young_y"
                    :memYoungN="formData.mem_young_n"
                    :memSubsidiaryYn="formData.mem_subsidiary_yn"
                    class="full-width"
                />
            </div>
        </div>
        <!-- 최종 추천 카드 확인 버튼 -> 해당 버튼을 누르면 회원가입을 하도록 유도 -->
        <div id="check-mycost" v-if="showCheckButton">
            <div class="check-mycost" v-if="showCheckButton">
                <input type="button" value="결과 확인하기" @click="redirectToCardRecom">
                <!-- <input type="button" value="회원가입해서 확인하기" @click="redirectToSignup"> -->
            </div>
        </div>
        <!-- CardRecom 컴포넌트를 props로 데이터를 전달 -->
        <CardRecom v-if="showCardRecom" :startPoint="inputs.start_point" :endPoint="inputs.end_point" />
    </div>
</template>

<script>
import mainOne from '../assets/js/MainOne.js';
import { redirectToSignup as originalRedirectToSignup } from '../assets/js/login.js';
import MapView from '../components/MapView.vue';
import CardRecom from './CardRecom.vue';  // Make sure to import CardRecom

export default {
    mixins: [mainOne],
    components: {
        MapView,
        CardRecom  // Add CardRecom to components
    },  
    data() {
        return {
            ...mainOne.data(),
            showMapView: false,
            showCheckButton: false,
            showCardRecom: false, 
            routes: [],
        };
    },
    methods: {
        redirectToSignup() {
            const queryParams = {
                routes: JSON.stringify(this.routes),
                startPoint: this.inputs.start_point,
                endPoint: this.inputs.end_point
            };
            originalRedirectToSignup.call(this, queryParams);
        },
        redirectToCardRecom() {
            this.showCardRecom = true; // Add this line
            // this.$router.push({
            //     name: 'CardRecom',
            //     query: {
            //         routes: JSON.stringify(this.routes),
            //         startPoint: this.inputs.start_point,
            //         endPoint: this.inputs.end_point
            //     }
            // });
        },
        routesFound(routes) {
            this.routes = routes;
            this.showCheckButton = true;
        }
    },
};
</script>

<style scoped src="@/assets/css/MainOne.css"></style>