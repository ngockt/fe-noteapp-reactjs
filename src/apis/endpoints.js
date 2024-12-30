// src/constants/endpoints.js

// Base API URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000"; // Use environment variables for flexibility

// API Endpoints
const ENDPOINTS = {
  AUTH: {
    GOOGLE: `${BASE_URL}/auth/google`,
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/signup`,
  },
  NODES: `${BASE_URL}/nodes`,
  GRAPH: `${BASE_URL}/graph`,
  LANGUAGES: `${BASE_URL}/languages`,
  PROJECTS: {
    NONE: `${BASE_URL}/projects`,
    ME: `${BASE_URL}/projects/me`,
    GROUP: `${BASE_URL}/projects/group`,
    COMMUNITY: `${BASE_URL}/projects/community`,
    WITH_ID: (id) => `${BASE_URL}/projects/${id}`,
  },
  CARDS: {
    NONE: `${BASE_URL}/cards`,
    ME: `${BASE_URL}/cards/me`,
    GROUP: `${BASE_URL}/cards/group`,
    COMMUNITY: `${BASE_URL}/cards/community`,
  },
  CARD_CONTENTS: {
    NONE: `${BASE_URL}/content`,
    WITH_ID: (id) => `${BASE_URL}/content/${id}`,
  },
  USERS: {
    GET_USER: (id) => `${BASE_URL}/users/${id}`,
    UPDATE_USER: (id) => `${BASE_URL}/users/${id}`,
    DELETE_USER: (id) => `${BASE_URL}/users/${id}`,
  },
};

export default ENDPOINTS;
