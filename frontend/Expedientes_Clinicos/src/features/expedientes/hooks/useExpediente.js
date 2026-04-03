import { useEffect, useState } from "react";
import { obtenerExpedienteCompleto } from "../../expedientes/services/expedienteService";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useExpediente(idExpediente) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { checkPermission } = useAuth();

  useEffect(() => {
    if (!idExpediente) return;

    async function fetchData() {
      try {
        setLoading(true);

        const permisos = {
          verPreclinica: checkPermission("VER_PRECLINICAS") || checkPermission("VER_HISTORIAL_CLINICO"),
          verConsultas: checkPermission("VER_CONSULTAS") || checkPermission("VER_HISTORIAL_CLINICO")
        };

        const res = await obtenerExpedienteCompleto(idExpediente, permisos);
        setData(res);
      } catch (error) {
        console.error("Error en useExpediente:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [idExpediente, checkPermission]);

  return { data, loading };
}