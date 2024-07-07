import axios from 'axios';
import MapView from '../../components/MapView.vue';

// CSRF 토큰 설정
axios.defaults.withCredentials = true;         
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

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
    components: {
        MapView
    },
    data() {
        return {
            showMapApi: false,
            showCheckButton: false,
            inputs: {
                mem_home: '',
                start_point: '',
                end_point: '',
                mem_young_y: false,
                mem_young_n: false,
                mem_subsidiary_yn: false
            },
            formData: {
                mem_home: '',
                start_point: '',
                end_point: '',
                mem_young_y: false,
                mem_young_n: false,
                mem_subsidiary_yn: false
            },
            csrfToken: getCookie('csrftoken')
        };
    },
    methods: {
        async getCsrfToken() {
            const apiBaseUrl = this.$root.$apiBaseUrl;
            console.log('mainone.js API Base URL:', apiBaseUrl);
            try {
                const response = await axios.get(`${apiBaseUrl}/map/set-csrf-token/`, { withCredentials: true });
                console.log('mainone.js CSRF token set successfully.');
                console.log('mainone.js Response data:', response.data);
                
                // 직접 CSRF 토큰을 설정합니다.
                const csrfToken = response.data.csrfToken;
                this.csrfToken = csrfToken;
        
                // 쿠키에서도 CSRF 토큰을 가져옵니다.
                const cookieCsrfToken = getCookie('csrftoken');
                console.log('mainone.js Retrieved CSRF token from cookie:', cookieCsrfToken);
                this.csrfToken = cookieCsrfToken || csrfToken;
        
                console.log('mainone.js CSRF 토큰:', this.csrfToken);
                return this.csrfToken;
            } catch (error) {
                console.error('mainone.js Error setting CSRF token:', error);
                throw error;
            }
        },
        
        handleCheckboxChange(field) {
            if (field === 'mem_young_y') {
                this.inputs.mem_young_y = true;
                this.inputs.mem_young_n = false;
            } else if (field === 'mem_young_n') {
                this.inputs.mem_young_y = false;
                this.inputs.mem_young_n = true;
            }
        },

        async handleSubmit(event) {
            event.preventDefault();
            await this.checkInputs();
            this.showMapApi = true; // MapView 컴포넌트 표시
        },

        async checkInputs() {
            try {
                if (!this.csrfToken) {
                    await this.getCsrfToken(); // CSRF 토큰을 먼저 가져옵니다.
                }

                this.formData = { ...this.inputs };

                const apiBaseUrl = this.$root.$apiBaseUrl;
                console.log('mainone.js API Base URL:', apiBaseUrl);
                console.log('mainone.js CSRF Token:', this.csrfToken);
                console.log('mainone.js Inputs:', this.inputs);

                const response = await axios.post(
                    `${apiBaseUrl}/map/api/data/`,
                    {
                        mem_home: this.inputs.mem_home,
                        start_point: this.inputs.start_point,
                        end_point: this.inputs.end_point,
                        mem_young_y: this.inputs.mem_young_y,
                        mem_young_n: this.inputs.mem_young_n,
                        mem_subsidiary_yn: this.inputs.mem_subsidiary_yn
                    },
                    {
                        headers: {
                            'X-CSRFToken': this.csrfToken,
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );
                
                console.log('mainone.js Response:', response.data);

                // Emit an event with the form data
                this.$root.$emit('formSubmitted', {
                    mem_home: this.inputs.mem_home,
                    start_point: this.inputs.start_point,
                    end_point: this.inputs.end_point,
                    young: this.inputs.mem_young_y ? 'Y' : 'N',
                    subsidiary: this.inputs.mem_subsidiary_yn ? 'Y' : 'N'
                });

                // 성공적으로 데이터를 받았을 때 showMapApi를 true로 설정하여 MapView 컴포넌트를 표시
                this.showMapApi = true;
                this.showCheckButton = true;
            } catch (error) {
                console.error('mainone.js Error:', error);
            }
        },
        navigateToSignup() {
            this.$router.push({
                name: 'SignupPage',
                params: {
                    mem_home: this.inputs.mem_home,
                    mem_young_y: this.inputs.mem_young_y,
                    mem_young_n: this.inputs.mem_young_n,
                    mem_subsidiary_yn: this.inputs.mem_subsidiary_yn
                }
            });
        }
    },
    mounted() {
        this.getCsrfToken();
        this.$root.$on('formSubmitted', (formData) => {
            this.inputs.start_point = formData.start_point;
            this.inputs.end_point = formData.end_point;
            this.showMapApi = true;
        });
    },
}