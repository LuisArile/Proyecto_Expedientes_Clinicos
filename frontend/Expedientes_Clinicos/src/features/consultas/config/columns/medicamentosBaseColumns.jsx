import React from "react";
import { Badge } from "@components/ui/badge";

export const getMedicamentosColumns = () => [
  {
    header: "Nombre",
    accessorKey: "nombre",
  },
  {
    header: "Categoría",
    render: (row) =>
      typeof row.categoria === "object"
        ? row.categoria?.nombre || "Sin categoría"
        : row.categoria || "Sin categoría",
  },
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
      row.fechaCreacion
        ? new Date(row.fechaCreacion).toLocaleDateString()
        : "Sin fecha",
  },
];