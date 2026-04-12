import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Calendar, Clock, User, Activity, CheckCircle2, Bell, Stethoscope, ArrowRight } from "lucide-react";
import { TabsContent } from "@components/ui/tabs";

const eventosSimulados = [
    {
        id: "EV-001",
        tipo: "registro",
        estado: "registrado-hoy",
        descripcion: "Paciente registrado para atención del día",
        fecha: "22/03/2026",
        hora: "08:00",
        responsable: "María González",
        rol: "Recepcionista",
    },
    {
        id: "EV-002",
        tipo: "envio-preclinica",
        estado: "espera-preclinica",
        descripcion: "Enviado a cola de preclínica",
        fecha: "22/03/2026",
        hora: "08:05",
        responsable: "María González",
        rol: "Recepcionista",
    },
    {
        id: "EV-003",
        tipo: "inicio-preclinica",
        estado: "en-preclinica",
        descripcion: "Preclínica iniciada - Registro de signos vitales",
        fecha: "22/03/2026",
        hora: "08:15",
        responsable: "Juan Pérez",
        rol: "Enfermero",
    },
    {
        id: "EV-004",
        tipo: "fin-preclinica",
        estado: "espera-consulta",
        descripcion: "Preclínica finalizada - Enviado a consulta médica",
        fecha: "22/03/2026",
        hora: "08:30",
        responsable: "Juan Pérez",
        rol: "Enfermero",
    },
    {
        id: "EV-005",
        tipo: "inicio-consulta",
        estado: "en-consulta",
        descripcion: "Consulta médica iniciada",
        fecha: "22/03/2026",
        hora: "09:00",
        responsable: "Dr. Carlos Rodríguez",
        rol: "Doctor",
    },
    {
        id: "EV-006",
        tipo: "fin-consulta",
        estado: "finalizado",
        descripcion: "Consulta médica finalizada - Atención completada",
        fecha: "22/03/2026",
        hora: "09:45",
        responsable: "Dr. Carlos Rodríguez",
        rol: "Doctor",
    },
];

export function TimelineAtencion() {
    const getEstadoConfig = (estado) => {
        const configs = {
            programado: { color: "bg-blue-100 text-blue-800 border-blue-300", icon: Calendar },
            "registrado-hoy": { color: "bg-indigo-100 text-indigo-800 border-indigo-300", icon: Bell },
            "espera-preclinica": { color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: Clock },
            "en-preclinica": { color: "bg-green-100 text-green-800 border-green-300", icon: Activity },
            "espera-consulta": { color: "bg-orange-100 text-orange-800 border-orange-300", icon: Clock },
            "en-consulta": { color: "bg-purple-100 text-purple-800 border-purple-300", icon: Stethoscope },
            finalizado: { color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: CheckCircle2 },
        };
        return configs[estado] || configs.finalizado;
    };

    const getRolColor = (rol) => {
        const colors = {
            Recepcionista: "text-blue-600",
            Enfermero: "text-green-600",
            Doctor: "text-purple-600",
            Administrador: "text-red-600",
        };
        return colors[rol] || "text-gray-600";
    };

    return (
        <CardContent className="pt-6">
            <TabsContent value="trazabilidad" className="mt-0 space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Trazabilidad
                    </h3>
                </div>
                <div className="relative">
                    {/* Línea vertical del timeline */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 via-purple-300 to-emerald-300"></div>

                    {/* Eventos */}
                    <div className="space-y-6">
                        {eventosSimulados.map((evento, index) => {
                            const config = getEstadoConfig(evento.estado);
                            const IconComponent = config.icon;

                            return (
                                <div key={evento.id} className="relative pl-12">
                                {/* Círculo del timeline */}
                                <div
                                    className={`absolute left-0 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center ${
                                    evento.estado === "finalizado"
                                        ? "bg-emerald-500"
                                        : evento.estado.includes("en-")
                                        ? "bg-purple-500"
                                        : "bg-gray-300"
                                    }`}
                                >
                                    <IconComponent className="h-4 w-4 text-white" />
                                </div>

                                {/* Contenido del evento */}
                                <div
                                    className={`p-4 rounded-lg border-l-4 ${
                                        evento.estado === "finalizado"
                                            ? "bg-emerald-50 border-emerald-500"
                                            : evento.estado.includes("en-")
                                            ? "bg-purple-50 border-purple-500"
                                            : "bg-gray-50 border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <Badge variant="outline" className={config.color}>
                                                {evento.estado.replace(/-/g, " ").toUpperCase()}
                                            </Badge>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                                <Calendar className="h-3 w-3" />
                                                <span>{evento.fecha}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                                <Clock className="h-3 w-3" />
                                                <span>{evento.hora}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm font-medium text-gray-900 mb-2">{evento.descripcion}</p>

                                    <div className="flex items-center gap-2 text-xs">
                                        <User className={`h-3 w-3 ${getRolColor(evento.rol)}`} />
                                        <span className="text-gray-700">
                                            <strong className={getRolColor(evento.rol)}>{evento.responsable}</strong>
                                            <span className="text-gray-500"> • {evento.rol}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Flecha de conexión (excepto para el último) */}
                                {index < eventosSimulados.length - 1 && (
                                    <div className="absolute left-3.5 -bottom-3 text-gray-400">
                                        <ArrowRight className="h-4 w-4 rotate-90" />
                                    </div>
                                )}
                                </div>
                            );
                            })}
                    </div>

                    {/* Estado final */}
                    {eventosSimulados[eventosSimulados.length - 1]?.estado === "finalizado" && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-600 rounded-full">
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-emerald-900">Atención Completada</p>
                                    <p className="text-sm text-emerald-700">
                                        El paciente ha finalizado todo el proceso asistencial
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </TabsContent>
        </CardContent>
    );
}
