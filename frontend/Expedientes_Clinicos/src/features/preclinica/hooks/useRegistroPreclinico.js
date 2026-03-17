import { useState } from "react";
import { toast } from "sonner";
import { registrarPreclinico } from "../services/registroPreclinicoService";

export function useRegistroPreclinico() {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, result: {} });

  const enviarRegistro = async (expedienteId, data) => {
    if (!expedienteId) {
      toast.error("Debe seleccionar un expediente");
      return;
    }

    setLoading(true);
    try {
      const datos = {
        presionArterial: data.presionArterial || null,
        temperatura: data.temperatura ? parseFloat(data.temperatura) : null,
        peso: data.peso ? parseFloat(data.peso) : null,
        talla: data.talla ? parseInt(data.talla) : null,
        frecuenciaCardiaca: data.frecuenciaCardiaca ? parseInt(data.frecuenciaCardiaca) : null,
        observaciones: data.observaciones || null,
      };

      const response = await registrarPreclinico(expedienteId, datos);

      if (response.success) {
        setModal({
          open: true,
          result: {
            success: true,
            mensaje: "Signos vitales registrados correctamente.",
          },
        });
      } else {
        setModal({
          open: true,
          result: {
            success: false,
            mensaje: response.error || "Error al registrar signos vitales",
          },
        });
      }
    } catch (error) {
      setModal({
        open: true,
        result: {
          success: false,
          mensaje: error.message || "Error de conexión con el servidor",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, modal, setModal, enviarRegistro };
}
