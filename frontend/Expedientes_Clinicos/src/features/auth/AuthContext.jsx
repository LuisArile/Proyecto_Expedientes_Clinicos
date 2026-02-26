import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (nombreUsuario, clave) => {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreUsuario, clave }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Credenciales incorrectas");
    }

    setUser(result.data);
    localStorage.setItem("user", JSON.stringify(result.data));

    return result.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Opcional: aquí podrías validar token al cargar la app
  useEffect(() => {
    if (user && user.token) {
      // futura validación de token si deseas
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);