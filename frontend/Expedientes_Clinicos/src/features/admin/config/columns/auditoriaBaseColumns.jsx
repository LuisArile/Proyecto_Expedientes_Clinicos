import { Badge } from "@components/ui/badge";
import { User } from "lucide-react";
import { ROLE_STRATEGIES } from "@/constants/roles";

export const getAuditoriaBaseColumns = () => [
    {
        id: "fecha",
        header: "FECHA/HORA",
        render: (log) => (
            <div className="flex flex-col">
            <span className="font-medium text-slate-900">{log.fecha}</span>
            <span className="text-xs text-slate-500">{log.hora}</span>
            </div>
        )
    },
    {
        id: "usuario",
        header: "USUARIO",
        render: (log) => (
            <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <User className="h-4 w-4" />
            </div>
            <span className="font-medium text-slate-700">{log.usuario}</span>
            </div>
        )
    },
    {
        id: "rol",
        header: "ROL",
        render: (log) => {
            const roleStyle = ROLE_STRATEGIES[log.rol?.toUpperCase()] || { label: log.rol, color: "bg-gray-100" };
            return (
            <Badge variant="outline" className={`${roleStyle.color} font-semibold text-[10px] px-2 py-0`}>
                {roleStyle.label}
            </Badge>
            );
        }
    },
    {
        id: "modulo",
        header: "MÓDULO",
        render: (log) => (
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-600">
            {log.modulo}
            </span>
        )
    },
    {
        id: "accion",
        header: "ACCIÓN REALIZADA",
        accessorKey: "accion",
        cellClassName: "max-w-xs truncate text-slate-600 italic"
    },

];