import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// const mockUsers = {
//   recepcionista: {
//     user: { id: "1", username: "recepcionista", name: "María González", role: "recepcionista" },
//   },
//   enfermero: {
//     user: { id: "2", username: "enfermero", name: "Carlos Ramírez", role: "enfermero" },
//   },
//   doctor: {
//     user: { id: "3", username: "doctor", name: "Dr. Juan Pérez", role: "doctor" },
//   },
//   admin: {
//     user: { id: "4", username: "admin", name: "Ana Martínez", role: "administrador" },
//   },
// };

export function AuthProvider({ children }) {
  // Intentamos cargar el usuario guardado o empezamos como null
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // SIMULACIÓN PARA DESARROLLO: 
  // Si no hay usuario, logueamos al admin por defecto para que no veR la pantalla en blanco
  // useEffect(() => {
  //   if (!user) {
  //     const defaultUser = mockUsers.recepcionista.user; 
  //     setUser(defaultUser);
  //     localStorage.setItem("user", JSON.stringify(defaultUser));
  //   }
  // }, [user]);

  const login = async (nombreUsuario, clave) => {
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // const data = mockUsers[username];
    // if (data) {
    //   setUser(data.user);
    //   localStorage.setItem("user", JSON.stringify(data.user));
    //   return true;
    // }
    // return false;
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreUsuario, clave }),
      });

      const result = await response.json();

      if (result.success) {
        // 'result.data' contiene el payload que armamos: { id, nombre, rol }
        const userData = result.data; 
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", result.token);

        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: "No se pudo conectar con el servidor" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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