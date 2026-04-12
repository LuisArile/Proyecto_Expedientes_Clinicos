import { useMemo } from "react";
import { Clock, Play } from "lucide-react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { getPrioridadConfig } from "@/features/trazabilidad/utils/prioridad";

export function usePreclinicaColumns({ iniciar }) {

    return useMemo(() => [  
        {
            header: "Hora",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {row.horaRegistro}
                </div>
            ),
        },
        {
            header: "Paciente",
            render: (row) => (
                <div>
                    <p className="font-medium text-gray-900">{row.nombre}</p>
                    <p className="text-xs text-gray-500">{row.identidad}</p>
                </div>
            ),
        },
        {
            header: "Prioridad",
            render: (row) => {
                const config = getPrioridadConfig(row.prioridad);
                return (
                    <Badge variant="outline" className={config.color}>
                    {config.label}
                    </Badge>
                );
            },
        },
        {
            header: "Tipo Ingreso",
            accessorKey: "tipoIngreso",
            cellClassName: "text-sm text-gray-600",
        },
        {
            header: "Motivo",
            render: (row) => (
                <div className="text-sm text-gray-600 max-w-xs truncate">
                    {row.motivoConsulta}
                </div>
            ),
        },
        {
            header: "Acción",
            cellClassName: "text-center",
            render: (row) => (
                <Button
                    size="sm"
                    disabled={false}
                    onClick={() => iniciar(row)}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <Play className="h-3 w-3 mr-1" />
                    Iniciar
                </Button>
            ),
        },
    ], [iniciar]);
};
