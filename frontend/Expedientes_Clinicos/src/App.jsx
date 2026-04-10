import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Dashboard } from "@/pages/Dashboard";
import { Login } from "@/pages/Login";

function PrivateRoute({ children}) {
  const { user } = useAuth();

  if (!user) { return <Navigate to="/login" replace /> }
  if (!user.rol) return <Navigate to="/login" replace />;

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/sistema/*"
        element={
          <PrivateRoute>  
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;