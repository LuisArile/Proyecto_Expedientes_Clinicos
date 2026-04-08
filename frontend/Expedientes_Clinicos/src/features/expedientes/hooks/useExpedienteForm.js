import { useState } from "react";
import { toast } from "sonner";
import { crearExpediente, actualizarExpediente } from "../services/expedienteService";
import { validarIdentidadDuplicada } from "../services/buscarPacienteService";

export function useExpedienteForm(modo = "crear", datosIniciales = null, setPaciente) {
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
    setLoading(true);
    
    try {
      const idExpediente = datosIniciales?.expedientes?.idExpediente;
      const idActual = esEdicion ? datosIniciales?.dni : null;
      const existe = await validarId(data.dni, idActual);
      
      if (existe) {
        toast.error("El número de identidad ya existe en el sistema");
        setLoading(false);
        return;
      }

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
        if (!idExpediente) {
          console.error("Estructura recibida en el error:", datosIniciales);
          throw new Error("No se encontró el ID del expediente para actualizar");
        }
        response = await actualizarExpediente(idExpediente, pacienteData);
      } else {
        // Crear nuevo expediente
        const expedienteData = { estado: "activo", observaciones: "" };
        response = await crearExpediente(pacienteData, expedienteData);
      }

      if (response.success) {
        if (esEdicion && setPaciente) {
          setPaciente(prev => {
            const base = prev?.paciente || prev;

            const pacienteActualizado = {
              ...base,
              nombre: data.nombre,
              apellido: data.apellido,
              dni: data.numeroIdentidad,
              sexo: generoSeleccionado,
              correo: data.correo,
              telefono: data.telefono,
              direccion: data.direccion,
              fechaNacimiento: data.fechaNacimiento
            };

            return prev?.paciente 
              ? { ...prev, paciente: pacienteActualizado } 
              : pacienteActualizado;
          });
        }

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
    } catch(error) {
      console.error("Error detallado:", error);
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