import React, { useEffect, useMemo, useState } from "react";
import { BadgeCheck, FileText, IdCard, Mail, MapPin, Phone, Save, User, UserRound, X } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/features/auth/useAuth";
import { actualizarExpediente, obtenerExpediente, obtenerExpedientePorPaciente } from "../services/expedienteService";

function mapearFormularioDesdeExpediente(expediente) {
  const paciente = expediente?.paciente || {};
  const fechaNacimiento = paciente.fechaNacimiento
    ? (typeof paciente.fechaNacimiento === "string"
      ? paciente.fechaNacimiento.split("T")[0]
      : new Date(paciente.fechaNacimiento).toISOString().split("T")[0])
    : "";

  return {
    nombre: paciente.nombre || "",
    apellido: paciente.apellido || "",
    dni: paciente.dni || "",
    fechaNacimiento,
    sexo: paciente.sexo || "",
    correo: paciente.correo || "",
    telefono: paciente.telefono || "",
    direccion: paciente.direccion || "",
  };
}

export function VistaExpedientePaciente({ pacienteSeleccionado, onVolver, onActualizado }) {
  const { user } = useAuth();
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [expediente, setExpediente] = useState(null);
  const [formData, setFormData] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState("");
  const [confirmacion, setConfirmacion] = useState("");

  const rol = (user?.rol || "").toUpperCase();
  const puedeEditar = rol === "RECEPCIONISTA" || rol === "ADMINISTRADOR" || rol === "ADMIN";

  const idExpediente = useMemo(() => {
    return pacienteSeleccionado?.expedientes?.idExpediente || pacienteSeleccionado?.idExpediente || null;
  }, [pacienteSeleccionado]);

  useEffect(() => {
    const cargarExpediente = async () => {
      setCargando(true);
      setError("");
      setConfirmacion("");

      try {
        let data;

        if (idExpediente) {
          data = await obtenerExpediente(idExpediente);
        } else if (pacienteSeleccionado?.idPaciente) {
          data = await obtenerExpedientePorPaciente(pacienteSeleccionado.idPaciente);
        } else {
          throw new Error("No se pudo identificar el expediente del paciente seleccionado");
        }

        setExpediente(data);
        setFormData(mapearFormularioDesdeExpediente(data));
      } catch (err) {
        setError(err.message || "No se pudo cargar el expediente");
      } finally {
        setCargando(false);
      }
    };

    cargarExpediente();
  }, [idExpediente, pacienteSeleccionado]);

  const actualizarCampo = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setConfirmacion("");
    if (expediente) {
      setFormData(mapearFormularioDesdeExpediente(expediente));
    }
  };

  const guardarCambios = async () => {
    if (!expediente?.idExpediente || !formData) {
      return;
    }

    setGuardando(true);
    setError("");
    setConfirmacion("");

    try {
      const payload = {
        paciente: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          dni: formData.dni,
          fechaNacimiento: formData.fechaNacimiento,
          sexo: formData.sexo,
          correo: formData.correo || null,
          telefono: formData.telefono,
          direccion: formData.direccion,
        },
      };

      const response = await actualizarExpediente(expediente.idExpediente, payload);
      const dataActualizada = response?.data || response;

      setExpediente(dataActualizada);
      setFormData(mapearFormularioDesdeExpediente(dataActualizada));
      setModoEdicion(false);
      setConfirmacion("Datos personales actualizados correctamente.");
      onActualizado?.(dataActualizada);
    } catch (err) {
      setError(err.message || "No se pudo actualizar el expediente");
    } finally {
      setGuardando(false);
    }
  };

  const codigoExpediente = expediente?.numeroExpediente || pacienteSeleccionado?.expedientes?.numeroExpediente || "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <PageHeader
        title="Expediente del Paciente"
        subtitle={`Código: ${codigoExpediente}`}
        Icon={FileText}
        onVolver={onVolver}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg border-blue-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold text-blue-900 flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-blue-600 text-white">
                    <UserRound className="size-6" />
                  </span>
                  Informacion del Paciente
                </h2>
                <p className="text-sm text-gray-600 mt-2">Datos personales y de contacto</p>
              </div>

              <div className="rounded-full border px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50">
                {modoEdicion ? "Edicion habilitada" : "Solo Lectura"}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {confirmacion && (
              <Alert variant="success">
                <BadgeCheck className="h-4 w-4" />
                <AlertTitle>Actualizacion completada</AlertTitle>
                <AlertDescription>{confirmacion}</AlertDescription>
              </Alert>
            )}

            {cargando && (
              <div className="py-10 text-center text-gray-600">Cargando expediente...</div>
            )}

            {!cargando && formData && (
              <>
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 sm:p-5 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm text-blue-900 font-medium">Codigo de Expediente</p>
                    <p className="text-2xl font-semibold tracking-wide text-blue-800">{codigoExpediente}</p>
                  </div>
                  <span className="text-xs text-gray-600 px-2 py-1 rounded-full bg-gray-100">No editable</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="size-4 text-blue-600" />
                      Nombres
                    </label>
                    <Input
                      value={formData.nombre}
                      onChange={(e) => actualizarCampo("nombre", e.target.value)}
                      disabled={!modoEdicion}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="size-4 text-blue-600" />
                      Apellidos
                    </label>
                    <Input
                      value={formData.apellido}
                      onChange={(e) => actualizarCampo("apellido", e.target.value)}
                      disabled={!modoEdicion}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <IdCard className="size-4 text-blue-600" />
                      Numero de Identidad
                    </label>
                    <Input
                      value={formData.dni}
                      onChange={(e) => actualizarCampo("dni", e.target.value)}
                      disabled={!modoEdicion}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                    <Input
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={(e) => actualizarCampo("fechaNacimiento", e.target.value)}
                      disabled={!modoEdicion}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Genero</label>
                    <Select
                      value={formData.sexo || ""}
                      onValueChange={(value) => actualizarCampo("sexo", value)}
                      disabled={!modoEdicion}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Hombre</SelectItem>
                        <SelectItem value="femenino">Mujer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="size-4 text-blue-600" />
                      Telefono
                    </label>
                    <Input
                      value={formData.telefono}
                      onChange={(e) => actualizarCampo("telefono", e.target.value)}
                      disabled={!modoEdicion}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="size-4 text-blue-600" />
                      Correo Electronico
                    </label>
                    <Input
                      type="email"
                      value={formData.correo}
                      onChange={(e) => actualizarCampo("correo", e.target.value)}
                      disabled={!modoEdicion}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="size-4 text-blue-600" />
                      Direccion
                    </label>
                    <Textarea
                      value={formData.direccion}
                      onChange={(e) => actualizarCampo("direccion", e.target.value)}
                      disabled={!modoEdicion}
                      className="resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t flex flex-col sm:flex-row gap-3">
                  {puedeEditar && !modoEdicion && (
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => setModoEdicion(true)}>
                      Editar Datos
                    </Button>
                  )}

                  {puedeEditar && modoEdicion && (
                    <>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={guardarCambios} disabled={guardando}>
                        <Save className="size-4 mr-2" />
                        {guardando ? "Guardando..." : "Guardar cambios"}
                      </Button>
                      <Button className="flex-1" variant="outline" onClick={cancelarEdicion} disabled={guardando}>
                        <X className="size-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  )}

                  <Button className="flex-1" variant="outline" onClick={onVolver}>
                    Regresar
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
