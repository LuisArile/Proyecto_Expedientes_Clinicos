import { useEffect, useState } from "react";
import {
  obtenerEstadisticasEnfermero,
  obtenerProximaConsulta,
} from "../services/dashboardServiceEnfermero";

export function useEnfermeroDashboard() {
  const [estadisticasHoy, setEstadisticas] = useState(null);
  const [consulta, setProximaConsulta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const stats = await obtenerEstadisticasEnfermero();
      const prxc = await obtenerProximaConsulta();

      setEstadisticas(stats);
      setProximaConsulta(prxc);
      setLoading(false);
    }

    cargarDatos();
  }, []);

  return { estadisticasHoy, consulta, loading };
}