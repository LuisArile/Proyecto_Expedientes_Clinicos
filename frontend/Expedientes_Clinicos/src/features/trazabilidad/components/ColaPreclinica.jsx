import { useState } from "react";
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

const pacientesSimulados = [
  {
    id: "PAC-002",
    nombre: "Carlos Hernández",
    identidad: "0801-1990-23456",
    prioridad: "alta",
    tipoIngreso: "primera-vez",
    motivoConsulta: "Dolor abdominal agudo",
    horaRegistro: "07:30",
  },
  {
    id: "PAC-007",
    nombre: "Laura Sánchez",
    identidad: "0801-1993-78901",
    prioridad: "media",
    tipoIngreso: "primera-vez",
    motivoConsulta: "Dolor de cabeza persistente",
    horaRegistro: "08:45",
  },
];

export function ColaPreclinica() {
    const { go } = useSafeNavigation();
    const { setSelectedPaciente } = usePacienteSelection();
    const { pacienteEnAtencion, setPacienteEnAtencion } = useTriajeState();

    const [pacientes] = useState(pacientesSimulados);
    
    const {
        dialogo, setDialogo, procesando, pacienteSeleccionado, pacientesOrdenados, 
        abrirDialogoInicio, confirmarInicio, confirmarFinalizacion
    } = useColaGestion({
        pacientes, 
        onSeleccionarPaciente: setSelectedPaciente,
        onNavigate: go, 
        setPacienteEnAtencion, 
        tipoAtencion: "preclinica"
    });

    const columns = usePreclinicaColumns({pacienteEnAtencion, iniciar: abrirDialogoInicio});

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
            
            {/* Header */}
            <PageHeader 
                title="Cola de Preclínica" subtitle="Pacientes en espera de registro de signos vitales y preclínica" Icon={Activity} 
                onVolver={() => go("inicio")}/>

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
                    onConfirm={() => confirmarFinalizacion(pacienteEnAtencion)}
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
