import { useState } from "react";
import { toast } from "sonner";
import { crearExpediente, validarIdentidadDuplicada } from "../services/expedienteService";

export function useExpedienteForm(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [idDuplicado, setIdDuplicado] = useState(false);
  const [modal, setModal] = useState({ open: false, result: {} });

  const validarId = async (id) => {
    if (!id) {
      setIdDuplicado(false);
      return false;
    }
    try {
      const existe = await validarIdentidadDuplicada(id);
      setIdDuplicado(existe);
      return existe;
    } catch (error) {
      setIdDuplicado(false);
      return false;
    }
  };

  const enviarFormulario = async (data, generoSeleccionado) => {
    const existe = await validarId(data.numeroIdentidad);
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

      const expedienteData = { estado: "activo", observaciones: "" };
      const response = await crearExpediente(pacienteData, expedienteData);

      if (response.success) {
        setModal({
          open: true,
          result: {
            success: true,
            mensaje: `Expediente creado correctamente.`,
            numeroExpediente: response.data?.expediente?.numeroExpediente || "N/A"
          }
        });
      } else {
        setModal({
          open: true,
          result: { success: false, mensaje: response.error || "Error al crear expediente" }
        });
      }
    } catch (error) {
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