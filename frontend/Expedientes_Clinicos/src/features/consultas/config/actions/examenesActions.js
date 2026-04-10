import { Edit, Power } from "lucide-react";

export const examenesActions = ({
    onEdit,
    onToggleEstado,
    accionandoId
}) => {
    return [
        {
            key: "editar",
            label: "Editar",
            icon: Edit,
            onClick: (row) => onEdit(row),
            className: "text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-400",
            variant: "outline",
            size: "sm"
        },
        {
            key: "estado",
            label: (row) => (accionandoId === row.id ? "Procesando..." : row.estado ? "Desactivar" : "Activar"),
            icon: Power,
            onClick: (row) => onToggleEstado(row),
            disabled: (row) => accionandoId === row.id,
            className: (row) => 
                row.estado
                ? "text-red-600 border-red-200 hover:bg-red-50 hover:border-red-400"
                : "text-green-600 border-green-200 hover:bg-green-50 hover:border-green-400",
            variant: "outline",
            size: "sm"
        }
    ];
};