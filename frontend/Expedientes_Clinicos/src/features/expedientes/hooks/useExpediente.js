import { useEffect, useState } from "react";
import { obtenerExpedienteCompleto } from "../../expedientes/services/expedienteService";

export function useExpediente(idExpediente) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idExpediente) return;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await obtenerExpedienteCompleto(idExpediente);
        setData(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [idExpediente]);

  return { data, loading };
}