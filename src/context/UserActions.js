import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

export async function loginUser(dispatch, login, password, navigate, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  if (!login || !password) {
    setError(true);
    setIsLoading(false);
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username: login,
      password,
    }, { withCredentials: true });

    const { accessToken } = response.data;
    localStorage.setItem('access_token', accessToken);
    dispatch({ type: 'LOGIN_SUCCESS' });

    await loadUserInfo(dispatch);

    setError(null);
    navigate('/app/dashboard');
  } catch (error) {
    console.error('로그인 실패:', error);
    setError(true);
  } finally {
    setIsLoading(false);
  }
}

export function signOut(dispatch, navigate) {
  localStorage.removeItem('access_token');
  dispatch({ type: 'SIGN_OUT_SUCCESS' });
  navigate('/login');
}

export async function fetchWithAuth(url, config = {}) {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('Access token not found');

  try {
    return await axios({
      ...config,
      url,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        localStorage.setItem('access_token', newToken);
        return await axios({
          ...config,
          url,
          headers: {
            ...(config.headers || {}),
            Authorization: `Bearer ${newToken}`,
          },
          withCredentials: true,
        });
      } else {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    throw error;
  }
}

export async function refreshAccessToken() {
  try {
    const response = await axios.post(`${API_BASE_URL}/refresh`, null, {
      withCredentials: true,
    });
    return response.data.accessToken;
  } catch (error) {
    console.error('AccessToken 재발급 실패:', error);
    return null;
  }
}

export async function loadUserInfo(dispatch) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/profile`);
    dispatch({ type: 'SET_USER', payload: response.data });
  } catch (error) {
    console.error('사용자 정보 불러오기 실패:', error);
  }
}
