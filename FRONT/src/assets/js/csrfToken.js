import axios from 'axios';

export const getCsrfToken = async () => {
    try {
        const response = await axios.get('https://3.35.141.132/odsay/set-csrf-token/', { withCredentials: true });
        console.log('CSRF token received:', response.data);
        return response.data.csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
};