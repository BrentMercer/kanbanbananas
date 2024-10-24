import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://kanbanbananas.com', // AWS Lightsail IP http://18.236.199.74:8080/
    timeout: 10000, // This 10000 milliseconds equals 10 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
