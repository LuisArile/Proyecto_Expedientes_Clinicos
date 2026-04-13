import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Stethoscope, Clock, Play, CheckCircle2, User, Loader2, Activity } from "lucide-react";
import { PageHeader } from "@components/layout/PageHeader";
import { DataTable } from "@components/common/DataTable";
import { ScrollArea } from "@components/ui/scroll-area";
import { ConfirmModal } from "@components/common/ConfirmModal";
import { useConsultaColumns } from "../hooks/useConsultaColumns";
import { useColaGestion } from "../hooks/useColaGestion";
import { getPrioridadConfig } from "@/features/trazabilidad/utils/prioridad";
import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";
import { usePacienteSelection } from "@/features/dashboard/hooks/usePacienteSelection";
import { useTriajeState } from "@/features/dashboard/hooks/useTriajeState";
import { obtenerPacientesPorEstado, iniciarConsulta, finalizarConsulta } from "../services/trazabilidadService";

export function ColaConsulta() {
    const { go } = useSafeNavigation();
    const { setSelectedPaciente } = usePacienteSelection();
    const { pacienteEnAtencion, setPacienteEnAtencion } = useTriajeState();
    
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarPacientes = async () => {
        try {
            setLoading(true);
            const data = await obtenerPacientesPorEstado('ESPERA_CONSULTA');
            
            const pacientesTransformados = data.map(cita => {
                const idExp = cita.paciente?.expedientes?.idExpediente || 
                            cita.paciente?.expediente?.idExpediente || 
                            cita.paciente?.idPaciente;

                return {
                    id: cita.idCita,
                    citaId: cita.idCita,
                    nombre: cita.paciente?.nombre || '',
                    apellido: cita.paciente?.apellido || '',
                    identidad: cita.paciente?.dni || '',
                    dni: cita.paciente?.dni || '', 
                    prioridad: cita.prioridad === 'URGENTE' ? 'alta' : 
                            cita.prioridad === 'EMERGENCIA' ? 'urgente' : 'normal',
                    expedientes: {
                        idExpediente: idExp,
                        numeroExpediente: cita.paciente?.expedientes?.numeroExpediente || `EXP-${idExp}`
                    },
                    resumenPreclinico: cita.preclinica
                };
            });
            
            setPacientes(pacientesTransformados);
        } catch (error) {
            console.error('Error cargando pacientes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPacientes();
    }, []);

    const {
        dialogo, setDialogo, procesando, pacienteSeleccionado, pacientesOrdenados, 
        abrirDialogoInicio, confirmarInicio, confirmarFinalizacion 
    } = useColaGestion({
        pacientes,
        onNavigate: go, 
        setPacienteEnAtencion,
        onSeleccionarPaciente: setSelectedPaciente,
        pacienteEnAtencion,
        tipoAtencion: "consulta-medica",
        mensajeExito: "Consulta",
        onIniciarReal: async (paciente) => {
            await iniciarConsulta(paciente.citaId);
            await cargarPacientes();
        },
        onFinalizarReal: async (paciente) => {
            await finalizarConsulta(paciente.citaId);
            await cargarPacientes();
        }
    });

    const columns = useConsultaColumns({ pacienteEnAtencion, iniciarConsulta: abrirDialogoInicio });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
                <PageHeader 
                    title="Cola de Consulta Médica" 
                    subtitle="Cargando pacientes..." 
                    Icon={Stethoscope} 
                    onVolver={() => go("inicio")}
                />
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Cargando lista de espera...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
            {/* Header */}
            <PageHeader 
                title="Cola de Consulta Médica" 
                subtitle="Pacientes en espera de consulta médica con resumen preclínico" 
                Icon={Stethoscope} 
                onVolver={() => go("inicio")}
            />

            <main className="min-h-screen bg-slate-50/50 p-6 space-y-6">

                {/* Paciente en Atención */}
                {pacienteEnAtencion && (
                    <Card className="border-purple-300 bg-purple-50">
                        <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50">
                            <CardTitle className="flex items-center gap-2 text-purple-900">
                                <User className="h-5 w-5" />
                                Paciente en Consulta
                            </CardTitle>
                            <CardDescription>Consulta médica en curso</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{pacienteEnAtencion.nombre}</h3>
                                        <p className="text-sm text-gray-600">ID: {pacienteEnAtencion.identidad}</p>
                                        <Badge variant="outline" className={getPrioridadConfig(pacienteEnAtencion.prioridad).color}>
                                            {getPrioridadConfig(pacienteEnAtencion.prioridad).label}
                                        </Badge>
                                    </div>
                                    <Button
                                        onClick={() => setDialogo("Finalizar")}
                                        className="bg-purple-600 hover:bg-purple-700"
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Finalizar Consulta
                                    </Button>
                                </div>

                                {pacienteEnAtencion.resumenPreclinico && (
                                    <div className="p-3 bg-white rounded-lg border border-purple-200">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-purple-600" /> Resumen Preclínico
                                        </h4>
                                        <div className="grid grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <p className="text-gray-600">Presión Arterial</p>
                                                <p className="font-medium text-gray-900">{pacienteEnAtencion.resumenPreclinico.presion}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Temperatura</p>
                                                <p className="font-medium text-gray-900">{pacienteEnAtencion.resumenPreclinico.temperatura}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Peso</p>
                                                <p className="font-medium text-gray-900">{pacienteEnAtencion.resumenPreclinico.peso}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Registrado por: {pacienteEnAtencion.resumenPreclinico.enfermero}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Lista de Espera */}
                <Card className="bg-white shadow-sm border-slate-200 overflow-hidden">
                    <CardHeader className="border-b border-slate-50">
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                            <Clock className="h-5 w-5 text-blue-600" /> Pacientes en Espera
                        </CardTitle>
                        <CardDescription>
                            {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""} en cola
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[500px] w-full px-6 pb-6">
                            <DataTable 
                                columns={columns} 
                                data={pacientesOrdenados} 
                                emptyMessage={
                                    <div className="text-center py-20">
                                        <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                        <p className="font-medium text-gray-900">No hay pacientes en espera</p>
                                        <p className="text-sm text-gray-500">Todos han sido atendidos.</p>
                                    </div>
                                }
                            />
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Dialog Iniciar */}
                <ConfirmModal
                    isOpen={dialogo === "iniciar"}
                    onClose={() => setDialogo(null)}
                    onConfirm={confirmarInicio}
                    loading={procesando}
                    title="¿Iniciar Consulta Médica?"
                    description={`Está a punto de iniciar la consulta médica para ${pacienteSeleccionado?.nombre}. El estado cambiará a "En Consulta".`}
                    confirmText="Iniciar"
                    icon={Play}
                    confirmColor="bg-purple-600 hover:bg-green-700"
                />

                {/* Dialog Finalizar */}                
                <ConfirmModal
                    isOpen={dialogo === "Finalizar"}
                    onClose={() => setDialogo(null)}
                    onConfirm={confirmarFinalizacion}
                    loading={procesando}
                    title="¿Finalizar Consulta Medica?"
                    description={`La consulta médica de ${pacienteEnAtencion?.nombre} será marcada como completada. La atención del paciente habrá finalizado.`}
                    confirmText="Finalizar Atención"
                    icon={CheckCircle2}
                    confirmColor="bg-purple-600 hover:bg-green-700"
                />
            </main>
        </div>
    );
}
