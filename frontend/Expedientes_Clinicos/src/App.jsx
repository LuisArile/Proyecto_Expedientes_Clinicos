import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./features/auth/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Changepassword } from "./pages/Changepassword";



// Roles permitidos para acceder al dashboard
const allowedRoles = ["RECEPCIONISTA", "ENFERMERA", "DOCTOR", "ADMINISTRADOR"];

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    // No autenticado → login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol?.toUpperCase())) {
    // Rol no permitido → login o página de acceso denegado
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={allowedRoles}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/changepassword"
            element={
              <PrivateRoute allowedRoles={allowedRoles}>
                <Changepassword />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;