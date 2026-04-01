import { useState } from "react";
import { toast } from "sonner";
import { crearExpediente, actualizarExpediente } from "../services/expedienteService";
import { validarIdentidadDuplicada } from "../services/buscarPacienteService";

export function useExpedienteForm(modo = "crear", datosIniciales = null) {
  const [loading, setLoading] = useState(false);
  const [idDuplicado, setIdDuplicado] = useState(false);
  const [modal, setModal] = useState({ open: false, result: {} });
  
  const esEdicion = modo === "editar";

  const validarId = async (id, idActual) => {
    if (!id) {
      setIdDuplicado(false);
      return false;
    }
    
    // Si es edición y el ID no cambió, no validar duplicado
    if (esEdicion && id === idActual) {
      setIdDuplicado(false);
      return false;
    }
    
    try {
      const existe = await validarIdentidadDuplicada(id);
      setIdDuplicado(existe);
      return existe;
    } catch {
      setIdDuplicado(false);
      return false;
    }
  };

  const enviarFormulario = async (data, generoSeleccionado) => {
    const idActual = esEdicion ? datosIniciales?.paciente?.dni : null;
    const existe = await validarId(data.numeroIdentidad, idActual);
    
    if (existe) {
      toast.error("El número de identidad ya existe en el sistema");
      return;
    }

    setLoading(true);
    try {
      const pacienteData = {
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.numeroIdentidad,
        correo: data.correo || null,
        fechaNacimiento: data.fechaNacimiento,
        sexo: generoSeleccionado,
        direccion: data.direccion,
        telefono: data.telefono,
      };

      let response;
      
      if (esEdicion) {
        // Actualizar expediente existente
        const idExpediente = datosIniciales?.idExpediente;
        if (!idExpediente) {
          throw new Error("No se encontró el ID del expediente para actualizar");
        }
        response = await actualizarExpediente(idExpediente, pacienteData);
      } else {
        // Crear nuevo expediente
        const expedienteData = { estado: "activo", observaciones: "" };
        response = await crearExpediente(pacienteData, expedienteData);
      }

      if (response.success) {
        setModal({
          open: true,
          result: {
            success: true,
            mensaje: esEdicion ? "Expediente actualizado correctamente." : "Expediente creado correctamente.",
            numeroExpediente: response.data?.expediente?.numeroExpediente || datosIniciales?.idExpediente || "N/A"
          }
        });
      } else {
        setModal({
          open: true,
          result: { success: false, mensaje: response.error || `Error al ${esEdicion ? "actualizar" : "crear"} expediente` }
        });
      }
    } catch {
      setModal({
        open: true,
        result: { success: false, mensaje: "Error de conexión con el servidor" }
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, idDuplicado, modal, setModal, validarId, enviarFormulario };
}