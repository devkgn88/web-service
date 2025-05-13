import axiosInstance from '../api/axiosInstance';

export const loginUser = async (username, password) => {
    const response = await axiosInstance.post('/auth/login', { username, password });
    console.log(response);
    return response.data.access_token;
};

export const logoutUser = async () => {
    await axiosInstance.post('/auth/logout');
};
