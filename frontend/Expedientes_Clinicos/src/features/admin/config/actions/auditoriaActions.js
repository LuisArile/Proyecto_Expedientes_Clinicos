import { FileText } from "lucide-react";

export const auditoriaActions = ({ onVerDetalles }) => {
    return [
        {
            key: "ver-detalles",
            header: "DETALLES",
            icon: FileText,
            title: "Ver detalles",
            onClick: onVerDetalles,
            className: "text-cent text-blue-600 hover:text-blue-800",
        }
    ];
};