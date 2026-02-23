import { AuthProvider } from "./features/auth/authContext";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

export default App;