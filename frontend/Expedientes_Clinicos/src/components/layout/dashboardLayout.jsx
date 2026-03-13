import { Sidebar } from "./sidebar";
import { useAuth } from "../../features/auth/AuthContext";

export function DashboardLayout({ children, currentView, onNavigate, user }) {
  const { user: authenticatedUser } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar currentView={currentView} onNavigate={onNavigate} />

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-gray-50">
        {children}
      </main>

    </div>
  );
}