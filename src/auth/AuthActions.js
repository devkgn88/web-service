import axiosInstance from '../api/axiosInstance';

export const loginUser = async (id, password) => {
    const response = await axiosInstance.post('/auth/login', { id, password });
    return response.data.access_token;
};

export const logoutUser = async () => {
    await axiosInstance.post('/auth/logout');
};
