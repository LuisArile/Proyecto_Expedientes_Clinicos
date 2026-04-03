import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge"; 
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { Activity, Clock, Play, CheckCircle2, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
// import { useAuth } from "../context/auth-context";
import { PageHeader } from "@components/layout/PageHeader";

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

export function ColaPreclinica(onVolver) {
//  const { user } = useAuth();
    const [pacientes, setPacientes] = useState(pacientesSimulados);
    const [pacienteEnAtencion, setPacienteEnAtencion] = useState();
    const [dialogoIniciar, setDialogoIniciar] = useState(false);
    const [dialogoFinalizar, setDialogoFinalizar] = useState(false);
    const [procesando, setProcesando] = useState(false);

    const getPrioridadConfig = (prioridad) => {
        const configs = {
            normal: { label: "Normal", color: "bg-green-100 text-green-800 border-green-300" },
            media: { label: "Media", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
            alta: { label: "Alta", color: "bg-orange-100 text-orange-800 border-orange-300" },
            urgente: { label: "Urgente", color: "bg-red-100 text-red-800 border-red-300" },
        };
        return configs[prioridad];
    };

    const handleIniciarPreclinica = () => {
        if (!pacienteSeleccionadoIniciar) return;
        setProcesando(true);

        setTimeout(() => {
            // Registrar en bitácora
            const eventoBitacora = {
                tipo: "INICIO_PRECLINICA",
                // usuario: user?.username,
                // rol: user?.role,
                accion: `Preclínica iniciada para ${pacienteSeleccionadoIniciar.nombre}`,
                detalles: {
                    pacienteId: pacienteSeleccionadoIniciar.id,
                    paciente: pacienteSeleccionadoIniciar.nombre,
                    estadoAnterior: "espera-preclinica",
                    estadoNuevo: "en-preclinica",
                    // enfermero: user?.name,
                    horaInicio: new Date().toLocaleTimeString("es-HN"),
                },
                timestamp: new Date().toLocaleString("es-HN"),
            };
            console.log("Evento registrado en bitácora:", eventoBitacora);

            setPacienteEnAtencion(pacienteSeleccionadoIniciar);
            setPacientes(pacientes.filter((p) => p.id !== pacienteSeleccionadoIniciar.id));
            setProcesando(false);
            setDialogoIniciar(false);
            setPacienteSeleccionadoIniciar(null);

            toast.success("Preclínica iniciada", {
                description: `Ahora está atendiendo a ${pacienteSeleccionadoIniciar.nombre}`,
            });
        }, 1000);
    };

    const handleFinalizarPreclinica = () => {
        if (!pacienteEnAtencion) return;
        setProcesando(true);

        setTimeout(() => {
            // Registrar en bitácora
            const eventoBitacora = {
                tipo: "FIN_PRECLINICA",
                // usuario: user?.username,
                // rol: user?.role,
                accion: `Preclínica finalizada para ${pacienteEnAtencion.nombre}`,
                detalles: {
                    pacienteId: pacienteEnAtencion.id,
                    paciente: pacienteEnAtencion.nombre,
                    estadoAnterior: "en-preclinica",
                    estadoNuevo: "espera-consulta",
                    // enfermero: user?.name,
                    horaFin: new Date().toLocaleTimeString("es-HN"),
                },
                timestamp: new Date().toLocaleString("es-HN"),
            };
            console.log("Evento registrado en bitácora:", eventoBitacora);

            setPacienteEnAtencion(null);
            setProcesando(false);
            setDialogoFinalizar(false);

            toast.success("Preclínica finalizada", {
                description: `${pacienteEnAtencion.nombre} fue enviado a espera de consulta médica`,
            });
        }, 1000);
    };

    const [pacienteSeleccionadoIniciar, setPacienteSeleccionadoIniciar] = useState();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
            
            {/* Header */}
            <PageHeader title="Cola de Preclínica" subtitle="Pacientes en espera de registro de signos vitales y preclínica"
                    Icon={Activity} onVolver={onVolver}
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
                                onClick={() => setDialogoFinalizar(true)}
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
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                            <CardTitle>Pacientes en Espera</CardTitle>
                            <CardDescription>
                                {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""} en cola
                            </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {pacientes.length === 0 ? (
                            <div className="text-center py-12">
                                <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    No hay pacientes en espera
                                </h3>
                                <p className="text-gray-600">
                                    Todos los pacientes han sido atendidos en preclínica
                                </p>
                            </div>
                        ) : (
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead>Hora</TableHead>
                                            <TableHead>Paciente</TableHead>
                                            <TableHead>Prioridad</TableHead>
                                            <TableHead>Tipo Ingreso</TableHead>
                                            <TableHead>Motivo</TableHead>
                                            <TableHead className="text-center">Acción</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pacientes
                                            .sort((a, b) => {
                                                const prioridadOrden = { urgente: 0, alta: 1, media: 2, normal: 3 };
                                                return prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad];
                                            })
                                            .map((paciente) => (
                                                <TableRow key={paciente.id} className="hover:bg-gray-50">
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-gray-400" />
                                                            {paciente.horaRegistro}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{paciente.nombre}</p>
                                                            <p className="text-xs text-gray-500">{paciente.identidad}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={getPrioridadConfig(paciente.prioridad).color}>
                                                            {getPrioridadConfig(paciente.prioridad).label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-gray-600">{paciente.tipoIngreso}</TableCell>
                                                    <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                                                        {paciente.motivoConsulta}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            size="sm"
                                                            disabled={!!pacienteEnAtencion}
                                                            onClick={() => {
                                                            setPacienteSeleccionadoIniciar(paciente);
                                                            setDialogoIniciar(true);
                                                            }}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <Play className="h-3 w-3 mr-1" />
                                                            Iniciar
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dialog Iniciar */}
                <AlertDialog open={dialogoIniciar} onOpenChange={setDialogoIniciar}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Iniciar Preclínica?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Está a punto de iniciar la preclínica para{" "}
                                <strong>{pacienteSeleccionadoIniciar?.nombre}</strong>. El estado del paciente
                                cambiará a &quot;En Preclínica&quot;.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={procesando}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleIniciarPreclinica}
                                disabled={procesando}
                                className="bg-green-600 hover:bg-green-700"
                            >
                            {procesando ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Iniciando...
                                </>
                            ) : (
                                <>
                                <Play className="mr-2 h-4 w-4" />
                                Iniciar Preclínica
                                </>
                            )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Dialog Finalizar */}
                <AlertDialog open={dialogoFinalizar} onOpenChange={setDialogoFinalizar}>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Finalizar Preclínica?</AlertDialogTitle>
                        <AlertDialogDescription>
                            La preclínica de <strong>{pacienteEnAtencion?.nombre}</strong> será marcada como
                            completada y el paciente será enviado a la cola de espera de consulta médica.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={procesando}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleFinalizarPreclinica}
                            disabled={procesando}
                            className="bg-green-600 hover:bg-green-700"
                        >
                        {procesando ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Finalizando...
                            </>
                        ) : (
                            <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Finalizar y Enviar a Consulta
                            </>
                        )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </main>
        </div>
    );
}
