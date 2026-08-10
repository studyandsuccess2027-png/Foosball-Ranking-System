import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );


    // ==============================
    // LOGIN
    // ==============================

    const login = async (email, password) => {

        const res = await api.post("/auth/login", {
            email,
            password
        });


        // Save JWT token
        localStorage.setItem(
            "token",
            res.data.token
        );


        // Save user
        localStorage.setItem(
            "user",
            JSON.stringify(res.data.user)
        );


        // Save role
        localStorage.setItem(
            "role",
            res.data.user.role
        );


        // Update React state
        setUser(res.data.user);


        // Return user data
        return res.data.user;
    };


    // ==============================
    // REGISTER
    // ==============================

    const register = async (
        name,
        email,
        password
    ) => {

        return await api.post(
            "/auth/register",
            {
                name,
                email,
                password
            }
        );

    };


    // ==============================
    // LOGOUT
    // ==============================

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        localStorage.removeItem("role");

        setUser(null);

    };


    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}