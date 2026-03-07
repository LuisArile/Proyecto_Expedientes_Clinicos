import { useCallback, useEffect, useState } from "react";
import {
  crearExpediente,
  obtenerExpedientes,
  obtenerExpediente,
  actualizarExpediente,
  eliminarExpediente,
  validarIdentidadDuplicada,
} from "../services/expedienteService";

/**
 * Hook para gestionar expedientes
 * Proporciona funciones para crear, obtener, actualizar y eliminar expedientes
 */
export function useExpedientes() {
  const [expedientes, setExpedientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los expedientes
  const cargarExpedientes = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerExpedientes();
      setExpedientes(datos || []);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar expedientes:", err);
    } finally {
      setCargando(false);
    }
  }, []);

  // Crear nuevo expediente
  const crear = useCallback(
    async (pacienteData, expedienteData) => {
      try {
        setCargando(true);
        setError(null);
        const response = await crearExpediente(pacienteData, expedienteData);
        if (response.success) {
          await cargarExpedientes(); // Recargar la lista
        }
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setCargando(false);
      }
    },
    [cargarExpedientes]
  );

  // Obtener un expediente específico
  const obtener = useCallback(async (idExpediente) => {
    try {
      setCargando(true);
      setError(null);
      const dato = await obtenerExpediente(idExpediente);
      return dato;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  // Actualizar expediente
  const actualizar = useCallback(
    async (idExpediente, datos) => {
      try {
        setCargando(true);
        setError(null);
        const response = await actualizarExpediente(idExpediente, datos);
        if (response.success) {
          await cargarExpedientes(); // Recargar la lista
        }
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setCargando(false);
      }
    },
    [cargarExpedientes]
  );

  // Eliminar expediente
  const eliminar = useCallback(
    async (idExpediente) => {
      try {
        setCargando(true);
        setError(null);
        const response = await eliminarExpediente(idExpediente);
        if (response.success) {
          await cargarExpedientes(); // Recargar la lista
        }
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setCargando(false);
      }
    },
    [cargarExpedientes]
  );

  // Validar identidad duplicada
  const validarIdentidad = useCallback(async (numeroIdentidad) => {
    try {
      return await validarIdentidadDuplicada(numeroIdentidad);
    } catch (err) {
      console.error("Error validando identidad:", err);
      return false;
    }
  }, []);

  return {
    expedientes,
    cargando,
    error,
    cargarExpedientes,
    crear,
    obtener,
    actualizar,
    eliminar,
    validarIdentidad,
  };
}
