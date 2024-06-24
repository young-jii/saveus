import axios from 'axios';

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export default {
    name: 'IntroPage',
    data() {
        return {
            message: '',
            csrfToken: null,
        };
    },
    created() {
        this.getCsrfToken().then(() => {
            this.fetchIntroData();
        });
        this.$root.$socket.onmessage = (event) => {
            console.log('WebSocket message received in IntroPage:', event.data);
        };
    },
    methods: {
        async getCsrfToken() {
            const apiBaseUrl = this.$root.$apiBaseUrl;
            console.log('---시작---')
            console.log('IntroPage API Base URL:', apiBaseUrl);
            try {
                const response = await axios.get(`${apiBaseUrl}/map/api/set-csrf-token/`, { withCredentials: true });
                console.log('IntroPage CSRF token set successfully.');
                console.log('IntroPage Response data:', response.data);

                const csrfToken = response.data.csrfToken;
                this.csrfToken = csrfToken;

                const cookieCsrfToken = getCookie('csrftoken');
                console.log('IntroPage Retrieved CSRF token from cookie:', cookieCsrfToken);
                this.csrfToken = cookieCsrfToken || csrfToken;

                console.log('IntroPage CSRF 토큰:', this.csrfToken);
                return this.csrfToken;
            } catch (error) {
                console.error('IntroPage Error setting CSRF token:', error);
                throw error;
            }
        },
        async fetchIntroData() {
            const apiBaseUrl = this.$root.$apiBaseUrl;
            console.log('Fetching intro data from:', `${apiBaseUrl}/main/api/intro/`);
            try {
                const response = await fetch(`${apiBaseUrl}/main/api/intro/`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('IntroPage fetched data:', data);
                this.message = data.message;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    }
};