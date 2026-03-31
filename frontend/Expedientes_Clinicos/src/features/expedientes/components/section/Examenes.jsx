import { TestTube} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Alert, AlertDescription } from "@components/ui/alert";
import { TabsContent } from "@components/ui/tabs";

export function Examenes({ data = [] }) {
    const consultasConExamenes = data.filter(c => {
        try {
        const diag = typeof c.diagnostico === 'string' ? JSON.parse(c.diagnostico) : c.diagnostico;
        return diag?.examenes && diag.examenes.length > 0;
        } catch { return false; }
    });

    return ( 
        <CardContent className="pt-6">
            <TabsContent value="examenes" className="mt-0 space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Exámenes Solicitados
                    </h3>
                </div>

                {consultasConExamenes.length > 0 ? (
                    <div className="space-y-4">
                        {consultasConExamenes.map((consulta) => {
                            const diag = JSON.parse(consulta.diagnostico);
                            return (
                                <Card key={consulta.id} className="border-blue-200">
                                    
                                    <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-100">
                                        <CardTitle className="text-green-900 text-base">
                                            Exámenes - {consulta.id}
                                        </CardTitle>
                                        <CardDescription>
                                            {new Date(consulta.fechaConsulta).toLocaleDateString()} - Dr. {consulta.medico?.nombre}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-3">
                                        {diag.examenes.map((exam, idx) => (
                                            
                                            <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-start gap-3">
                                                    
                                                    <TestTube className="h-5 w-5 text-green-600 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900 mb-1"> {exam.nombre}</p>
                                                        <p className="text-sm text-gray-600 mb-2"> {exam.descripcion}</p>

                                                        <div className="text-sm">
                                                            <span className="text-gray-600">Estado: </span>
                                                            <span className="font-medium text-gray-900"> {exam.estado} </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                <Alert>
                    <TestTube className="h-4 w-4" />
                    <AlertDescription>
                        No hay exámenes solicitados para este paciente
                    </AlertDescription>
                </Alert>
                )}
        </TabsContent>
        </CardContent>
    )
}