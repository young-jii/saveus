<template>
    <div class="login-container">
        <form id="login-form" @submit.prevent="handleLogin">
            <div class="input-data">
                <div class="guide-text">
                    <p>🔑 로그인 정보를 입력해주세요. 🔑</p>
                </div>
                <div class="input-wrapper">
                    <span>아이디</span>
                    <input 
                        type="text" 
                        v-model="loginData.id" 
                        placeholder="example"
                        required
                    >
                </div>
                <div class="input-wrapper">
                    <span>비밀번호</span>
                    <input 
                        type="password" 
                        v-model="loginData.password" 
                        placeholder="********"
                        required
                    >
                </div>
            </div>
            <div class="submit-data">
                <input type="submit" value="로그인" />
            </div>
        <div class="signup-redirect">
            <p> 계정이 없으신가요?
                <a href="https://young-jii.github.io/saveus/MainOne">서비스 이용하러 가기</a>
            </p>
        </div>
        </form>
    <custom-alert ref="customAlert"></custom-alert>
    </div>
</template>

<script>
import { handleLogin } from "../assets/js/login.js";
import CustomAlert from "../components/CustomAlert.vue";

export default {
    components: {
        CustomAlert
    },
    data() {
        return {
        loginData: {
            id: "",
            password: ""
        }
        };
    },
    methods: {
        handleLogin() {
        handleLogin.call(this, this.$refs.customAlert);
        }
    }
};
</script>

<style scoped src="../assets/css/login.css"></style>