import { Eye, Stethoscope, Activity } from "lucide-react";

export const pacienteActions = ({
    onVerExpediente,
    onConsultaMedica,
    checkPermission,
    handleSeleccionarPaciente,
    modo
}) => {

    if(modo === "consulta" || modo === "consulta-medica"){
        return[
            {
                key: "consulta",
                label: "Iniciar Consulta",
                icon: Stethoscope,
                onClick: (p) => onConsultaMedica(p),
                show: () => checkPermission("CONSULTA_MEDICA"),
                className: "text-purple-600 hover:bg-purple-50 border-purple-300",
                variant: "outline",
                size: "sm"
            },
        ]
    }

    if(modo === "preclinica"){
        return[
            {
                key: "preclinica",
                label: "Ir a Preclínica",
                icon: Activity,
                onClick: (p) => handleSeleccionarPaciente(p),
                show: () => checkPermission("PRECLINICA"),
                className: "text-green-600 hover:bg-green-50 border-green-300",
                variant: "outline",
                size: "sm"
            },
        ]
    }

    
    if (modo && modo !== "gestion" && modo !== "consulta" && modo !== "preclinica") {
        return [
            {
                key: "seleccionar",
                label: "Seleccionar Paciente",
                onClick: (p) => handleSeleccionarPaciente(p),
                className: "bg-blue-600 hover:bg-blue-700 text-white w-full",
                size: "sm"
            }
        ];
    }

    return [
        {
            key: "ver-expediente",
            label: "Ver expediente",
            icon: Eye,
            onClick: (p) => {
                console.log("Datos del paciente seleccionado:", p);
                onVerExpediente(p);
            },
            className: "text-blue-600 hover:bg-blue-50 border-blue-300",
            variant: "outline",
            size: "sm"
        }
    ];
};