import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { loadUserInfo } from './UserActions';

const UserStateContext = createContext();
const UserDispatchContext = createContext();

const initialState = {
  isAuthenticated: !!localStorage.getItem('access_token'),
  user: null,
};

function userReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, isAuthenticated: true };
    case 'SIGN_OUT_SUCCESS':
      return { ...state, isAuthenticated: false, user: null };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      loadUserInfo(dispatch);
    }
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
  if (!context) throw new Error('useUserState must be used within a UserProvider');
  return context;
}

export function useUserDispatch() {
  const context = useContext(UserDispatchContext);
  if (!context) throw new Error('useUserDispatch must be used within a UserProvider');
  return context;
}
