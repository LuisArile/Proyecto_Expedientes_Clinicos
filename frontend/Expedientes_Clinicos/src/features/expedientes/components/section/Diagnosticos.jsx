import { AlertCircle } from "lucide-react";
import { CardContent } from "@components/ui/card";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Badge } from "@components/ui/badge";
import { TabsContent } from "@components/ui/tabs";
import { formatearFechaHora } from "@/utils/dateFormatter";

export function Diagnosticos({ data = [] }) {

  return (
    <CardContent className="pt-6">
      <TabsContent value="diagnosticos" className="mt-0 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Historial de Diagnósticos
          </h3>
        </div>

        {data.length > 0 ? (
          <div className="space-y-3">
            {data.map((consulta) => {

              let diagInfo = { descripcion: "Sin descripción", tipo: "PRESUNTIVO" };
              try {
                diagInfo = typeof consulta.diagnostico === "string" 
                  ? JSON.parse(consulta.diagnostico) 
                  : consulta.diagnostico;
              } catch (e) {
                console.error("Error al leer diagnóstico", e);
              }

              const esDefinitivo = diagInfo.tipo === "DEFINITIVO";

              return (
                <div key={consulta.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{diagInfo.descripcion}</p>
                      <p className="text-sm text-gray-600 mt-1">{formatearFechaHora(consulta.fechaConsulta)}</p>
                    </div>
                    <Badge variant="outline" 
                      className={
                        consulta.tipoDiagnostico === "definitivo"
                        ? "bg-green-50 text-green-700 border-green-300"
                        : "bg-yellow-50 text-yellow-700 border-yellow-300"
                      }
                    >
                      {esDefinitivo ? "Definitivo" : "Presuntivo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">Dr. {consulta.medico?.nombre} {consulta.medico?.apellido}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No hay diagnósticos registrados para este paciente
            </AlertDescription>
          </Alert>
        )} 
      </TabsContent>
    </CardContent>  
  );
}