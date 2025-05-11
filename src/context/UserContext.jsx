import React, { createContext, useContext, useEffect, useReducer } from "react";

const UserStateContext = createContext();
const UserDispatchContext = createContext();

const initialState = {
  isAuthenticated: !!localStorage.getItem("access_token"),
  user: null,
};

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false, user: null };
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const init = async () => {
      if (localStorage.getItem("access_token")) {
        await loadUserInfo(dispatch);
      }
    };
    init();
  }, []);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

export function useUserState() {
  const context = useContext(UserStateContext);
  if (!context) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

export function useUserDispatch() {
  const context = useContext(UserDispatchContext);
  if (!context) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

// 로그인
export async function loginUser(dispatch, login, password, navigate, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  if (login && password) {
    try {
      const response = await fetch("http://localhost:8081/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: login, password }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("로그인 실패");

      const data = await response.json();
      localStorage.setItem("access_token", data.accessToken);
      dispatch({ type: "LOGIN_SUCCESS" });

      await loadUserInfo(dispatch);

      setIsLoading(false);
      navigate("/app/dashboard");
    } catch (error) {
      console.error("로그인 에러:", error);
      setError(true);
      setIsLoading(false);
    }
  } else {
    setError(true);
    setIsLoading(false);
  }
}

// 로그아웃
export function signOut(dispatch, navigate) {
  localStorage.removeItem("access_token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  navigate("/login");
}

// 사용자 정보 가져오기
async function loadUserInfo(dispatch) {
  try {
    const response = await fetchWithAuth("http://localhost:8081/api/profile");
    if (!response.ok) throw new Error("사용자 정보 요청 실패");

    const data = await response.json();
    dispatch({ type: "SET_USER", payload: data });
  } catch (error) {
    console.error("사용자 정보 로드 실패:", error);
  }
}

// 인증된 fetch 요청
export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Access token not found");

  const authOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  };

  let response = await fetch(url, authOptions);

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      localStorage.setItem("access_token", newAccessToken);
      authOptions.headers.Authorization = `Bearer ${newAccessToken}`;
      response = await fetch(url, authOptions);
    } else {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
  }

  return response;
}

// 토큰 재발급
async function refreshAccessToken() {
  try {
    const response = await fetch("http://localhost:8081/api/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Token 재발급 실패");

    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error("AccessToken 재발급 에러:", error);
    return null;
  }
}
