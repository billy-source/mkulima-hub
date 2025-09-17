import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            setUser({ username: "User" , role: "farmer or buyer"}); //tutaweka api hapa ya user data
        }
    }, [token]);

    const login = (jwt) => {
        localStorage.setItem("token", jwt);
        setToken(jwt);
        navigate("/Dashboard");
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}