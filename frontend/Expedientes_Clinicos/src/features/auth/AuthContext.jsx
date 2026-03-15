import { createContext, useState, useEffect } from "react";
import { authAPI } from "@/services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    const savedToken = sessionStorage.getItem("token");
    return savedUser && savedToken ? JSON.parse(savedUser) : null;
  });

  const login = async (nombreUsuario, clave) => {
    try {
      const result = await authAPI.login(nombreUsuario, clave);
      if (result.success && result.data) {
        const userData = result.data;
        setUser(userData);
        sessionStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("token", result.token);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch {
      return { success: false, error: "No se pudo conectar con el servidor" };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Error al registrar cierre de sesión en bitácora:", error);
    } finally {
      setUser(null);
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    }
  };

  useEffect(() => {
    if (user?.token) {
      // futura validación de token
    }
  }, [user]);

  const checkPermission = (permisoRequerido) => {
    return user?.permisos?.includes(permisoRequerido);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        checkPermission,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}