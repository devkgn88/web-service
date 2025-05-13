import axiosInstance from '../api/axiosInstance';

export const loginUser = async (username, password) => {
    const response = await axiosInstance.post('/auth/login', { username, password });
    return response.data.accessToken;
};

export const logoutUser = async () => {
    await axiosInstance.post('/auth/logout');
};
