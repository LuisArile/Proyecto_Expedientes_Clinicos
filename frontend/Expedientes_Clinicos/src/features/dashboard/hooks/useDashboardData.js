import { useState, useEffect } from "react";
import { Users, Activity, UserCheck, AlertCircle } from 'lucide-react';
import estadisticasAPI from '@/services/api';

export function useDashboardData() {
  const [data, setData] = useState({
    tarjetas: [],
    actividad: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    async function cargarDatos() {
      try {
        const result = await estadisticasAPI.obtenerResumen();
        
        setData({
          tarjetas: result.tarjetas || [],
          actividad: result.actividad || [],
          loading: false,
          error: null
        });
      } catch (err) {
        setData(prev => ({ 
          ...prev, 
          tarjetas: [],
          actividad: [],
          loading: false, 
          error: "No se pudieron cargar las estadísticas" 
        }));
      }
    }

    cargarDatos();
  }, []);

  return data;
}