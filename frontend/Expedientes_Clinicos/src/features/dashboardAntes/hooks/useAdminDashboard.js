import { useEffect, useState } from "react";
import {
  obtenerEstadisticasAdmin,
  obtenerActividadReciente,
} from "../services/dashboardServiceAdmin";

export function useAdminDashboard() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [actividad, setActividad] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const stats = await obtenerEstadisticasAdmin();
      const act = await obtenerActividadReciente();

      setEstadisticas(stats);
      setActividad(act);
      setLoading(false);
    }

    cargarDatos();
  }, []);

  return { estadisticas, actividad, loading };
}