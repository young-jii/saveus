import axios from 'axios';

export const getCsrfToken = async () => {
    try {
        const response = await axios.get('https://d5bf569728f0.ngrok.app/odsay/set-csrf-token/', { withCredentials: true });
        console.log('CSRF token received:', response.data);
        return response.data.csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
};