import axios from 'axios';

export const axiosIntance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
});
