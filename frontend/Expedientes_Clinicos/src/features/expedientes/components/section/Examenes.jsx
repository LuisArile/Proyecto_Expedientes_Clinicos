import { AlertTriangle, TestTube} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Alert, AlertDescription } from "@components/ui/alert";
import { TabsContent } from "@components/ui/tabs";
import { formatearFechaHora } from "@/utils/dateFormatter";

export function Examenes({ data = [] }) {

    const consultasConExamenes = data.filter(c => 
        c.examenes && c.examenes.length > 0
    );

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
                        {consultasConExamenes.map((consulta) => (
                            <Card key={consulta.id} className="border-blue-200">

                                <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-100">
                                    <CardTitle className="text-green-900 text-base">
                                        Exámenes - {consulta.id}
                                    </CardTitle>
                                    <CardDescription>
                                        {new Date(consulta.fechaConsulta).toLocaleDateString()} - Dr. {consulta.medico?.nombre} {consulta.medico?.apellido}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-4 space-y-3">
                                    {consulta.examenes.map((item, idx) => {
                                        const exam = item.examen;

                                        return (
                                            <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-start gap-3">

                                                    <TestTube className="h-5 w-5 text-green-600 mt-0.5" />

                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900 mb-1">
                                                            {exam?.nombre}
                                                        </p>

                                                        <p className="text-sm text-gray-600 mb-2">
                                                            Especialidad: {exam?.especialidad}
                                                        </p>

                                                        <div className="flex text-sm items-start gap-2">
                                                            <span className="text-gray-600">Prioridad: </span>
                                                            <div className="flex items-center gap-2 ">
                                                                {item.prioridad === "URGENTE" && (
                                                                <AlertTriangle className="h-4 w-4 text-red-700" />
                                                                )}

                                                                <span
                                                                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                                    item.prioridad === "URGENTE"
                                                                    ? "bg-red-200 text-red-800"
                                                                    : item.prioridad === "ALTA"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : item.prioridad === "MEDIA"
                                                                    ? "bg-yellow-100 text-yellow-700"
                                                                    : "bg-green-100 text-green-700"
                                                                }`}
                                                                >
                                                                {item.prioridad}
                                                                </span>

                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    })}
                                </CardContent>

                            </Card>
                        ))}
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
    );
}