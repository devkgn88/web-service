import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8081/api',
    withCredentials: true,
});

// 요청 인터셉터
// 모든 요청을 보내기 전에 access_token을 헤더에 자동으로 붙여줌
axiosInstance.interceptors.request.use(
    (config) => {
        // localStorage에서 access_token 가져오기
        const token = localStorage.getItem('access_token');
        if(token){
            // 요청 헤더에 토큰 추가
            config.headers.Authorization = `Bearer ${token}`;
        }
        // 토근 정보가 추가된 요청 config 반환
        return config;
    },
    (error) => Promise.reject(error) // 에러 발생시 거부된 Promise 반환
);

// 응답 인터셉터
// accessToken 만료 되어 401 오류가 발생하면 refresh 시도

// 현재 refresh 요청 중인지 여부(중복 요청 방지)
let isRefreshing = false;
// refresh 도중 들어온 요청들을 저장해 두는 큐(refresh 끝난 후 처리)
let failedQueue = [];

// refresh 완료 후 실패한 요청들 처리
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if(error) {
            // 에러 발생시 모두 reject 처리
            prom.reject(error);
        } else{
            // 토큰 재발급 성공 시 새 토큰 전달하여 요청 재시도
            prom.resolve(token);
        }
    });
    // 큐 초기화
    failedQueue = [];
}


axiosInstance.interceptors.response.use(
    (response) => response, // 응답이 정상일 경우 그대로 반환
    async(error) => {
        const originalRequest = error.config; // 실패한 원래 요청 객체

        // 조건 : 401 오류 + 아직 retry 한 적 없는 요청일 경우
        if(error.response?.status === 401 && !originalRequest._retry){
            if(isRefreshing){
                // 이미 다른 요청이 refresh 중이면 큐에 이 요청을 등록하고 기다림
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            // 새 토큰으로 원래 요청에 Authorization 붙여서 재요청
                            originalRequest.headers['Authorization'] = 'Bearer '+token;
                            resolve(axiosInstance(originalRequest)); // 재요청 보내기
                        },
                        reject: (err) => reject(err), // 실패시 reject 처리
                    });
                });
            }

            originalRequest._retry = true; // 재시도 플래그 설정
            isRefreshing = true; // refresh 중이라고 설정

            try{
                // refresh 토큰을 이용한 access 토큰 재발급 요청
                const refreshResponse = await axios.post('http://localhost:8081/api/auth/refresh', null, {
                    withCredentials: true, // refreshToken이 쿠키에 있다면 꼭 포함해야 함
                });

                const newAccessToken = refreshResponse.data.accessToken; // 새로 받은 access_token
                localStorage.setItem('access_token', newAccessToken); // 저장

                processQueue(null, newAccessToken); // 기다리던 요청들 처리
                originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken; // 원래 요청에 새 토큰 추가

                return axiosInstance(originalRequest); // 원래 요청 다시 보내기
            } catch(refreshError){
                // refresh 실패 (로그인 만료 등) → 로그아웃 처리
                processQueue(refreshError, null); // 큐에 있는 요청들도 모두 실패 처리
                localStorage.removeItem('access_token'); // access_token 삭제
                window.location.href = '/auth/login'; // 로그인 페이지로 이동
                return Promise.reject(refreshError); // 호출부에도 에러 전달
            } finally {
                isRefreshing = false; // refresh 종료
            }
        }
        return Promise.reject(error);   // 다른 에러는 그대로 전달
    }

);

export default axiosInstance;
