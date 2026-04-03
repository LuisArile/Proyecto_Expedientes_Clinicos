import React from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";

import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useConsultaMedica } from "../hooks/useConsultaMedica";
import { Stethoscope, FileText, Save, Clock, Pill, Plus, Trash2, Loader2 } from "lucide-react";

import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { Card, CardHeader } from "@components/ui/card";
import { FormField } from "@components/common/FormField";
import { PageHeader } from "@components/layout/PageHeader";
import { FormSection } from "@components/common/FormSection";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

import { StatusModal } from "@components/common/StatusModal";

export function ConsultaMedica({ paciente, onVolver, onSuccess }) {
  const { user } = useAuth();

  const methods = useForm({
    defaultValues: { diagnostico: "", tipoDiagnostico: "", observacionesClinicas: "", medicamentos: [] }
  });

  const { register, handleSubmit, control, setValue, formState: { errors } } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: "medicamentos" });
  const tipoDiag = useWatch({ control, name: "tipoDiagnostico" });

  const { guardarConsulta, guardando, modal, setModal } = useConsultaMedica( paciente?.dni || null, methods, onSuccess );

  const alEnviar = async (data) => {
    const idExpediente = paciente?.expedientes?.idExpediente;
    if (!idExpediente) return toast.error("No se pudo identificar el expediente");

    await guardarConsulta(idExpediente, data);

  };

  if (!paciente) {
    return (
      <div className="p-10 text-center">
        <Loader2 className="animate-spin mx-auto h-10 w-10 text-purple-600" />
        <p className="mt-4 text-gray-500">Cargando datos del paciente...</p>
        <Button onClick={onVolver} variant="ghost" className="mt-2">Volver</Button>
      </div>
    );
  }  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
      
      <PageHeader title="Consulta Médica" subtitle={`Atendiendo a: ${paciente.nombre} ${paciente.apellido}`}
        Icon={Stethoscope} onVolver={onVolver} userName={user?.nombre} systemName="Módulo de Atención Clínica"
      />

      <main className="min-h-screen bg-slate-50/50 p-6 space-y-6">
        <Card className="border-purple-100 shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="py-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">Paciente en Consulta</p>
                <h2 className="text-2xl font-bold text-gray-900">{paciente.nombre} {paciente.apellido}</h2>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><FileText className="size-4" /> DNI: {paciente.dni}</span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono">
                    EXP: {paciente.expedientes?.numeroExpediente || "N/A"}
                  </span>
                </div>
              </div>
              <Stethoscope className="text-purple-200 size-12 hidden md:block" />
            </div>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit(alEnviar)} className="space-y-6">
          <Card className="shadow-xl border-none overflow-hidden">
            <Alert className="rounded-none border-x-0 border-t-0 bg-blue-50/50 border-blue-100">
              <Clock className="h-4 w-4 stroke-blue-600" />
              <AlertDescription className="text-blue-700">Atención iniciada el {new Date().toLocaleDateString()}</AlertDescription>
            </Alert>

            <div className="p-8 space-y-8">
              <FormSection title="Diagnóstico y Evaluación">
                <FormField label="Tipo de Diagnóstico" required error={errors.tipoDiagnostico?.message}>
                  <Select value={tipoDiag} onValueChange={(val) => setValue("tipoDiagnostico", val)}>
                    <SelectTrigger className="w-full rounded-lg border-gray-300">
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRESUNTIVO">Presuntivo</SelectItem>
                      <SelectItem value="DEFINITIVO">Definitivo</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Descripción Clínica" required error={errors.diagnostico?.message}>
                    <Textarea 
                      {...register("diagnostico", { required: "El diagnóstico es obligatorio" })}
                      placeholder="Describa el estado del paciente..."
                      className="border border-gray-300 focus-visible:ring-purple-500"
                    />
                  </FormField>
                </div>
              </FormSection>

              <FormSection title="Notas Adicionales">
                <div className="md:col-span-2">
                  <FormField label="Observaciones Privadas">
                    <Textarea 
                      {...register("observacionesClinicas")}
                      placeholder="Notas de seguimiento..."
                      className="border border-gray-300 min-h-[100px] focus-visible:ring-purple-500"
                    />
                  </FormField>
                </div>
              </FormSection>

              {tipoDiag === "DEFINITIVO" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex justify-between items-end border-b border-purple-100 pb-2">
                    <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wider flex items-center gap-2">
                      <Pill className="size-4" /> Plan de Tratamiento
                    </h3>
                    <Button 
                      type="button" variant="outline" size="sm"
                      onClick={() => append({ nombre: "", dosis: "", frecuencia: "", duracion: "" })}
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <Plus className="mr-1 h-4 w-4" /> Agregar Medicamento
                    </Button>
                  </div>

                  {fields.length === 0 ? (
                    <p className="text-center py-8 text-gray-400 italic text-sm border-2 border-dashed border-gray-100 rounded-xl">
                      No hay medicamentos registrados.
                    </p>
                  ) : (
                    <div className="grid gap-3">
                      {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100 group hover:bg-white hover:shadow-md transition-all">
                          <FormField label="Medicamento">
                            <Input {...register(`medicamentos.${index}.nombre`)} placeholder="Ej: Amoxicilina" className="border border-gray-300 focus-visible:ring-purple-500" />
                          </FormField>
                          <FormField label="Dosis">
                            <Input {...register(`medicamentos.${index}.dosis`)} placeholder="Ej: 500 mg" className="border border-gray-300 focus-visible:ring-purple-500" />
                          </FormField>
                          <FormField label="Frecuencia">
                            <Input {...register(`medicamentos.${index}.frecuencia`)} placeholder="Ej: Cada 8 horas" className="border border-gray-300 focus-visible:ring-purple-500" />
                          </FormField>
                          <div className="flex items-end gap-2">
                            <FormField label="Duración" className="flex-1">
                              <Input {...register(`medicamentos.${index}.duracion`)} placeholder="Ej: 7 días" className="border border-gray-300 focus-visible:ring-purple-500" />
                            </FormField>
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 mb-0.5">
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                <Button 
                  type="submit" 
                  disabled={guardando} 
                  className="flex-1 bg-purple-600 hover:bg-purple-700 h-12 text-lg shadow-lg transition-transform active:scale-95"
                >
                  {guardando ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />} 
                  Finalizar y Registrar
                </Button>
                <Button type="button" variant="ghost" onClick={onVolver} className="h-12 px-8 text-gray-500 hover:text-red-600">
                  Descartar cambios
                </Button>
              </div>
            </div>
          </Card>
        </form>

        {modal && (
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
        )}
      </main>
    </div>
  );
}