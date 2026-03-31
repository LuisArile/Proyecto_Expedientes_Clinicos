import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { validarLogin } from "@components/validaciones/validarLogin";

export function useLoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ nombreUsuario: "", clave: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showClave, setShowClave] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const errorValidacion = validarLogin(formData.nombreUsuario, formData.clave);

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(formData.nombreUsuario.trim(), formData.clave.trim());
      if (result && result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Credenciales incorrectas");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData, error, loading, showClave,
    setShowClave, handleChange, handleSubmit
  };
}