import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Activity, Heart, Thermometer, Weight, Ruler, Search, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "@/components/common/FormSection";
import { StatusModal } from "@/components/common/StatusModal";
import { SearchFilterCard } from "@/features/expedientes/components/SearchFilterCard";
import { useBuscarPacientes } from "@/features/expedientes/hooks/useBuscarPaciente";
import { useRegistroPreclinico } from "../hooks/useRegistroPreclinico";
import { DataTable } from "@/components/common/DataTable";

export function FormularioRegistroPreclinico({ onVolver, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);

  const {
    termino, setTermino,
    criterio, setCriterio,
    buscando,
    resultados,
    busquedaRealizada,
    ejecutarBusqueda,
  } = useBuscarPacientes();

  const { loading, modal, setModal, enviarRegistro } = useRegistroPreclinico(onSuccess);

  const onSubmit = (data) => {
    enviarRegistro(expedienteSeleccionado.idExpediente, data);
  };

  const handleSeleccionarPaciente = (paciente) => {
    const expediente = paciente.expedientes;
    if (!expediente) return;
    setExpedienteSeleccionado({
      idExpediente: expediente.idExpediente,
      numeroExpediente: expediente.numeroExpediente,
      nombrePaciente: `${paciente.nombre} ${paciente.apellido}`,
      dni: paciente.dni,
    });
  };

  const handleCambiarPaciente = () => {
    setExpedienteSeleccionado(null);
    reset();
  };

  const columnasBusqueda = [
    {
      header: "Expediente",
      render: (p) => (
        <span className="font-mono text-sm text-blue-600">
          {p.expedientes?.numeroExpediente || "SIN EXP"}
        </span>
      ),
    },
    {
      header: "Paciente",
      render: (p) => (
        <span className="font-medium text-gray-900">
          {`${p.nombre || ""} ${p.apellido || ""}`}
        </span>
      ),
    },
    {
      header: "Identidad",
      render: (p) => <span className="text-gray-600">{p.dni || "N/A"}</span>,
    },
    {
      header: "Acción",
      className: "text-center",
      render: (p) => (
        <Button
          variant="outline"
          size="sm"
          disabled={!p.expedientes}
          onClick={() => handleSeleccionarPaciente(p)}
          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-300"
        >
          <Activity className="size-4 mr-1" /> Registrar signos
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <PageHeader
        title="Registro Preclínico"
        subtitle="Registro de signos vitales y datos preliminares"
        Icon={Activity}
        onVolver={onVolver}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Paso 1: Buscar y seleccionar paciente */}
        {!expedienteSeleccionado && (
          <div className="space-y-6">
            <SearchFilterCard
              criterio={criterio}
              setCriterio={setCriterio}
              termino={termino}
              setTermino={setTermino}
              onSearch={() => ejecutarBusqueda(1)}
              isLoading={buscando}
            />

            {buscando && (
              <Card className="border-blue-200 shadow-lg">
                <CardContent className="py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                    <p className="text-gray-600">Buscando pacientes...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!buscando && busquedaRealizada && (
              <Card className="shadow-lg border-gray-200 overflow-hidden">
                <DataTable
                  columns={columnasBusqueda}
                  data={resultados}
                  emptyMessage="No se encontraron pacientes."
                />
              </Card>
            )}
          </div>
        )}

        {/* Paso 2: Formulario de signos vitales */}
        {expedienteSeleccionado && (
          <Card className="shadow-lg border-blue-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-green-900">
                      Signos Vitales
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Paciente: <strong>{expedienteSeleccionado.nombrePaciente}</strong> — Exp: <strong>{expedienteSeleccionado.numeroExpediente}</strong>
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCambiarPaciente}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Search className="size-4 mr-1" /> Cambiar paciente
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormSection title="Signos Vitales">
                  <FormField
                    label="Presión Arterial"
                    icon={Heart}
                    required
                    error={errors.presionArterial?.message}
                  >
                    <Input
                      placeholder="Ej: 120/80"
                      {...register("presionArterial", {
                        required: "La presión arterial es obligatoria",
                        pattern: {
                          value: /^\d{2,3}\/\d{2,3}$/,
                          message: "Formato: sistólica/diastólica (ej: 120/80)",
                        },
                      })}
                      className={errors.presionArterial ? "border-red-500" : "border-gray-300"}
                    />
                  </FormField>

                  <FormField
                    label="Temperatura (°C)"
                    icon={Thermometer}
                    required
                    error={errors.temperatura?.message}
                  >
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Ej: 36.5"
                      {...register("temperatura", {
                        required: "La temperatura es obligatoria",
                        min: { value: 30, message: "Mínimo 30°C" },
                        max: { value: 45, message: "Máximo 45°C" },
                      })}
                      className={errors.temperatura ? "border-red-500" : "border-gray-300"}
                    />
                  </FormField>

                  <FormField
                    label="Frecuencia Cardíaca (lpm)"
                    icon={Activity}
                    required
                    error={errors.frecuenciaCardiaca?.message}
                  >
                    <Input
                      type="number"
                      placeholder="Ej: 72"
                      {...register("frecuenciaCardiaca", {
                        required: "La frecuencia cardíaca es obligatoria",
                        min: { value: 30, message: "Mínimo 30 lpm" },
                        max: { value: 250, message: "Máximo 250 lpm" },
                      })}
                      className={errors.frecuenciaCardiaca ? "border-red-500" : "border-gray-300"}
                    />
                  </FormField>
                </FormSection>

                <FormSection title="Medidas Antropométricas">
                  <FormField
                    label="Peso (kg)"
                    icon={Weight}
                    required
                    error={errors.peso?.message}
                  >
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Ej: 70.5"
                      {...register("peso", {
                        required: "El peso es obligatorio",
                        min: { value: 0.5, message: "Mínimo 0.5 kg" },
                        max: { value: 500, message: "Máximo 500 kg" },
                      })}
                      className={errors.peso ? "border-red-500" : "border-gray-300"}
                    />
                  </FormField>

                  <FormField
                    label="Talla (cm)"
                    icon={Ruler}
                    required
                    error={errors.talla?.message}
                  >
                    <Input
                      type="number"
                      placeholder="Ej: 170"
                      {...register("talla", {
                        required: "La talla es obligatoria",
                        min: { value: 20, message: "Mínimo 20 cm" },
                        max: { value: 300, message: "Máximo 300 cm" },
                      })}
                      className={errors.talla ? "border-red-500" : "border-gray-300"}
                    />
                  </FormField>
                </FormSection>

                <FormSection title="Observaciones">
                  <div className="md:col-span-2">
                    <FormField
                      label="Observaciones adicionales"
                      error={errors.observaciones?.message}
                    >
                      <Textarea
                        placeholder="Notas relevantes sobre el estado del paciente..."
                        {...register("observaciones", {
                          maxLength: { value: 500, message: "Máximo 500 caracteres" },
                        })}
                        className={`resize-none min-h-[100px] ${errors.observaciones ? "border-red-500" : "border-gray-300"}`}
                      />
                    </FormField>
                  </div>
                </FormSection>

                <div className="flex gap-4 pt-6 border-t mt-8">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 h-11 text-base font-semibold transition-all shadow-md"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      "Registrar Signos Vitales"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onVolver}
                    className="flex-1 h-11 text-base border-gray-300 hover:bg-gray-50"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>

              <StatusModal
                isOpen={modal.open}
                result={modal.result}
                onClose={() => {
                  setModal({ ...modal, open: false });
                  if (modal.result.success) {
                    onSuccess?.();
                  }
                }}
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
