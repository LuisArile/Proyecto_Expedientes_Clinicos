import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { Stethoscope, Clock, Play, CheckCircle2, User, Loader2, Activity } from "lucide-react";
import { toast } from "sonner";
// import { useAuth } from "../context/auth-context";
import { PageHeader } from "@components/layout/PageHeader";

const pacientesSimulados = [
    {
        id: "PAC-004",
        nombre: "Luis Rodríguez",
        identidad: "0801-1988-45678",
        prioridad: "media",
        tipoIngreso: "subsecuente",
        motivoConsulta: "Seguimiento post-operatorio",
        horaRegistro: "08:15",
        resumenPreclinico: {
        presion: "120/80 mmHg",
        temperatura: "36.5°C",
        peso: "75 kg",
        enfermero: "Juan Pérez",
        },
    },
];

export function ColaConsulta(onVolver) {
//  const { user } = useAuth();
    const [pacientes, setPacientes] = useState(pacientesSimulados);
    const [pacienteEnAtencion, setPacienteEnAtencion] = useState();
    const [dialogoIniciar, setDialogoIniciar] = useState(false);
    const [dialogoFinalizar, setDialogoFinalizar] = useState(false);
    const [procesando, setProcesando] = useState(false);
    const [pacienteSeleccionadoIniciar, setPacienteSeleccionadoIniciar] = useState();

    const getPrioridadConfig = (prioridad) => {
        const configs = {
            normal: { label: "Normal", color: "bg-green-100 text-green-800 border-green-300" },
            media: { label: "Media", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
            alta: { label: "Alta", color: "bg-orange-100 text-orange-800 border-orange-300" },
            urgente: { label: "Urgente", color: "bg-red-100 text-red-800 border-red-300" },
        };
        return configs[prioridad];
    };

    const handleIniciarConsulta = () => {
        if (!pacienteSeleccionadoIniciar) return;
        setProcesando(true);

        setTimeout(() => {
        // Registrar en bitácora
        const eventoBitacora = {
            tipo: "INICIO_CONSULTA",
            // usuario: user?.username,
            // rol: user?.role,
            accion: `Consulta médica iniciada para ${pacienteSeleccionadoIniciar.nombre}`,
            detalles: {
                pacienteId: pacienteSeleccionadoIniciar.id,
                paciente: pacienteSeleccionadoIniciar.nombre,
                estadoAnterior: "espera-consulta",
                estadoNuevo: "en-consulta",
                // doctor: user?.name,
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

        toast.success("Consulta médica iniciada", {
            description: `Ahora está atendiendo a ${pacienteSeleccionadoIniciar.nombre}`,
        });
        }, 1000);
    };

    const handleFinalizarConsulta = () => {
        if (!pacienteEnAtencion) return;
        setProcesando(true);

        setTimeout(() => {
        // Registrar en bitácora
        const eventoBitacora = {
            tipo: "FIN_CONSULTA",
            // usuario: user?.username,
            // rol: user?.role,
            accion: `Consulta médica finalizada para ${pacienteEnAtencion.nombre}`,
            detalles: {
                pacienteId: pacienteEnAtencion.id,
                paciente: pacienteEnAtencion.nombre,
                estadoAnterior: "en-consulta",
                estadoNuevo: "finalizado",
                // doctor: user?.name,
                horaFin: new Date().toLocaleTimeString("es-HN"),
            },
            timestamp: new Date().toLocaleString("es-HN"),
        };
        console.log("Evento registrado en bitácora:", eventoBitacora);

        setPacienteEnAtencion(null);
        setProcesando(false);
        setDialogoFinalizar(false);

        toast.success("Consulta médica finalizada", {
            description: `La atención de ${pacienteEnAtencion.nombre} ha sido completada`,
        });
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
            {/* Header */}
            <PageHeader title="Cola de Consulta Médica" subtitle="Pacientes en espera de consulta médica con resumen preclínico"
                    Icon={Stethoscope} onVolver={onVolver}
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
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {pacienteEnAtencion.nombre}
                                        </h3>
                                        <p className="text-sm text-gray-600">ID: {pacienteEnAtencion.identidad}</p>
                                        <Badge
                                            variant="outline"
                                            className={getPrioridadConfig(pacienteEnAtencion.prioridad).color}
                                        >
                                            {getPrioridadConfig(pacienteEnAtencion.prioridad).label}
                                        </Badge>
                                    </div>
                                    <Button
                                        onClick={() => setDialogoFinalizar(true)}
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Finalizar Consulta
                                    </Button>
                                </div>

                                {pacienteEnAtencion.resumenPreclinico && (
                                    <div className="p-3 bg-white rounded-lg border border-purple-200">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-purple-600" />
                                            Resumen Preclínico
                                        </h4>
                                        <div className="grid grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <p className="text-gray-600">Presión Arterial</p>
                                                <p className="font-medium text-gray-900">
                                                    {pacienteEnAtencion.resumenPreclinico.presion}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Temperatura</p>
                                                <p className="font-medium text-gray-900">
                                                    {pacienteEnAtencion.resumenPreclinico.temperatura}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Peso</p>
                                                <p className="font-medium text-gray-900">
                                                    {pacienteEnAtencion.resumenPreclinico.peso}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Registrado por: {pacienteEnAtencion.resumenPreclinico.enfermero}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Lista de Espera */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Pacientes en Espera de Consulta</CardTitle>
                                <CardDescription>
                                    {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""} listo
                                    {pacientes.length !== 1 ? "s" : ""} para consulta
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {pacientes.length === 0 ? (
                            <div className="text-center py-12">
                                <CheckCircle2 className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    No hay pacientes en espera
                                </h3>
                                <p className="text-gray-600">Todos los pacientes han sido atendidos</p>
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
                                            <TableHead>Preclínico</TableHead>
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
                                                        <Badge
                                                            variant="outline"
                                                            className={getPrioridadConfig(paciente.prioridad).color}
                                                        >
                                                            {getPrioridadConfig(paciente.prioridad).label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-gray-600">
                                                        {paciente.tipoIngreso}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                                                        {paciente.motivoConsulta}
                                                    </TableCell>
                                                    <TableCell>
                                                        {paciente.resumenPreclinico ? (
                                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                Completado
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">
                                                                Pendiente
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            size="sm"
                                                            disabled={!!pacienteEnAtencion}
                                                            onClick={() => {
                                                            setPacienteSeleccionadoIniciar(paciente);
                                                            setDialogoIniciar(true);
                                                            }}
                                                            className="bg-purple-600 hover:bg-purple-700"
                                                        >
                                                            <Play className="h-3 w-3 mr-1" />
                                                            Iniciar
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
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
                            <AlertDialogTitle>¿Iniciar Consulta Médica?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Está a punto de iniciar la consulta médica para{" "}
                                <strong>{pacienteSeleccionadoIniciar?.nombre}</strong>. El estado del paciente
                                cambiará a &quot;En Consulta&quot;.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={procesando}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleIniciarConsulta}
                                disabled={procesando}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {procesando ? (
                                    <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Iniciando...
                                    </>
                                ) : (
                                    <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Iniciar Consulta
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
                            <AlertDialogTitle>¿Finalizar Consulta Médica?</AlertDialogTitle>
                            <AlertDialogDescription>
                                La consulta médica de <strong>{pacienteEnAtencion?.nombre}</strong> será marcada
                                como completada. La atención del paciente habrá finalizado.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={procesando}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleFinalizarConsulta}
                                disabled={procesando}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {procesando ? (
                                    <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Finalizando...
                                    </>
                                ) : (
                                    <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Finalizar Atención
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
