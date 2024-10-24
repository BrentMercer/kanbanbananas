import axios from 'axios';

const axiosInstance = axios.create({
    // AWS Lightsail static IP => http://44.239.4.189:8080
    // AWS Lightsail domain => http://kanbanbananas.com
    // Local installation => http://localhost:8080
    baseURL: 'http://kanbanbananas.com',
    timeout: 10000, // This 10000 milliseconds equals 10 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
