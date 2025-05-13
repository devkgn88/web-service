import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8081/api',
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
    return Promise.reject(error);
    }
);

export default axiosInstance;
