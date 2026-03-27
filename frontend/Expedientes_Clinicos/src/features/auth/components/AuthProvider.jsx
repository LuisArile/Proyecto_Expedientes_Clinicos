import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/authService";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem("user");
        const savedToken = sessionStorage.getItem("token");

        return savedUser && savedToken ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (user?.token) {
        // futura validación de token
        }
    }, [user]);

    const login = async (nombreUsuario, clave) => {
        const result = await authService.login(nombreUsuario, clave);

        if (result.success) {
        setUser(result.user);
        }

        return result;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const checkPermission = (permiso) => {
        return user?.permisos?.includes(permiso);
    };

    const value = {
        user,
        login,
        logout,
        checkPermission,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
}