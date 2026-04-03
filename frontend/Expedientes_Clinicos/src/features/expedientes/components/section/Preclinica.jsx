import { Activity, Heart, Thermometer, AlertCircle, Scale, Ruler, } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Alert, AlertDescription } from "@components/ui/alert";
import { TabsContent } from "@components/ui/tabs";
import { formatearFechaHora } from "@/utils/dateFormatter";

export function Preclinica({ data }) {

  return (
    <CardContent className="pt-6">
      <TabsContent value="preclinica" className="mt-0 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Registros Preclínicos ({data.length})
          </h3>
        </div>
        <div className="space-y-4">
          
          {data.length > 0 ? (
            <div className="space-y-4">
              {data.map((registro) => (
                <Card key={registro.id} className="border-green-200">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-green-900 text-base">PRECL-{registro.id}</CardTitle>
                        <CardDescription className="mt-1">
                          {formatearFechaHora(registro.fechaRegistro)} - Por: {registro.enfermero?.nombre} {registro.enfermero?.apellido}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Heart className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="text-xs text-gray-600">Presión</p>
                            <p className="font-semibold text-gray-900">{registro.presionArterial}</p>
                            <p className="text-xs text-gray-500">mmHg</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Thermometer className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="text-xs text-gray-600">Temperatura</p>
                          <p className="font-semibold text-gray-900">{registro.temperatura}°C</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Scale className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-600">Peso</p>
                          <p className="font-semibold text-gray-900">{registro.peso} kg</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Heart className="h-5 w-5 text-pink-500" />
                        <div>
                          <p className="text-xs text-gray-600">FC</p>
                          <p className="font-semibold text-gray-900">{registro.frecuenciaCardiaca}</p>
                          <p className="text-xs text-gray-500">lpm</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Ruler className="h-5 w-5 text-cyan-500" />
                        <div>
                          <p className="text-xs text-gray-600">Talla</p>
                          <p className="font-semibold text-gray-900">{registro.talla}</p>
                          <p className="text-xs text-gray-500">(cm)</p>
                        </div>
                      </div>
                    </div>
                    {registro.observaciones && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">Observaciones:</p>
                        <p className="text-sm text-gray-900">{registro.observaciones}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No hay registros preclínicos para este paciente
              </AlertDescription>
            </Alert>
          )}  
        </div>
      </TabsContent>
    </CardContent>
  );
}