import { useState, useEffect } from "react";
import { examenAPI } from "@/shared/services/api";

export function useExamenes() {

  const [examenes, setExamenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Cargar exámenes
  const cargarExamenes = async (filtros = {}) => {
    try {
      setLoading(true);

      const data = await examenAPI.buscar(filtros);
      setExamenes(data);

    } catch (error) {
      console.error("Error cargando exámenes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle estado
  const handleToggleEstado = async (id) => {
    try {
      await examenAPI.alternarEstado(id);

      await cargarExamenes(
        busqueda ? { busqueda } : {}
      );

    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  // Crear
  const handleCrear = async (data) => {
    try {
      await examenAPI.crear(data);
      await cargarExamenes();
    } catch (error) {
      console.error("Error creando examen:", error);
    }
  };

  // Actualizar
  const handleActualizar = async (id, data) => {
    try {
      await examenAPI.actualizar(id, data);

      await cargarExamenes(
        busqueda ? { busqueda } : {}
      );

    } catch (error) {
      console.error("Error actualizando examen:", error);
    }
  };

  // Carga inicial
  useEffect(() => {
    cargarExamenes();
  }, []);

  // Búsqueda con debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      cargarExamenes(
        busqueda ? { busqueda } : {}
      );
    }, 400);

    return () => clearTimeout(delay);
  }, [busqueda]);

  return {
    examenes,
    loading,
    busqueda,
    setBusqueda,
    handleToggleEstado,
    handleCrear,
    handleActualizar,
  };
}