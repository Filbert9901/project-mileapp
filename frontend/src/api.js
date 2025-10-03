// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://mileapp-test-production.up.railway.app",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
