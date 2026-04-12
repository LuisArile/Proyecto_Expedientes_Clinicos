import { useState, useEffect } from "react";
import { medicamentoAPI } from "@/shared/services/api";

export function useMedicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [modal, setModal] = useState({
    open: false,
    result: {
      success: false,
      mensaje: "",
      numeroExpediente: null,
    },
  });

  // Cargar medicamentos
  const cargarMedicamentos = async (filtros = {}) => {
    try {
      setLoading(true);
      const data = await medicamentoAPI.buscar(filtros);
      setMedicamentos(data);
    } catch (error) {
      setModal({
        open: true,
        result: {
          success: false,
          mensaje: "No se pudieron cargar los medicamentos.",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Detectar si el error es por duplicado
  const esErrorDuplicado = (mensaje = "") =>
    mensaje.toLowerCase().includes("ya existe");

  // Crear medicamento
  const handleCrear = async (data) => {
    try {
      const nuevo = await medicamentoAPI.crear(data);
      await cargarMedicamentos();

      setModal({
        open: true,
        result: {
          success: true,
          mensaje: "El medicamento se ha creado correctamente.",
        },
      });

      return nuevo;
    } catch (error) {
      const mensaje =
        error?.message || "No se pudo crear el medicamento.";

      setModal({
        open: true,
        result: {
          success: false,
          mensaje: esErrorDuplicado(mensaje)
            ? mensaje
            : "Ocurrió un error al guardar el medicamento.",
        },
      });

      return null;
    }
  };

  // Actualizar medicamento
  const handleActualizar = async (id, data) => {
    try {
      const actualizado = await medicamentoAPI.actualizar(id, data);
      await cargarMedicamentos(busqueda ? { busqueda } : {});

      setModal({
        open: true,
        result: {
          success: true,
          mensaje: "El medicamento se ha actualizado correctamente.",
        },
      });

      return actualizado;
    } catch (error) {
      const mensaje =
        error?.message || "No se pudo actualizar el medicamento.";

      setModal({
        open: true,
        result: {
          success: false,
          mensaje: esErrorDuplicado(mensaje)
            ? mensaje
            : "Ocurrió un error al actualizar el medicamento.",
        },
      });

      return null;
    }
  };

  // Alternar estado del medicamento
  const handleToggleEstado = async (id) => {
    try {
      setLoading(true);
      await medicamentoAPI.alternarEstado(id);

      // Recargar la lista manteniendo el filtro de búsqueda
      await cargarMedicamentos(busqueda ? { busqueda } : {});
    } catch (error) {
      setModal({
        open: true,
        result: {
          success: false,
          mensaje:
            error?.message ||
            "No se pudo cambiar el estado del medicamento.",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    cargarMedicamentos();
  }, []);

  // Búsqueda con debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      cargarMedicamentos(busqueda ? { busqueda } : {});
    }, 400);

    return () => clearTimeout(delay);
  }, [busqueda]);

  return {
    medicamentos,
    loading,
    busqueda,
    setBusqueda,
    handleCrear,
    handleActualizar,
    handleToggleEstado,
    modal,
    setModal,
  };
}