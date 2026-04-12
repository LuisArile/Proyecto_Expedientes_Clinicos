import { useState, useEffect } from "react";
import { examenAPI } from "@/shared/services/api";

export function useExamenes() {
  const [examenes, setExamenes] = useState([]);
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

  // Cargar exámenes
  const cargarExamenes = async (filtros = {}) => {
    try {
      setLoading(true);
      const data = await examenAPI.buscar(filtros);
      setExamenes(data);
    } catch (error) {
      setModal({
        open: true,
        result: {
          success: false,
          mensaje: "No se pudieron cargar los exámenes.",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Detectar si el error es por duplicado
  const esErrorDuplicado = (mensaje = "") =>
    mensaje.toLowerCase().includes("ya existe");

  // Crear examen
  const handleCrear = async (data) => {
    try {
      const nuevo = await examenAPI.crear(data);
      await cargarExamenes();

      setModal({
        open: true,
        result: {
          success: true,
          mensaje: "El examen se ha creado correctamente.",
        },
      });

      return nuevo;
    } catch (error) {
      const mensaje = error?.message || "No se pudo crear el examen.";

      setModal({
        open: true,
        result: {
          success: false,
          mensaje: esErrorDuplicado(mensaje)
            ? mensaje
            : "Ocurrió un error al guardar el examen.",
        },
      });

      return null;
    }
  };

  // Actualizar examen
  const handleActualizar = async (id, data) => {
    try {
      const actualizado = await examenAPI.actualizar(id, data);
      await cargarExamenes(busqueda ? { busqueda } : {});

      setModal({
        open: true,
        result: {
          success: true,
          mensaje: "El examen se ha actualizado correctamente.",
        },
      });

      return actualizado;
    } catch (error) {
      const mensaje = error?.message || "No se pudo actualizar el examen.";

      setModal({
        open: true,
        result: {
          success: false,
          mensaje: esErrorDuplicado(mensaje)
            ? mensaje
            : "Ocurrió un error al actualizar el examen.",
        },
      });

      return null;
    }
  };

  // Alternar estado del examen
  const handleToggleEstado = async (id) => {
    try {
      setLoading(true);
      await examenAPI.alternarEstado(id);

      // Recargar la lista manteniendo el filtro de búsqueda
      await cargarExamenes(busqueda ? { busqueda } : {});
    } catch (error) {
      setModal({
        open: true,
        result: {
          success: false,
          mensaje: error?.message || "No se pudo cambiar el estado del examen.",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarExamenes();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      cargarExamenes(busqueda ? { busqueda } : {});
    }, 400);

    return () => clearTimeout(delay);
  }, [busqueda]);

  return {
    examenes,
    loading,
    busqueda,
    setBusqueda,
    handleCrear,
    handleToggleEstado,
    handleActualizar,
    modal,
    setModal,
  };
}