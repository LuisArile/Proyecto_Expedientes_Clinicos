import React from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useConsultaMedica } from "../hooks/useConsultaMedica";
import { Stethoscope, FileText, Save, Clock, Pill, Plus, Trash2, Loader2, FlaskConical, Library } from "lucide-react";

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

  const [errorValidacion, setErrorValidacion] = React.useState("");

  React.useEffect(() => {
    if (!errorValidacion) return;

    const timer = setTimeout(() => {
      setErrorValidacion("");
    }, 10000); 

    return () => clearTimeout(timer);
  }, [errorValidacion]);

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

  const { register, handleSubmit, control, setValue, formState: { errors } } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: "medicamentos" });

  const { fields: examFields, append: appendExamen, remove: removeExamen } = useFieldArray({ 
    control, 
    name: "examenes" 
  });

  const examenesWatch = useWatch({ control, name: "examenes" });
  const tipoDiag = useWatch({ control, name: "tipoDiagnostico" });

  const { guardarConsulta, guardando, modal, setModal, examenesDisponibles, limpiarBorrador } =
    useConsultaMedica(paciente?.dni || null, methods, onSuccess);

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

      const medicamentoValido = data.medicamentos.some(m => m.nombre);
      if (!medicamentoValido) {
        setErrorValidacion("Debe ingresar al menos un medicamento válido");
        return;
      }
    }

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
      
      <PageHeader 
        title="Consulta Médica" 
        subtitle={`Atendiendo a: ${paciente.nombre} ${paciente.apellido}`}
        Icon={Stethoscope} 
        onVolver={onVolver} 
        userName={user?.nombre} 
        systemName="Módulo de Atención Clínica"
      />

      <main className="min-h-screen bg-slate-50/50 p-6 space-y-6">
        <Card className="border-purple-100 shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="py-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">
                  Paciente en Consulta
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {paciente.nombre} {paciente.apellido}
                </h2>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FileText className="size-4" /> DNI: {paciente.dni}
                  </span>
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
              <AlertDescription className="text-blue-700">
                Atención iniciada el {new Date().toLocaleDateString()}
              </AlertDescription>
            </Alert>

            <div className="p-8 space-y-8">

              {/* DIAGNÓSTICO */}
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
                      {...register("diagnostico", {required: "El diagnóstico es obligatorio", validate: (value) => {
                                                  if (value.trim() === "") {return "No puede estar vacío o solo espacios";}
                                                  if (value.length < 10) {return "Debe tener al menos 10 caracteres";}
                                                  return true;}})}
                      placeholder="Describa el estado del paciente..."
                      className="border border-gray-300 focus-visible:ring-purple-500"
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* NOTAS */}
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

              {/* EXÁMENES */}
              <FormSection title="Exámenes Médicos">
                <div className="space-y-4">

                  <div className="flex justify-between items-end border-b border-purple-100 pb-2">
                    <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wider flex items-center gap-2">
                      <FlaskConical className="size-4" /> Exámenes
                    </h3>

                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendExamen({ examenId: "" })}
                      className="text-purple-600 border-purple-200 hover:bg-purple-50 cursor-pointer"
                    >
                      <Plus className="mr-1 h-4 w-4" /> Agregar Examen
                    </Button>
                  </div>

                  {examFields.length === 0 ? (
                    <p className="text-center py-8 text-gray-400 italic text-sm border-2 border-dashed border-gray-100 rounded-xl">
                      No hay exámenes agregados
                    </p>
                  ) : (
                    <div className="grid gap-3">
                      {examFields.map((field, index) => (
                        <div key={field.id} className="grid w-full grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">

                          <FormField label="Examen">
                            <Select
                              value={examenesWatch?.[index]?.examenId?.toString() || ""}
                              onValueChange={(val) => setValue(`examenes.${index}.examenId`, Number(val))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar examen" />
                              </SelectTrigger>

                              <SelectContent>
                                {examenesDisponibles
                                  ?.filter((ex) => {
                                    return !examenesWatch?.some((e, i) => {
                                      if (i === index) return false; 
                                      return Number(e?.examenId) === ex.id;
                                    });
                                  })
                                  .map((ex) => (
                                    <SelectItem key={ex.id} value={String(ex.id)}>
                                      {ex.nombre} - {ex.especialidad}
                                    </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormField>

                          <FormField label="Prioridad">
                            <Select
                              value={examenesWatch?.[index]?.prioridad || "MEDIA"}
                              onValueChange={(val) => setValue(`examenes.${index}.prioridad`, val)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Prioridad" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BAJA">Baja</SelectItem>
                                <SelectItem value="MEDIA">Media</SelectItem>
                                <SelectItem value="ALTA">Alta</SelectItem>
                                <SelectItem value="URGENTE">Urgente</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormField>

                          <div className="flex items-center justify-center">
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeExamen(index)} className="text-red-400 hover:text-red-600">
                              <Trash2 className="size-5" />
                            </Button>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </FormSection>

              {/* MEDICAMENTOS (RESTAURADO COMPLETO) */}
              {tipoDiag === "DEFINITIVO" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-purple-100 pb-2">
                    <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wider flex items-center gap-2">
                      <Pill className="size-4" /> Plan de Tratamiento
                    </h3>

                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => append({ nombre: "", dosis: "", frecuencia: "", duracion: "" })}
                      className="text-purple-600 border-purple-200 hover:bg-purple-50 cursor-pointer"
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
                        <div
                          key={field.id}
                          className="grid w-full grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100"
                        >

                          {/* MEDICAMENTO */}
                          <FormField label="Medicamento">
                            <Input {...register(`medicamentos.${index}.nombre`)} 
                              className="border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                            />
                          </FormField>

                          {/* DOSIS */}
                          <FormField label="Dosis">
                            <Input {...register(`medicamentos.${index}.dosis`)} 
                              className="border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                            />
                          </FormField>

                          {/* FRECUENCIA */}
                          <FormField label="Frecuencia">
                            <Input {...register(`medicamentos.${index}.frecuencia`)} 
                              className="border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                            />
                          </FormField>

                          {/* DURACIÓN */}
                          <FormField label="Duración">
                            <Input {...register(`medicamentos.${index}.duracion`)} 
                              className="border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                            />
                          </FormField>

                          {/* DELETE */}
                          <div className="flex items-center justify-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="size-5" />
                            </Button>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ALERTA DE VALIDACIÓN */}
              {errorValidacion && (
                <Alert className="border-red-200 bg-red-50 ">
                  <AlertDescription className="text-red-700">
                    {errorValidacion}
                  </AlertDescription>
                </Alert>
              )}

              {/* BOTONES */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                <Button type="submit" disabled={guardando} className="flex-1 bg-purple-600 hover:bg-purple-700 h-12 text-lg">
                  {guardando ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />}
                  Finalizar y Registrar
                </Button>

                <Button type="button" variant="ghost" onClick={() => { limpiarBorrador(); onVolver(); }} 
                        className="h-12 px-8 text-gray-500 hover:text-red-600">
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
              if (modal.result.success) onSuccess?.();
            }}
          />
        )}
      </main>
    </div>
  );
}
