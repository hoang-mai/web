// src/services/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',  // Đổi thành URL backend sau khi deploy
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
