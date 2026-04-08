import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind.css'
import App from './App.jsx'
import { AuthProvider } from "./features/auth/components/AuthProvider.jsx";
import { registerDashboardViews } from "../src/features/dashboard/view/registry.js";
import { BrowserRouter } from 'react-router-dom';
import { viewRegistry } from './shared/services/ViewRegistry.js';

registerDashboardViews();
console.log("Views registradas:", viewRegistry.getAllViews());

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>  
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);