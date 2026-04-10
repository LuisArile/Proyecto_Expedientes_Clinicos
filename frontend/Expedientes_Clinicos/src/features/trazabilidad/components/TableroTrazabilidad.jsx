import { useState } from "react";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Calendar, Clock, User, AlertCircle, Activity, Search, Filter, RefreshCw, Bell, CheckCircle2, } from "lucide-react";
import { ScrollArea } from "@components/ui/scroll-area";
import { PageHeader } from "@components/layout/PageHeader";
import { StatCard } from "@components/common/StatCard";
import { FilterInput } from "@components/common/FilterSearch"
import { useSafeNavigation } from "../../dashboard/hooks/useSafeNavigation"
// Datos simulados
const pacientesSimulados = [
    {
        id: "PAC-001",
        nombre: "María González",
        identidad: "0801-1985-12345",
        estado: "programado",
        prioridad: "normal",
        tipoIngreso: "control",
        motivoConsulta: "Control de presión arterial",
        horaRegistro: "08:00",
        fechaCita: "22/03/2026",
    },
    {
        id: "PAC-002",
        nombre: "Carlos Hernández",
        identidad: "0801-1990-23456",
        estado: "espera-preclinica",
        prioridad: "alta",
        tipoIngreso: "primera-vez",
        motivoConsulta: "Dolor abdominal agudo",
        horaRegistro: "07:30",
    },
    {
        id: "PAC-003",
        nombre: "Ana Martínez",
        identidad: "0801-1995-34567",
        estado: "en-preclinica",
        prioridad: "urgente",
        tipoIngreso: "emergencia",
        motivoConsulta: "Dificultad respiratoria",
        horaRegistro: "07:45",
        responsableActual: "Juan Pérez (Enfermero)",
    },
    {
        id: "PAC-004",
        nombre: "Luis Rodríguez",
        identidad: "0801-1988-45678",
        estado: "espera-consulta",
        prioridad: "media",
        tipoIngreso: "subsecuente",
        motivoConsulta: "Seguimiento post-operatorio",
        horaRegistro: "08:15",
    },
    {
        id: "PAC-005",
        nombre: "Sofia López",
        identidad: "0801-1992-56789",
        estado: "en-consulta",
        prioridad: "normal",
        tipoIngreso: "control",
        motivoConsulta: "Control de diabetes",
        horaRegistro: "08:30",
        responsableActual: "Dr. Carlos Rodríguez",
    },
    {
        id: "PAC-006",
        nombre: "Pedro García",
        identidad: "0801-1987-67890",
        estado: "finalizado",
        prioridad: "normal",
        tipoIngreso: "primera-vez",
        motivoConsulta: "Consulta general",
        horaRegistro: "07:00",
    },
    {
        id: "PAC-007",
        nombre: "Laura Sánchez",
        identidad: "0801-1993-78901",
        estado: "registrado-hoy",
        prioridad: "media",
        tipoIngreso: "primera-vez",
        motivoConsulta: "Dolor de cabeza persistente",
        horaRegistro: "08:45",
    },
];

export function TableroTrazabilidad() {
    const [pacientes] = useState(pacientesSimulados);
    const { go } = useSafeNavigation();
    const [busqueda, setBusqueda] = useState("");

    const getEstadoConfig = (estado) => {
        const configs = {
            programado: {
                label: "Programado",
                color: "bg-blue-100 text-blue-800 border-blue-300",
                bgColumn: "bg-blue-50",
                borderColumn: "border-blue-200",
            },
            "registrado-hoy": {
                label: "Registrado Hoy",
                color: "bg-indigo-100 text-indigo-800 border-indigo-300",
                bgColumn: "bg-indigo-50",
                borderColumn: "border-indigo-200",
            },
            "espera-preclinica": {
                label: "Espera Preclínica",
                color: "bg-yellow-100 text-yellow-800 border-yellow-300",
                bgColumn: "bg-yellow-50",
                borderColumn: "border-yellow-200",
            },
            "en-preclinica": {
                label: "En Preclínica",
                color: "bg-green-100 text-green-800 border-green-300",
                bgColumn: "bg-green-50",
                borderColumn: "border-green-200",
            },
            "espera-consulta": {
                label: "Espera Consulta",
                color: "bg-orange-100 text-orange-800 border-orange-300",
                bgColumn: "bg-orange-50",
                borderColumn: "border-orange-200",
            },
            "en-consulta": {
                label: "En Consulta",
                color: "bg-purple-100 text-purple-800 border-purple-300",
                bgColumn: "bg-purple-50",
                borderColumn: "border-purple-200",
            },
            finalizado: {
                label: "Finalizado",
                color: "bg-emerald-100 text-emerald-800 border-emerald-300",
                bgColumn: "bg-emerald-50",
                borderColumn: "border-emerald-200",
            },
        };
        return configs[estado];
    };

    const getPrioridadConfig = (prioridad) => {
        const configs = {
            normal: { label: "Normal", color: "bg-green-100 text-green-800 border-green-300" },
            media: { label: "Media", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
            alta: { label: "Alta", color: "bg-orange-100 text-orange-800 border-orange-300" },
            urgente: { label: "Urgente", color: "bg-red-100 text-red-800 border-red-300" },
        };
        return configs[prioridad];
    };

    const pacientesFiltrados = pacientes.filter(
        (p) =>
            busqueda === "" ||
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.identidad.includes(busqueda)
    );

    const pacientesPorEstado = (estado) => {
        return pacientesFiltrados.filter((p) => p.estado === estado);
    };

    const renderTarjetaPaciente = (paciente) => {
        const estadoConfig = getEstadoConfig(paciente.estado);
        const prioridadConfig = getPrioridadConfig(paciente.prioridad);

        return (
            <Card
                key={paciente.id}
                className="mb-3 hover:shadow-md transition-shadow cursor-pointer border-l-4"
                style={{ borderLeftColor: prioridadConfig.color.includes("red") ? "#dc2626" : prioridadConfig.color.includes("orange") ? "#ea580c" : prioridadConfig.color.includes("yellow") ? "#ca8a04" : "#16a34a" }}
            >
                <CardContent className="p-4">
                    <div className="space-y-2">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-sm">{paciente.nombre}</h4>
                                <p className="text-xs text-gray-500">{paciente.identidad}</p>
                            </div>
                            <Badge variant="outline" className={prioridadConfig.color}>
                                {prioridadConfig.label}
                            </Badge>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Clock className="h-3 w-3" />
                                <span>{paciente.horaRegistro}</span>
                                {paciente.fechaCita && <span>• Cita: {paciente.fechaCita}</span>}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Activity className="h-3 w-3" />
                                <span>{paciente.tipoIngreso}</span>
                            </div>
                        </div>

                        <p className="text-xs text-gray-700 line-clamp-2">{paciente.motivoConsulta}</p>

                        {paciente.responsableActual && (
                            <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 p-2 rounded">
                                <User className="h-3 w-3" />
                                <span>{paciente.responsableActual}</span>
                            </div>
                        )}

                        <div className="pt-2 border-t border-gray-100">
                            <Badge variant="outline" className={`${estadoConfig.color} text-xs`}>
                                {estadoConfig.label}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderColumna = (
        estado,
        titulo,
        icon,
        descripcion
    ) => {
        const estadoConfig = getEstadoConfig(estado);
        const pacientesColumna = pacientesPorEstado(estado);

        return (
            <div
                className={`flex-1 min-w-[280px] ${estadoConfig.bgColumn} border ${estadoConfig.borderColumn} rounded-lg p-3`}
            >
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-white rounded-md shadow-sm">{icon}</div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{titulo}</h3>
                            <p className="text-xs text-gray-600">{descripcion}</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-white">
                        {pacientesColumna.length}
                    </Badge>
                </div>

                <ScrollArea className="h-[600px] pr-2">
                    {pacientesColumna.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-center p-4 bg-white rounded-lg border border-dashed border-gray-300">
                            <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500">No hay pacientes</p>
                        </div>
                    ) : (
                        <div>{pacientesColumna.map((p) => renderTarjetaPaciente(p))}</div>
                    )}
                </ScrollArea>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
            {/* Header */}
            <PageHeader title="Tablero de Trazabilidad" subtitle="Seguimiento en tiempo real del flujo asistencial de pacientes"
                    Icon={Activity} onVolver={() => go("inicio")}
            />

            <main className="min-h-screen bg-slate-50/50 p-6 space-y-6">
                
                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard title="Total Hoy" value={pacientes.length} icon={Activity} iconColor="text-blue-600"/>
                    <StatCard title="En Atención" 
                              value={pacientes.filter((p) => p.estado === "en-preclinica" || p.estado === "en-consulta").length} 
                              icon={User} iconColor="text-purple-600"/>
                    <StatCard title="En Espera" 
                              value={pacientes.filter((p) => p.estado === "espera-preclinica" || p.estado === "espera-consulta").length}
                              icon={Clock} iconColor="text-yellow-600"/>
                    <StatCard title="Finalizados" 
                              value={pacientes.filter((p) => p.estado === "finalizado").length}
                              icon={CheckCircle2} iconColor="text-green-600"/>
                </div>

                {/* Barra de herramientas */}
                <Card className="bg-white shadow-sm border-slate-200">
                    <CardContent className="pt-4">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1 relative">
                                <FilterInput icon={Search} value={busqueda} onChange={setBusqueda} placeholder="Buscar paciente por nombre o identidad..." />
                            </div>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" /> Filtros
                            </Button>
                            <Button variant="outline">
                                <RefreshCw className="h-4 w-4 mr-2" /> Actualizar
                            </Button>
                        </div>
                        
                    </CardContent>
                </Card>

                {/* Tablero Kanban */}
                <div className="overflow-x-auto">
                    <div className="flex gap-4 pb-4">
                        {renderColumna(
                            "programado",
                            "Programado",
                            <Calendar className="h-4 w-4 text-blue-600" />,
                            "Citas futuras"
                        )}
                        {renderColumna(
                            "registrado-hoy",
                            "Registrado Hoy",
                            <Bell className="h-4 w-4 text-indigo-600" />,
                            "Atención del día"
                        )}
                        {renderColumna(
                            "espera-preclinica",
                            "Espera Preclínica",
                            <Clock className="h-4 w-4 text-yellow-600" />,
                            "En cola"
                        )}
                        {renderColumna(
                            "en-preclinica",
                            "En Preclínica",
                            <Activity className="h-4 w-4 text-green-600" />,
                            "Con enfermero"
                        )}
                        {renderColumna(
                            "espera-consulta",
                            "Espera Consulta",
                            <Clock className="h-4 w-4 text-orange-600" />,
                            "En cola"
                        )}
                        {renderColumna(
                            "en-consulta",
                            "En Consulta",
                            <User className="h-4 w-4 text-purple-600" />,
                            "Con doctor"
                        )}
                        {renderColumna(
                            "finalizado",
                            "Finalizado",
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
                            "Completado"
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
