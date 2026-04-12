// src/features/admin/hooks/useUsuarioForm.js
import { useEffect, useState } from "react";
import { usuarioService } from "../services/usuarioService";
import { rolAPI } from "@/shared/services/api";

export const useUsuarioForm = (id) => {
  const isEdit = Boolean(id);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [datosIniciales, setDatosIniciales] = useState(null);
  const [modal, setModal] = useState({
    open: false,
    result: { success: false, message: "" },
  });

  /**
   * Convierte una cadena de especialidades en un arreglo.
   */
  const parseEspecialidades = (especialidades) => {
    if (!especialidades) return [];
    if (Array.isArray(especialidades)) return especialidades;

    return especialidades
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
  };

  /**
   * Cargar roles del sistema
   */
  const cargarRoles = async () => {
    try {
      const res = await rolAPI.obtenerTodos();
      setRoles(res.data || []);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  /**
   * Cargar datos del usuario en modo edición
   */
  const cargarUsuario = async () => {
    if (!isEdit) return;

    try {
      setLoading(true);
      const usuario = await usuarioService.getById(id);

      setDatosIniciales({
        ...usuario,
        idRol: usuario.idRol,
        especialidades: usuario.especialidades || [],
      });
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      setModal({
        open: true,
        result: {
          success: false,
          message: "No se pudo cargar la información del usuario.",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRoles();
    cargarUsuario();
  }, [id]);

  /**
   * Enviar formulario (crear o actualizar)
   */
  const enviarFormulario = async (data) => {
    setLoading(true);

    try {
      const payload = {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        nombreUsuario: data.nombreUsuario,
        idRol: Number(data.idRol),
        activo: data.activo ?? true,
        especialidades: parseEspecialidades(data.especialidades),
      };

      if (isEdit) {
        await usuarioService.update(id, payload);
      } else {
        // Contraseña temporal por defecto (el backend puede reemplazarla)
        payload.clave = data.clave || "Temp1234";
        await usuarioService.create(payload);
      }

      setModal({
        open: true,
        result: {
          success: true,
          message: isEdit
            ? "Usuario actualizado correctamente"
            : "Usuario creado correctamente",
        },
      });
    } catch (error) {
      setModal({
        open: true,
        result: {
          success: false,
          message:
            error.message ||
            "Ocurrió un error al procesar la solicitud.",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    roles,
    loading,
    modal,
    setModal,
    enviarFormulario,
    datosIniciales,
  };
};