import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        setIsAuthenticated(!!token);
    }, []);

    const login = (data) => {
        localStorage.setItem("access_token", data.accessToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
        window.location.href = "/auth/login";
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
