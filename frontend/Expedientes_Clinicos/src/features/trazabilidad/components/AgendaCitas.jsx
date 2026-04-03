import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Calendar as CalendarIcon, Plus, UserPlus, ClipboardList, Activity, Search } from "lucide-react";
import { FormularioCita } from "@/features/trazabilidad/components/FormularioCita";
// import { useAuth } from "../../auth";
import { PageHeader } from "@components/layout/PageHeader";

export function AgendaCitas({ onVolver, onNavigate }) {
    // const { user } = useAuth();

    // Función para navegación
    const irA = (ruta) => {
        if (onNavigate) {
        onNavigate(ruta);
        } else {
        console.warn("La prop onNavigate no está definida");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
            {/* Header */}
            <PageHeader title="Agenda y Registro de Pacientes" subtitle="Programe citas o registre pacientes para atención del día"
                    Icon={CalendarIcon} onVolver={onVolver}
            />

            <main className="min-h-screen bg-slate-50/50 p-6 space-y-6">
                {/* Tarjetas de Acción Rápida */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Agendar Cita */}
                    <Card className="border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-600 rounded-lg">
                                        <CalendarIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-blue-900">Agendar Cita</CardTitle>
                                        <CardDescription>Programar cita para fecha futura</CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Programe una cita médica para un paciente en una fecha y hora específica. La cita
                                quedará en estado <strong>Programado</strong> hasta el día de la atención.
                            </p>
                            <Button
                                onClick={() => irA('formulario-agendar-cita')}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                            <Plus className="h-4 w-4 mr-2" />
                                Agendar Nueva Cita
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Registro del Día */}
                    <Card className="border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="bg-gradient-to-r from-green-50 to-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-600 rounded-lg">
                                        <UserPlus className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-green-900">Registro del Día</CardTitle>
                                        <CardDescription>Atención inmediata o por llegada</CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Registre un paciente para atención del día actual. El paciente entrará directamente
                                al flujo asistencial en estado <strong>Registrado Hoy</strong>.
                            </p>
                            <Button
                                onClick={() => irA('formulario-registro-hoy')}
                                className="w-full bg-green-600 hover:bg-green-700"
                            >
                            <UserPlus className="h-4 w-4 mr-2" />
                                Registrar Paciente Hoy
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Información del Flujo */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-purple-600" />
                            Flujo de Atención Clínica
                        </CardTitle>
                        <CardDescription>
                            Visualice cómo avanzan los pacientes a través del sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                        {[
                            { id: 1, label: "Programado", color: "blue", subtitle: "Cita futura" },
                            { id: 2, label: "Registrado Hoy", color: "indigo", subtitle: "Atención del día" },
                            { id: 3, label: "Espera Preclínica", color: "yellow", subtitle: "En cola" },
                            { id: 4, label: "En Preclínica", color: "green", subtitle: "Con enfermero" },
                            { id: 5, label: "Espera Consulta", color: "orange", subtitle: "En cola" },
                            { id: 6, label: "En Consulta", color: "purple", subtitle: "Con doctor" },
                            { id: 7, label: "Finalizado", color: "emerald", subtitle: "Completado" },
                        ].map((step) => (
                            <div key={step.id} className={`flex flex-col items-center p-3 rounded-lg border bg-${step.color}-50 border-${step.color}-200`}>
                            <Badge className={`bg-${step.color}-100 text-${step.color}-800 border-${step.color}-300 mb-2`}>{step.id}</Badge>
                            <p className={`text-xs font-semibold text-center text-${step.color}-900`}>{step.label}</p>
                            <p className="text-xs text-gray-600 text-center mt-1">{step.subtitle}</p>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Acceso Rápido al Tablero */}
                <Card className="border-purple-200">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-white">
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-purple-600" />
                            Seguimiento de Pacientes
                        </CardTitle>
                        <CardDescription>
                            Acceda al tablero de trazabilidad para ver todos los pacientes en atención
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-4">
                            Visualice en tiempo real todos los pacientes y su estado actual en el flujo asistencial.
                        </p>
                        <Button 
                            variant="outline"
                            className="w-full border-purple-300 text-purple-700"
                            onClick={() => irA('tablero-trazabilidad')}
                        >
                            <Search className="h-4 w-4 mr-2" />
                            Ir al Tablero de Trazabilidad
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
