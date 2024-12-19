// src/AxiosInstance.js
import axios from 'axios';

const AxiosInstance = axios.create({
    baseURL: 'http://192.168.1.5:8000', // Set your base URL here
    headers: {
        'Content-Type': 'application/json',
    },
});

export default AxiosInstance;
