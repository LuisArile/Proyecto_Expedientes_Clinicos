import React from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useConsultaMedica } from "../hooks/useConsultaMedica";
import { Stethoscope, FileText, Save, Clock, Pill, Plus, Trash2, Loader2, Search } from "lucide-react";

import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@components/ui/card";
import { FormField } from "@components/common/FormField";
import { PageHeader } from "@components/layout/PageHeader";
import { FormSection } from "@components/common/FormSection";
import { Alert, AlertDescription } from "@components/ui/alert";
import { ValidatedInput } from "@components/validaciones/validarInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

import { StatusModal } from "@components/common/StatusModal";

import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";
import { usePacienteSelection } from "@/features/dashboard/hooks/usePacienteSelection";
import { useTriajeState } from "@/features/dashboard/hooks/useTriajeState";

export function ConsultaMedica({ onSuccess }) {
  const { user } = useAuth();
  const { go } = useSafeNavigation();
  const { selectedPaciente, setSelectedPaciente } = usePacienteSelection();
  const { pacienteEnAtencion } = useTriajeState();

  const paciente = pacienteEnAtencion || selectedPaciente;

  const methods = useForm({
    mode: "onChange",
    defaultValues: { 
      diagnostico: "", 
      tipoDiagnostico: "", 
      observacionesClinicas: "", 
      medicamentos: [],
      examenes: []
    }
  });

  const { 
    register, handleSubmit, control, setValue, formState: { errors } } 
    = methods;
  
  const { 
    fields, append, remove } 
    = useFieldArray({ control, name: "medicamentos" });

  const tipoDiag = useWatch({ control, name: "tipoDiagnostico" });

  const { guardarConsulta, guardando, modal, setModal } = useConsultaMedica( 
    paciente?.dni || null, 
    methods, 
    onSuccess );

  const alEnviar = async (data) => {
    setErrorValidacion("");

    const idExpediente = paciente?.expedientes?.idExpediente;
    if (!idExpediente) {
      setErrorValidacion("No se pudo identificar el expediente");
      return;
    }

    if (data.tipoDiagnostico === "PRESUNTIVO") {
      if (!data.examenes || data.examenes.length === 0) {
        setErrorValidacion("Debe agregar al menos un examen para diagnóstico presuntivo");
        return;
      }

      const examenValido = data.examenes.some(e => e.examenId);
      if (!examenValido) {
        setErrorValidacion("Debe seleccionar al menos un examen válido");
        return;
      }
    }

    if (data.tipoDiagnostico === "DEFINITIVO") {
      if (!data.medicamentos || data.medicamentos.length === 0) {
        setErrorValidacion("Debe agregar al menos un medicamento para diagnóstico definitivo");
        return;
      }

      const medicamentoValido = data.medicamentos.some(m => m.medicamentoId);
      if (!medicamentoValido) {
        setErrorValidacion("Debe ingresar al menos un medicamento válido");
        return;
      }
    }

    await guardarConsulta(idExpediente, data);

  };

  const handleCambiarPaciente = () => {
    go("buscar-paciente-consulta");
    setSelectedPaciente(null);
    
  };

  if (!paciente) return null; 

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50 pb-10">
      
      <PageHeader title="Consulta Médica" subtitle={`Atendiendo a: ${paciente.nombre} ${paciente.apellido}`}
        Icon={Stethoscope} onVolver={() => go("inicio")} userName={user?.nombre} systemName="Módulo de Atención Clínica"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg border-blue-100">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-purple-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                    <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-green-900">
                    Paciente en Consulta
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Paciente: <strong>{paciente.nombre} {paciente.apellido}</strong> — Exp: <strong>{paciente.expedientes?.numeroExpediente || "N/A"}</strong>
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
        
          <CardContent>
            <form onSubmit={handleSubmit(alEnviar)} className="space-y-6">
                <Alert className="rounded-none border-x-0 border-t-0 bg-blue-50/50 border-blue-100">
                  <Clock className="h-4 w-4 stroke-blue-600" />
                  <AlertDescription className="text-blue-700">Atención iniciada el {new Date().toLocaleDateString()}</AlertDescription>
                </Alert>

                <div className="space-y-8">
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
                    <Button type="button" variant="ghost" onClick={() => go("inicio")} className="h-12 px-8 text-gray-500 hover:text-red-600">
                      Descartar cambios
                    </Button>
                  </div>
                </div>
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
