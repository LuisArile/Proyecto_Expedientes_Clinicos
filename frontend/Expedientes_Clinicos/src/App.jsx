import { AuthProvider } from "./features/auth/AuthContext";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

export default App;