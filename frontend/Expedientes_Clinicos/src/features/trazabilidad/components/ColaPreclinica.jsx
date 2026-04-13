import { useState,useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge"; 
import { Activity, Clock, Play, CheckCircle2, User } from "lucide-react";
import { PageHeader } from "@components/layout/PageHeader";
import { DataTable } from "@components/common/DataTable";
import { ScrollArea } from "@components/ui/scroll-area";
import { ConfirmModal } from "@components/common/ConfirmModal";
import { getPrioridadConfig } from "@/features/trazabilidad/utils/prioridad";
import { useColaGestion } from "../hooks/useColaGestion";
import { usePreclinicaColumns } from "../hooks/usePreclinicaColumns";

import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";
import { usePacienteSelection } from "@/features/dashboard/hooks/usePacienteSelection";
import { useTriajeState } from "@/features/dashboard/hooks/useTriajeState";
import { obtenerPacientesPorEstado, iniciarPreclinica, finalizarPreclinica } from "../services/trazabilidadService";



export function ColaPreclinica() {
    const { go } = useSafeNavigation();
    const { setSelectedPaciente } = usePacienteSelection();
    const { pacienteEnAtencion, setPacienteEnAtencion } = useTriajeState();

    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);

const cargarPacientes = async () => {
    try {
        setLoading(true);
        const data = await obtenerPacientesPorEstado('ESPERA_PRECLINICA');
        console.log("Datos desde BD:", data);
        
        const pacientesTransformados = data.map(cita => ({
            id: cita.idCita, 
            nombre: `${cita.paciente?.nombre || ''} ${cita.paciente?.apellido || ''}`.trim(),
            identidad: cita.paciente?.dni || '',
            prioridad: cita.prioridad === 'URGENTE' ? 'alta' : 
                       cita.prioridad === 'EMERGENCIA' ? 'urgente' : 'normal',
            tipoIngreso: cita.tipo === 'PROGRAMADA' ? 'Cita programada' : 'Registro del día',
            motivoConsulta: cita.motivo,
            horaRegistro: cita.horaCita,
            citaId: cita.idCita,
            expedienteId: cita.paciente?.expedientes?.idExpediente
        }));
        
        console.log("Pacientes transformados:", pacientesTransformados);
        
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
        onSeleccionarPaciente: setSelectedPaciente,
        onNavigate: go, 
        setPacienteEnAtencion,
        pacienteEnAtencion, 
        tipoAtencion: "preclinica",
        mensajeExito: "Preclínica",
        onIniciarReal: async (paciente) => {
            await iniciarPreclinica(paciente.citaId);
            await cargarPacientes();
        },
        onFinalizarReal: async (paciente) => {
            await finalizarPreclinica(paciente.citaId);
            await cargarPacientes();
        }
    });

    const columns = usePreclinicaColumns({ pacienteEnAtencion, iniciar: abrirDialogoInicio });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
                <PageHeader 
                    title="Cola de Preclínica" 
                    subtitle="Cargando pacientes..." 
                    Icon={Activity} 
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
            
            <PageHeader 
                title="Cola de Preclínica" 
                subtitle="Pacientes en espera de registro de signos vitales y preclínica" 
                Icon={Activity} 
                onVolver={() => go("inicio")}
            />

            <main className="min-h-screen bg-slate-50/50 p-6 space-y-6">
                
                {/* Paciente en Atención */}
                {pacienteEnAtencion && (
                    <Card className="border-green-300 bg-green-50">
                        <CardHeader className="bg-gradient-to-r from-green-100 to-green-50">
                            <CardTitle className="flex items-center gap-2 text-green-900">
                                <User className="h-5 w-5" />
                                Paciente en Atención
                            </CardTitle>
                            <CardDescription>Preclínica en curso</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{pacienteEnAtencion.nombre}</h3>
                                    <p className="text-sm text-gray-600">ID: {pacienteEnAtencion.identidad}</p>
                                    <Badge variant="outline" className={getPrioridadConfig(pacienteEnAtencion.prioridad).color}>
                                        {getPrioridadConfig(pacienteEnAtencion.prioridad).label}
                                    </Badge>
                                </div>
                                <Button
                                    onClick={() => setDialogo("finalizar")}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Finalizar Preclínica
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Lista de Espera */}
                <Card className="bg-white shadow-sm border-slate-200 overflow-hidden">
                    <CardHeader className="border-b border-slate-50">
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                            <Clock className="h-5 w-5 text-blue-600" /> 
                            Pacientes en Espera
                        </CardTitle>
                        <CardDescription>
                            {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""} en espera
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
                    onClose={() => setDialogo(false)}
                    onConfirm={confirmarInicio}
                    loading={procesando}
                    title="¿Iniciar Preclínica?"
                    description={`Está a punto de iniciar la preclínica para ${pacienteSeleccionado?.nombre}. El estado cambiará a "En Preclínica".`}
                    confirmText="Iniciar"
                    icon={Play}
                />

                {/* Dialog Finalizar */}
                <ConfirmModal
                    isOpen={dialogo === "finalizar"}
                    onClose={() => setDialogo(false)}
                    onConfirm={confirmarFinalizacion}
                    loading={procesando}
                    title="¿Finalizar Preclínica?"
                    description={`La preclínica de ${pacienteEnAtencion?.nombre} será completada y enviada a consulta médica.`}
                    confirmText="Finalizar"
                    icon={CheckCircle2}
                    confirmColor="bg-green-600 hover:bg-green-700"
                />
            </main>
        </div>
    );
}
