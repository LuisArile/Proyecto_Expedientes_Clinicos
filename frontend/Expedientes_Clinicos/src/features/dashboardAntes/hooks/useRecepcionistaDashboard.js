import { useEffect, useState } from "react";
import {
  obtenerEstadisticasRecepcionista,
  obtenerNuevoRegistro,
} from "../services/dashboardServiceRecepcionista";

export function useRecepcionistaDashboard() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [registro, setNuevoRegistro] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const stats = await obtenerEstadisticasRecepcionista();
      const prxc = await obtenerNuevoRegistro();

      setEstadisticas(stats);
      setNuevoRegistro(prxc);
      setLoading(false);
    }

    cargarDatos();
  }, []);

  return { estadisticas, registro, loading };
}