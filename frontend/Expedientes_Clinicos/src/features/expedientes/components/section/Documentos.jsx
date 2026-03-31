import { AlertCircle, Paperclip} from "lucide-react";
import { Card, CardContent } from "@components/ui/card";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Button } from "@components/ui/button"
import { TabsContent } from "@components/ui/tabs";

export function Documentos({ data }) {
    return (
      
      <CardContent className="pt-6">
        <TabsContent value="documentos" className="mt-0 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Documentos Adjuntos ({data.length})
            </h3>
          </div>

          {data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.map((doc) => (
                <Card key={doc.id} className="border-gray-200 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <Paperclip className="h-6 w-6 text-red-600"/>
                          </div>
                          <div className="flex-item">
                            <p className="font-semibold text-gray-900 mb-1">{doc.nombre}</p>
                            <p className="text-sm text-gray-600 mb-2">{doc.tipo} - {doc.tamaño}</p>
                            <p className="text-xs text-gray-500"> Subido: {doc.fecha} - Por: {doc.subidoPor} </p>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" className="text-blue-600">Ver</Button>
                            <Button size="sm" variant="outline" className="text-green-600">Descargar</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No hay documentos adjuntos para este paciente
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </CardContent>
  
    );
}