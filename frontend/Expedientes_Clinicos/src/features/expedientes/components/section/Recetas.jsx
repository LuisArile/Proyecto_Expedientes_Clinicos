import { AlertCircle, Pill,} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Alert, AlertDescription } from "@components/ui/alert";
import { TabsContent } from "@components/ui/tabs";

export function Recetas({ data = [] }) {
  const listaConsultas = Array.isArray(data) ? data : [];

  const consultasConRecetas = listaConsultas.filter((consulta) => 
    consulta &&
    Array.isArray(consulta.recetas) && 
    consulta.recetas.length > 0
  ) || [];

  return ( 
    <CardContent className="pt-6">
      <TabsContent value="recetas" className="mt-0 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recetas Médicas
          </h3>
        </div>

        {consultasConRecetas.length > 0 ? (
          <div className="space-y-4">
            {consultasConRecetas.map((consulta) => (
              <Card key={consulta.id} className="border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-blue-900 text-base">
                        Consulta #{consulta.id}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {new Date(consulta.fechaConsulta).toLocaleDateString()} - 
                        Prescrita por: {consulta.medico?.nombre} {consulta.medico?.apellido}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {consulta.recetas.map((receta) => (
                      <div key={receta.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-3">
                            <Pill className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 mb-2">{receta.medicamento}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Dosis: </span>
                                  <span className="font-medium text-gray-900">{receta.dosis}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Indicaciones: </span>
                                  <span className="font-medium text-gray-900">{receta.indicaciones}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Duración: </span>
                                  <span className="font-medium text-gray-900">{receta.duracion}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No hay recetas médicas para este paciente
            </AlertDescription>
          </Alert>
        )}
      </TabsContent>
    </CardContent>
  )
}