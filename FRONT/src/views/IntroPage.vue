<template>

    <div class="wrapper">
        <div class="main-page">
            <div class="content">
                <img src="../assets/img/public_transport_transparent.gif" alt="SaveUs">
                <h1 class="main-title">SaveUs</h1>
            </div>
        </div>
        <div class="buttons">
            <!-- <div class="btn">
                <router-link to="/login">
                    <button class="learn-more">
                        <span class="text">로그인 하기</span>
                    </button>
                </router-link>
            </div> -->
            <div class="btn">
                <router-link to="/MainOne">
                    <button class="learn-more">서비스 사용하기</button>
                </router-link>
            </div>
        </div>
    </div>
    <!-- <div>{{ message }}</div> -->
</template>

<script src="../assets/js/intro"></script>

<style>
    html, body {
        background-color: #fcba03 !important;
    }
</style>

<style scoped src="@/assets/css/intro.css"></style>

