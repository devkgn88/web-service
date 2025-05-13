import axiosInstance from '../api/axiosInstance';

export const loginUser = async (username, password) => {
    const response = await axiosInstance.post('/login', { username, password });
    return response.data.access_token;
};

export const logoutUser = async () => {
    await axiosInstance.post('/auth/logout');
};
