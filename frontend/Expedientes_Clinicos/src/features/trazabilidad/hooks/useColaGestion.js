import { useState, useMemo } from "react";
import { toast } from "sonner";

export function useColaGestion({pacientes, onSeleccionarPaciente, onNavigate, setPacienteEnAtencion, tipoAtencion, mensajeExito}) {
    const [dialogo, setDialogo] = useState(null);
    const [procesando, setProcesando] = useState(false);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

    const pacientesOrdenados = useMemo(() => {
        const prioridadOrden = { urgente: 0, alta: 1, media: 2, normal: 3 };
        return [...pacientes].sort((a, b) => prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad]);
    }, [pacientes]);

    const abrirDialogoInicio = (paciente) => {
        setPacienteSeleccionado(paciente);
        setDialogo("iniciar");
    };

    const confirmarInicio = () => {
        if (!pacienteSeleccionado) return;
        setProcesando(true);

        setTimeout(() => {
        setPacienteEnAtencion(pacienteSeleccionado);

        const [nombre, ...apellido] = pacienteSeleccionado.nombre.split(" ");

        onSeleccionarPaciente({
            nombre,
            apellido: apellido.join(" "),
            dni: pacienteSeleccionado.identidad,
            expedientes: {
            idExpediente: pacienteSeleccionado.id,
            numeroExpediente: pacienteSeleccionado.id,
            }
        });

        onNavigate(tipoAtencion);

        setProcesando(false);
        setDialogo(null);
        toast.success(`${mensajeExito || tipoAtencion} iniciada`);
        }, 800);
    };

    const confirmarFinalizacion = () => {
        setProcesando(true);

        setTimeout(() => {
        setPacienteEnAtencion(null);
        onSeleccionarPaciente(null);
        setProcesando(false);
        setDialogo(null);

        toast.success(`${mensajeExito || tipoAtencion} finalizada`);
        }, 1000);
    };

    return {
        dialogo, setDialogo,
        procesando,
        pacienteSeleccionado,
        pacientesOrdenados,
        abrirDialogoInicio,
        confirmarInicio,
        confirmarFinalizacion
    };
}