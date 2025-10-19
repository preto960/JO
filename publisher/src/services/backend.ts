import axios from 'axios';

const backendApi = axios.create({
  baseURL: process.env.BACKEND_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

export default backendApi;