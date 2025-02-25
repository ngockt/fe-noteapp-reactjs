// src/constants/endpoints.js

// Base API URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000"; // Use environment variables for flexibility

console.log(BASE_URL);
// API Endpoints
const ENDPOINTS = {
  AUTH: {
    GOOGLE: `${BASE_URL}/auth/google`,
    LOGIN: `${BASE_URL}/auth/login`,
    SIGNUP: `${BASE_URL}/auth/signup`,
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
    NODE_ME: (id) => `${BASE_URL}/cards/me?node_id=${id}`,
    NODE_GROUP: (id) => `${BASE_URL}/cards/group?node_id=${id}`,
    NODE_COMMUNITY: (id) => `${BASE_URL}/cards/community?node_id=${id}`,
    DETAIL: (id) => `${BASE_URL}/cards/detail/${id}`,
  },
  CARD_CONTENTS: {
    NONE: `${BASE_URL}/contents`,
    WITH_ID: (id) => `${BASE_URL}/contents/${id}`,
  },
  USERS: {
    GET_USER: (id) => `${BASE_URL}/users/${id}`,
    UPDATE_USER: (id) => `${BASE_URL}/users/${id}`,
    DELETE_USER: (id) => `${BASE_URL}/users/${id}`,
  },
  EXPERIMENTS: {
    PROMPTS: `${BASE_URL}/experiments/prompts`
  }
};

export default ENDPOINTS;
