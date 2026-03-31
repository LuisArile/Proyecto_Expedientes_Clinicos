import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { FileText, Edit } from "lucide-react";
import { PageHeader } from "@components/layout/PageHeader";

export function ExpedienteHeader({ paciente, onVolver, onEditar, puedeEditar }) {
  const estaActivo = paciente.estado === true;
  const codigoExpediente = paciente.expedientes?.idExpediente || [];

  return (
    <PageHeader
      title="Expediente Clínico"
      subtitle={codigoExpediente}
      Icon={FileText}
      onVolver={onVolver}
      rightContent={
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={
              estaActivo
                ? "bg-green-50 text-green-700 border-green-300"
                : "bg-red-50 text-red-700 border-red-300"
            }
          >
            <div className={`w-2 h-2 rounded-full mr-1.5 ${estaActivo ? 'bg-green-500' : 'bg-red-500'}`} />
            {estaActivo ? "Activo" : "Inactivo"}
          </Badge>

          {puedeEditar && onEditar && ( // Boton para editar expediente
            <Button
              size="sm"
              onClick={onEditar}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Datos
            </Button>
          )}
        </div>
      }
    />
  );
}