import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Activity, Clock, User, Send, RefreshCw } from "lucide-react";
import { PageHeader } from "@components/layout/PageHeader";
import { DataTable } from "@components/common/DataTable";
import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";
import { obtenerPacientesPorEstado, enviarAEsperaPreclinica } from "../services/trazabilidadService";

export default function EnviarPreclinica() {
    const { go } = useSafeNavigation();
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);

    const cargarPacientes = async () => {
        try {
            setLoading(true);
            // Obtener pacientes en estado REGISTRADO_HOY
            const data = await obtenerPacientesPorEstado('REGISTRADO_HOY');
            
            const pacientesTransformados = data.map(cita => ({
                id: cita.idCita,
                nombre: `${cita.paciente?.nombre || ''} ${cita.paciente?.apellido || ''}`.trim(),
                identidad: cita.paciente?.dni || '',
                prioridad: cita.prioridad === 'URGENTE' ? 'Alta' : 
                           cita.prioridad === 'EMERGENCIA' ? 'Urgente' : 'Normal',
                motivo: cita.motivo,
                horaRegistro: cita.horaCita,
                citaId: cita.idCita
            }));
            
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

    const handleEnviar = async (citaId) => {
        setEnviando(true);
        try {
            await enviarAEsperaPreclinica(citaId);
            await cargarPacientes(); // Recargar la lista
        } catch (error) {
            console.error('Error al enviar a preclínica:', error);
            alert(error.message || 'Error al enviar a preclínica');
        } finally {
            setEnviando(false);
        }
    };

    const columns = [
        {
            header: "Hora",
            accessorKey: "horaRegistro",
            cellClassName: "text-sm"
        },
        {
            header: "Paciente",
            render: (row) => (
                <div>
                    <p className="font-medium text-gray-900">{row.nombre}</p>
                    <p className="text-xs text-gray-500">{row.identidad}</p>
                </div>
            )
        },
        {
            header: "Prioridad",
            render: (row) => (
                <Badge variant="outline" className={
                    row.prioridad === 'Urgente' ? 'bg-red-100 text-red-800' :
                    row.prioridad === 'Alta' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                }>
                    {row.prioridad}
                </Badge>
            )
        },
        {
            header: "Motivo",
            accessorKey: "motivo",
            cellClassName: "text-sm text-gray-600 max-w-xs truncate"
        },
        {
            header: "Acción",
            cellClassName: "text-center",
            render: (row) => (
                <Button
                    size="sm"
                    onClick={() => handleEnviar(row.citaId)}
                    disabled={enviando}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                    <Send className="h-3 w-3 mr-1" />
                    Enviar a Preclínica
                </Button>
            )
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
                <PageHeader 
                    title="Enviar a Preclínica" 
                    subtitle="Cargando pacientes..." 
                    Icon={Activity} 
                    onVolver={() => go("inicio")}
                />
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Cargando lista de pacientes...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
            <PageHeader 
                title="Enviar a Preclínica" 
                subtitle="Pacientes registrados hoy que esperan ser enviados a preclínica" 
                Icon={Send} 
                onVolver={() => go("inicio")}
            />

            <main className="min-h-screen bg-slate-50/50 p-6 space-y-6">
                <Card className="bg-white shadow-sm border-slate-200 overflow-hidden">
                    <CardHeader className="border-b border-slate-50">
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                            <User className="h-5 w-5 text-yellow-600" />
                            Pacientes en Registrado Hoy
                        </CardTitle>
                        <CardDescription>
                            {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""} listo{pacientes.length !== 1 ? "s" : ""} para enviar a preclínica
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable 
                            columns={columns} 
                            data={pacientes}
                            emptyMessage={
                                <div className="text-center py-20">
                                    <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                    <p className="font-medium text-gray-900">No hay pacientes pendientes</p>
                                    <p className="text-sm text-gray-500">Todos los pacientes han sido enviados a preclínica.</p>
                                </div>
                            }
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button variant="outline" onClick={cargarPacientes} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Actualizar
                    </Button>
                </div>
            </main>
        </div>
    );
}