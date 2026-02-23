import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const mockUsers = {
  recepcionista: {
    user: { id: "1", username: "recepcionista", name: "María González", role: "recepcionista" },
  },
  enfermero: {
    user: { id: "2", username: "enfermero", name: "Carlos Ramírez", role: "enfermero" },
  },
  doctor: {
    user: { id: "3", username: "doctor", name: "Dr. Juan Pérez", role: "doctor" },
  },
  admin: {
    user: { id: "4", username: "admin", name: "Ana Martínez", role: "administrador" },
  },
};

export function AuthProvider({ children }) {
  // Intentamos cargar el usuario guardado o empezamos como null
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // SIMULACIÓN PARA DESARROLLO: 
  // Si no hay usuario, logueamos al admin por defecto para que no veas la pantalla en blanco
  useEffect(() => {
    if (!user) {
      const defaultUser = mockUsers.recepcionista.user; 
      setUser(defaultUser);
      localStorage.setItem("user", JSON.stringify(defaultUser));
    }
  }, [user]);

  const login = async (username) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = mockUsers[username];
    if (data) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}