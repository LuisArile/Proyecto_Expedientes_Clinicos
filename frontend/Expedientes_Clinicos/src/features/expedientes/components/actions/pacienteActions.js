import { Eye, Stethoscope } from "lucide-react";

export const pacienteActions = ({
    onVerExpediente,
    onConsultaMedica,
    checkPermission,
    handleSeleccionarPaciente,
    modo
}) => {

    return [
        {
            key: "ver-expediente",
            label: "Ver expediente",
            icon: Eye,
            onClick: (p) => onVerExpediente(p),
            className: "text-blue-600 hover:bg-blue-50 border-blue-300",
            variant: "outline",
            size: "sm"
        },
        {
            key: "consulta",
            label: "Consulta",
            icon: Stethoscope,
            onClick: (p) => onConsultaMedica(p),
            show: () => checkPermission("CONSULTA_MEDICA"),
            className: "text-purple-600 hover:bg-purple-50 border-purple-300",
            variant: "outline",
            size: "sm"
        },
        {
            key: "seleccionar",
            label: "Seleccionar",
            onClick: (p) => handleSeleccionarPaciente(p),
            show: () => modo,
            className: "bg-blue-600 hover:bg-blue-700 text-white",
            size: "sm"
        }
    ];
};