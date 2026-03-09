import { useEffect, useState } from "react";
import {
  obtenerEstadisticasDoctor,
  obtenerProximaConsulta,
} from "../services/dashboardServiceDoctor";

export function useDoctorDashboard() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [consulta, setProximaConsulta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const stats = await obtenerEstadisticasDoctor();
      const prxc = await obtenerProximaConsulta();

      setEstadisticas(stats);
      setProximaConsulta(prxc);
      setLoading(false);
    }

    cargarDatos();
  }, []);

  return { estadisticas, consulta, loading };
}