// src/services/apiService.js
import axios from 'axios';

// You can retrieve the access token from localStorage or sessionStorage, for example.
const accessToken = localStorage.getItem('access_token') || ''; // Replace with actual logic

// Set default authorization header for all axios requests
if (accessToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

/**
 * Perform a GET request.
 *
 * @param {string} url - The endpoint URL.
 * @param {object} [params] - The query parameters (optional).
 * @param {object} [headers] - Additional headers (optional).
 * @returns {Promise} - A promise that resolves to the response data.
 */
export const getRequest = async (url, params = null, headers = {}) => {
    try {
        const response = await axios.get(url, {
            params,
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('GET request failed:', error.response || error.message);
        throw error;
    }
};

/**
 * Perform a POST request.
 *
 * @param {string} url - The endpoint URL.
 * @param {object} data - The payload for the POST request.
 * @param {object} [headers] - Additional headers (optional).
 * @returns {Promise} - A promise that resolves to the response data.
 */
export const postRequest = async (url, data, headers = {}) => {
    try {
        const response = await axios.post(url, data, {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('POST request failed:', error.response || error.message);
        throw error;
    }
};

/**
 * Perform a PUT request.
 *
 * @param {string} url - The endpoint URL.
 * @param {object} data - The payload for the PUT request.
 * @param {object} [headers] - Additional headers (optional).
 * @returns {Promise} - A promise that resolves to the response data.
 */
export const putRequest = async (url, data, headers = {}) => {
    try {
        const response = await axios.put(url, data, {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('PUT request failed:', error.response || error.message);
        throw error;
    }
};

/**
 * Perform a DELETE request.
 *
 * @param {string} url - The endpoint URL.
 * @param {object} [params] - The query parameters (optional).
 * @param {object} [headers] - Additional headers (optional).
 * @returns {Promise} - A promise that resolves to the response data.
 */
export const deleteRequest = async (url, params = null, headers = {}) => {
    try {
        const response = await axios.delete(url, {
            params,
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('DELETE request failed:', error.response || error.message);
        throw error;
    }
};
