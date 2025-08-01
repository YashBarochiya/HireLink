import { createContext, useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens") 
            ? JSON.parse(localStorage.getItem("authTokens")) 
            : null
    );

    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access));
        }
    }, [authTokens]);

    const login = async (username, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/account/login/", {
                username, password
            });
            setAuthTokens(response.data);
            setUser(jwtDecode(response.data.access));
            localStorage.setItem("authTokens", JSON.stringify(response.data));
        } catch (error) {
            console.error("Login failed", error.response?.data);
        }
    };

    const refreshToken = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/account/token/refresh/", {
                refresh: authTokens?.refresh
            });
            setAuthTokens(response.data);
            localStorage.setItem("authTokens", JSON.stringify(response.data));
        } catch (error) {
            console.error("Token refresh failed", error.response?.data);
            logout();
        }
    };

    const logout = async () => {
        try {
            await axios.post("http://127.0.0.1:8000/api/account/logout/", {}, {
                headers: { Authorization: `Bearer ${authTokens?.access}` }
            });
        } catch (error) {
            console.error("Logout failed", error.response?.data);
        }
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
    };

    return (
        <AuthContext.Provider value={{ user, authTokens, login, logout, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
