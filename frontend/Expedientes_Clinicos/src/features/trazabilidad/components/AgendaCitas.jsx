import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Calendar as CalendarIcon, Plus, UserPlus, ClipboardList, Activity, Search, Icon } from "lucide-react";

// import { useAuth } from "../../auth";
import { PageHeader } from "@components/layout/PageHeader";
import { CardCita } from "@/features/trazabilidad/components/CardCita"
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

    const steps = [
        {
            id: 1, color: "blue", Icon: CalendarIcon, title: "Agendar Cita", description: "Programar cita para fecha futura",
            content: "Programe una cita médica para un paciente en una fecha y hora específica. La cita quedará en estado",
            highlight: "Programado", buttonText: "Agendar Nueva Cita", route: "buscar-paciente-agendar", ButtonIcon: Plus
        },
        {
            id: 2, color: "green", Icon: UserPlus, title: "Registro del Día", description: "Atención inmediata o por llegada",
            content: "Registre un paciente para atención del día actual. El paciente entrará directamente al flujo asistencial en estado",
            highlight: "Registrado Hoy", buttonText: "Registrar Paciente Hoy", route: "buscar-paciente-hoy", ButtonIcon: UserPlus
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
            {/* Header */}
            <PageHeader title="Agenda y Registro de Pacientes" subtitle="Programe citas o registre pacientes para atención del día"
                    Icon={CalendarIcon} onVolver={onVolver}
            />

            <main className="min-h-screen bg-slate-50/50 p-6 space-y-6">
                {/* Tarjetas de Acción Rápida */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Agendar Cita / Registro del Día */}
                    {steps.map((step) => (
                        <CardCita
                            key={step.id}
                            {...step}
                            onClick={() => irA(step.route)}
                        />
                    ))}
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
