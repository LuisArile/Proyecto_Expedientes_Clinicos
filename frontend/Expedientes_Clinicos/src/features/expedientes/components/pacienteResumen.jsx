import { Card, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { User, IdCard, Calendar } from "lucide-react";

export function PacienteResumen({ paciente }) {
    return (
        <Card className="mb-6 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl text-blue-900">{paciente.nombre}</CardTitle>
                            <CardDescription className="mt-1 flex items-center gap-4 text-base">
                                <span className="flex items-center gap-1">
                                    <IdCard className="h-4 w-4" />
                                    {paciente.identidad}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {paciente.fechaNacimiento}
                                </span>
                                <span className="capitalize">
                                    {paciente.genero}
                                </span>
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}