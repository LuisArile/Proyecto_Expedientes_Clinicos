import { useState,useEffect } from "react";
import { obtenerTablero } from "../services/trazabilidadService";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Calendar, Clock, User, AlertCircle, Activity, Search, Filter, RefreshCw, Bell, CheckCircle2, } from "lucide-react";
import { ScrollArea } from "@components/ui/scroll-area";
import { PageHeader } from "@components/layout/PageHeader";
import { StatCard } from "@components/common/StatCard";
import { FilterInput } from "@components/common/FilterSearch"
import { useSafeNavigation } from "../../dashboard/hooks/useSafeNavigation"



//datos reales
export function TableroTrazabilidad() {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { go } = useSafeNavigation();
    const [busqueda, setBusqueda] = useState("");

    const cargarTablero = async () => {
        try {
            setLoading(true);
            const data = await obtenerTablero();
            
            const pacientesTransformados = [];
            const estadosMap = {
                'PROGRAMADO': 'programado',
                'REGISTRADO_HOY': 'registrado-hoy',
                'ESPERA_PRECLINICA': 'espera-preclinica',
                'EN_PRECLINICA': 'en-preclinica',
                'ESPERA_CONSULTA': 'espera-consulta',
                'EN_CONSULTA': 'en-consulta',
                'FINALIZADO': 'finalizado'
            };
            
            for (const [estadoBackend, citas] of Object.entries(data)) {
                const estadoFrontend = estadosMap[estadoBackend];
                if (!estadoFrontend) continue;
                
                for (const cita of citas) {
                    pacientesTransformados.push({
                        id: cita.idCita,
                        nombre: `${cita.paciente?.nombre || ''} ${cita.paciente?.apellido || ''}`.trim(),
                        identidad: cita.paciente?.dni || '',
                        estado: estadoFrontend,
                        prioridad: cita.prioridad === 'URGENTE' ? 'alta' : 
                                   cita.prioridad === 'EMERGENCIA' ? 'urgente' : 'normal',
                        tipoIngreso: cita.tipo === 'PROGRAMADA' ? 'control' : 'primera-vez',
                        motivoConsulta: cita.motivo || '',
                        horaRegistro: cita.horaCita || '',
                        fechaCita: cita.fechaCita ? new Date(cita.fechaCita).toLocaleDateString() : '',
                        responsableActual: cita.enfermero?.nombre || cita.medico?.nombre || ''
                    });
                }
            }
            
            setPacientes(pacientesTransformados);
        } catch (error) {
            console.error('Error cargando tablero:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarTablero();
    }, []);

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

    const renderColumna = (estado, titulo, icon, descripcion) => {
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
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-32 text-center p-4 bg-white rounded-lg border border-dashed border-gray-300">
                            <Activity className="h-8 w-8 text-gray-400 mb-2 animate-spin" />
                            <p className="text-xs text-gray-500">Cargando...</p>
                        </div>
                    ) : pacientesColumna.length === 0 ? (
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

    if (loading && pacientes.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
                <PageHeader title="Tablero de Trazabilidad" subtitle="Cargando datos..." Icon={Activity} onVolver={() => go("inicio")} />
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Cargando tablero...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
            {/* Header */}
            <PageHeader 
                title="Tablero de Trazabilidad" 
                subtitle="Seguimiento en tiempo real del flujo asistencial de pacientes"
                Icon={Activity} 
                onVolver={() => go("inicio")}
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
                                <FilterInput 
                                    icon={Search} 
                                    value={busqueda} 
                                    onChange={setBusqueda} 
                                    placeholder="Buscar paciente por nombre o identidad..." 
                                />
                            </div>
                            <Button variant="outline" onClick={() => setBusqueda("")}>
                                <Filter className="h-4 w-4 mr-2" /> Filtros
                            </Button>
                            <Button variant="outline" onClick={cargarTablero}>
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
