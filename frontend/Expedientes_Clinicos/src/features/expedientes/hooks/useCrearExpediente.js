import { useState } from "react";
import { guardarExpediente } from "../services/expedienteService";

export function useCrearExpediente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const enviarFormulario = async (datos) => {
    setLoading(true);
    try {
      const resultado = await guardarExpediente(datos);
      return resultado;
    } catch (err) {
      setError("Error al crear el expediente");
    } finally {
      setLoading(false);
    }
  };

  return { enviarFormulario, loading, error };
}