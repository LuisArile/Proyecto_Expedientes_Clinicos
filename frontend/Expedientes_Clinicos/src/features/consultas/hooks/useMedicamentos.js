import { useState, useEffect } from "react";
import { medicamentoAPI } from "@/shared/services/api";

export function useMedicamentos() {

  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const cargarMedicamentos = async (filtros = {}) => {
    try {
      setLoading(true);

      const data = await medicamentoAPI.buscar(filtros);
      setMedicamentos(data);

    } catch (error) {
      console.error("Error cargando medicamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEstado = async (id) => {
    try {
      await medicamentoAPI.alternarEstado(id);

      await cargarMedicamentos(
        busqueda ? { busqueda } : {}
      );

    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  const handleCrear = async (data) => {
    try {
      await medicamentoAPI.crear(data);
      await cargarMedicamentos();
    } catch (error) {
      console.error("Error creando medicamento:", error);
    }
  };

  const handleActualizar = async (id, data) => {
    try {
      await medicamentoAPI.actualizar(id, data);

      await cargarMedicamentos(
        busqueda ? { busqueda } : {}
      );

    } catch (error) {
      console.error("Error actualizando medicamento:", error);
    }
  };

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      cargarMedicamentos(
        busqueda ? { busqueda } : {}
      );
    }, 400);

    return () => clearTimeout(delay);
  }, [busqueda]);

  return {
    medicamentos,
    loading,
    busqueda,
    setBusqueda,
    handleToggleEstado,
    handleCrear,
    handleActualizar,
  };
}
