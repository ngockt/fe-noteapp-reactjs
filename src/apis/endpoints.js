// Base API URL
const BASE_URL = "https://api.example.com";

// API Endpoints
const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    LOGOUT: `${BASE_URL}/auth/logout`,
  },
  CARDS: {
    ME: '/card/me',
    GROUP: '/card/group',
    COMMUNITY: '/card/community'
  },
  USERS: {
    GET_USER: (id) => `${BASE_URL}/users/${id}`,
    UPDATE_USER: (id) => `${BASE_URL}/users/${id}`,
    DELETE_USER: (id) => `${BASE_URL}/users/${id}`,
  },
  POSTS: {
    GET_ALL_POSTS: `${BASE_URL}/posts`,
    GET_POST: (id) => `${BASE_URL}/posts/${id}`,
    CREATE_POST: `${BASE_URL}/posts`,
    UPDATE_POST: (id) => `${BASE_URL}/posts/${id}`,
    DELETE_POST: (id) => `${BASE_URL}/posts/${id}`,
  },
};

export default ENDPOINTS;
