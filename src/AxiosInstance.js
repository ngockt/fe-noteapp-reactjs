// src/AxiosInstance.js
import axios from 'axios';

const AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // Set your base URL here
    headers: {
        'Content-Type': 'application/json',
    },
});

export default AxiosInstance;
