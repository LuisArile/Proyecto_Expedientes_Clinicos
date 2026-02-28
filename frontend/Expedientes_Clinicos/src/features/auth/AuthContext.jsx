import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    
    return (savedUser && savedToken) ? JSON.parse(savedUser) : null;
  });

  const login = async (nombreUsuario, clave) => {
    try {
      const response = await fetch("http://localhost:3000/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreUsuario, clave }),
      });

      const result = await response.json();

      if (result.success) {
        // Estructura del backend: { id, nombre, rol }
        const userData = result.data; 
        
        // Guardamos en estado y en almacenamiento persistente
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", result.token);

        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, error: "No se pudo conectar con el servidor" };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token enviado al logout:", token);
      
      await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      });
    } catch (error) {
      console.error("Error al registrar cierre de sesión en bitácora:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    if (user && user.token) {
      // futura validación de token
    }
  }, []);

  return (
    <AuthContext.Provider 
    value={{ 
      user,
      login,
      logout,
      isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}