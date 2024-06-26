<template>
    <div v-if="visible" class="custom-alert">
        <div class="alert-content">
            <p>{{ message }}</p>
            <button @click="handleConfirm">확인</button>
        </div>
    </div>
</template>
    
<script>
export default {
    data() {
        return {
            visible: false,
            message: '',
            confirmCallback: null
        };
    },
    methods: {
        showAlert(message, callback) {
            this.message = message;
            this.confirmCallback = typeof callback === 'function' ? callback : null;
            this.visible = true;
        },
        handleConfirm() {
            this.visible = false;
            if (this.confirmCallback) {
                this.confirmCallback();
            }
        }
    }
};
</script>

<style>
.custom-alert {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.alert-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
}

.alert-content button {
    margin-top: 10px;
}
</style>
