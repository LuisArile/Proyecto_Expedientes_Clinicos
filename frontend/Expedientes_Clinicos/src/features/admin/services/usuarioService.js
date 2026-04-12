// src/features/usuarios/services/usuarioService.js
import { usuarioAPI } from "@/shared/services/api";

/**
 * Extrae de forma segura el campo `data` de la respuesta del backend.
 */
const extractData = (response) => response?.data ?? null;

/**
 * Extrae un arreglo de forma segura.
 */
const extractArray = (response) => {
  const data = extractData(response);
  return Array.isArray(data) ? data : [];
};

export const usuarioService = {
  /**
   * Obtener todos los usuarios
   */
  getAll: async () => {
    try {
      const res = await usuarioAPI.obtenerTodos();
      return extractArray(res);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return [];
    }
  },

  /**
   * Obtener usuario por ID
   */
  getById: async (id) => {
    try {
      const res = await usuarioAPI.obtenerPorId(id);
      return extractData(res);
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear usuario
   */
  create: async (data) => {
    try {
      const res = await usuarioAPI.crear(data);
      return extractData(res);
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      throw error;
    }
  },

  /**
   * Actualizar usuario
   */
  update: async (id, data) => {
    try {
      const res = await usuarioAPI.actualizar(id, data);
      return extractData(res);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  },

  /**
   * Alternar estado del usuario
   */
  toggleStatus: async (id) => {
    try {
      const res = await usuarioAPI.alternarEstado(id);
      return extractData(res);
    } catch (error) {
      console.error("Error al cambiar el estado del usuario:", error);
      throw error;
    }
  },

  /**
   * Enviar credenciales al usuario
   */
  sendCredentials: async (id) => {
    try {
      const res = await usuarioAPI.enviarCredenciales(id);
      return extractData(res);
    } catch (error) {
      console.error("Error al enviar credenciales:", error);
      throw error;
    }
  },

  /**
   * Eliminar usuario
   */
  remove: async (id) => {
    try {
      const res = await usuarioAPI.eliminar(id);
      return res?.success ?? true;
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw error;
    }
  },
};