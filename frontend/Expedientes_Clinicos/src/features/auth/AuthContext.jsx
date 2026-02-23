import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  
  const [user, setUser] = useState({
    id: 1,
    name: "Ana Martínez",
    username: "admin",
    role: "administrador", 
  });

  // Función estática para cerrar sesión
  const logout = () => {
    console.log("Cerrando sesión estática...");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
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