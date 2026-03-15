import { useState, useEffect } from "react";
import dashboardService from "../services/estadisticaService";

export function useDashboardData(userRole) {
  const [data, setData] = useState({
    tarjetas: [],
    actividad: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!userRole) return;

    let isMounted = true;

    async function cargarDatos() {
      setData(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await dashboardService.obtenerResumen();
        console.log("Datos recibidos del API:", result);
        if (isMounted) {
          setData({
            tarjetas: result.tarjetas || [],
            actividad: result.actividad || [],
            loading: false,
            error: null
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error al cargar dashboard:", err);
          setData({
            tarjetas: [],
            actividad: [],
            loading: false,
            error: "No se pudieron cargar las estadísticas"
          });
        }
      }
    }

    cargarDatos();

    return () => { isMounted = false; };
  }, [userRole]);

  const refrescar = async () => {
    try {
      const result = await dashboardService.obtenerResumen();
      console.log("Datos recibidos del API:", result);
      setData({
        tarjetas: result.tarjetas || [],
        actividad: result.actividad || [],
        loading: false,
        error: null
      });
    } catch {
      setData(prev => ({ ...prev, error: "Error al refrescar" }));
    }
  };

  return { ...data, refrescar };
}