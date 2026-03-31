import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Alert, AlertDescription } from "@components/ui/alert";
import { TabsContent } from "@components/ui/tabs";
import { Badge } from "@components/ui/badge";

export function Consultas({ data = [] }) {
  
  const formatearFecha = (fechaRaw) => {
    if (!fechaRaw) return "Fecha no disponible";
    const fecha = new Date(fechaRaw);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(fecha).replace(',', '');
  };

  return (
    <CardContent className="pt-6">
      <TabsContent value="consultas" className="mt-0 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Consultas Medicas ({data.length})
          </h3>
        </div>

        {data.length > 0 ? (
          <div className="space-y-4">
            {data.map((consulta) => {
              let diagnosticoObj = { descripcion: "Sin descripción", tipo: "PRESUNTIVO" };
              
              try {
                diagnosticoObj = typeof consulta.diagnostico === 'string' 
                  ? JSON.parse(consulta.diagnostico) 
                  : consulta.diagnostico;
              } catch (e) {
                console.error("Error parseando diagnóstico", e);
              }

              const esDefinitivo = diagnosticoObj.tipo === "DEFINITIVO";

              return (
                <Card key={consulta.id} className="border-purple-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-purple-900 text-base">CONS-{consulta.id}</CardTitle>
                        <CardDescription className="mt-1">
                          {formatearFecha(consulta.fechaConsulta)} 
                          <span className="block text-xs text-gray-500">
                            Dr: {consulta.medico?.nombre} {consulta.medico?.apellido}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          consulta.tipoDiagnostico === "definitivo"
                            ? "bg-green-50 text-green-700 border-green-300"
                            : "bg-yellow-50 text-yellow-700 border-yellow-300"
                        }
                      >
                        {esDefinitivo ? "Definitivo" : "Presuntivo"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Diagnóstico:</p>
                      <p className="text-sm text-gray-900">{diagnosticoObj.descripcion}</p>
                    </div>
                    {consulta.observaciones && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">Observaciones Clínicas:</p>
                        <p className="text-sm text-gray-900">{consulta.observaciones}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No hay consultas médicas registradas para este paciente
            </AlertDescription>
          </Alert>
        )}
      </TabsContent>
    </CardContent>
  )
}