import React from "react";
import { Badge } from "@components/ui/badge";

export const getExamenesColumns = () => [    
    
    { header: "Nombre", accessorKey: "nombre" },
    { header: "Especialidad", accessorKey: "especialidad" },
    {
        header: "Estado",
        render: (row) => (
            <Badge
                className={
                    row.estado
                    ? "bg-green-100 text-green-700 border-none"
                    : "bg-red-100 text-red-700 border-none"
                }
            >
                {row.estado ? "Activo" : "Inactivo"}
            </Badge>
        ),
    },
    {
        header: "Fecha Creación",
        render: (row) =>
            new Date(row.fechaCreacion).toLocaleDateString(),
    },
];