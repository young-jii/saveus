<template>
    <div class="signup-container">
        <form id="signup-form" @submit.prevent="handleSignup">
            <div class="input-data">
            <div class="guide-text">
                <p>📋 회원가입 정보를 입력해주세요. 📋</p>
            </div>
            <div class="input-wrapper">
                <span>아이디</span>
                <input
                type="text"
                v-model="signupData.name"
                placeholder="홍길동"
                required
                />
            </div>
    
            <div class="input-wrapper">
                <span>비밀번호</span>
                <input
                type="password"
                v-model="signupData.password"
                placeholder="********"
                required
                />
            </div>
            <div class="input-wrapper">
                <span>비밀번호 확인</span>
                <input
                type="password"
                v-model="signupData.confirmPassword"
                placeholder="********"
                required
                />
            </div>
            </div>
            <div class="submit-data">
                <input type="submit" value="회원가입" />
            </div>
            <div class="login-redirect">
            <p>
                이미 계정이 있으신가요?
                <a href="#" @click="redirectToLogin">로그인</a>
            </p>
            </div>
        </form>
        <custom-alert ref="customAlert"></custom-alert>
    </div>
</template>

<script>
import { handleSignup, redirectToLogin } from "../assets/js/Signup.js";
import CustomAlert from "../components/CustomAlert.vue";

export default {
    components: {
        CustomAlert
    },
    data() {
    return {
        signupData: {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
        }
    };
    },
    methods: {
    handleSignup() {
        handleSignup.call(this, this.$refs.customAlert);
    },
    redirectToLogin
    }
};
</script>

<style scoped src="../assets/css/Signup.css"></style>