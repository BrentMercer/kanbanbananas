import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/', // Ensure this has '/api/'
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;