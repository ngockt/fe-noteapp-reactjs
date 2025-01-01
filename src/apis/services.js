// src/services/services.js
import axios from 'axios';

const accessToken = localStorage.getItem('accessToken') || '';

// Set default authorization header for all axios requests
if (accessToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

// === Add a Response Interceptor ===
axios.interceptors.response.use(
    (response) => {
        // Simply return response if it’s successful
        return response;
    },
    (error) => {
        // Check for 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Remove access token from localStorage
            localStorage.removeItem('accessToken');

            // Redirect to /login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

/**
 * Perform a GET request.
 */
export const getRequest = async (url, params = null, headers = {}) => {
    try {
        const response = await axios.get(url, { params, headers });
        return response.data;
    } catch (error) {
        console.error('GET request failed:', error.response || error.message);
        // No need to handle redirect here since interceptor will catch 401
        throw error;
    }
};

/**
 * Perform a POST request.
 */
export const postRequest = async (url, data, headers = {}) => {
    try {
        const response = await axios.post(url, data, { headers });
        return response;
    } catch (error) {
        console.error('POST request failed:', error.response || error.message);
        throw error;
    }
};

/**
 * Perform a PUT request.
 */
export const putRequest = async (url, data, headers = {}) => {
    try {
        const response = await axios.put(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error('PUT request failed:', error.response || error.message);
        throw error;
    }
};

/**
 * Perform a DELETE request.
 */
export const deleteRequest = async (url, params = null, headers = {}) => {
    try {
        const response = await axios.delete(url, { params, headers });
        return response.data;
    } catch (error) {
        console.error('DELETE request failed:', error.response || error.message);
        throw error;
    }
};
