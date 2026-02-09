import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // backend URL from .env
  withCredentials: true, // Always true for cookies/auth, including incognito and cross-origin
});

export default API;
