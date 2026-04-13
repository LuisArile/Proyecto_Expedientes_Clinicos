import React from "react";
import { useForm } from "react-hook-form";
import { Activity, Search, Loader2 } from "lucide-react";

import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { PageHeader } from "@components/layout/PageHeader";
import { FormField } from "@components/common/FormField";
import { FormSection } from "@components/common/FormSection";
import { StatusModal } from "@components/common/StatusModal";
import { useRegistroPreclinico } from "../hooks/useRegistroPreclinico";

import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";
import { usePacienteSelection } from "@/features/dashboard/hooks/usePacienteSelection";
import { SeccionSignosVitales } from "./SeccionSignosVitales";
import { SeccionAntropometria } from "./SeccionAntropometria";

export function FormularioRegistroPreclinico({ onSuccess, paciente }) {
  const { go } = useSafeNavigation();
  const { selectedPaciente, setSelectedPaciente } = usePacienteSelection();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loading, modal, setModal, enviarRegistro } = useRegistroPreclinico(onSuccess);

  const pacienteParaUsar = paciente || selectedPaciente;

  if (!pacienteParaUsar) return <p>Cargando datos del paciente...</p>;

  const nombreCompleto = pacienteParaUsar.nombrePaciente || `${pacienteParaUsar.nombre} ${pacienteParaUsar.apellido}`;
  const numeroExpediente = pacienteParaUsar.numeroExpediente || pacienteParaUsar.expedientes?.numeroExpediente;

  const onSubmit = (data) => {
    const idExpediente = 
      pacienteParaUsar.expedienteId ||
      pacienteParaUsar.expedientes?.idExpediente ||
      pacienteParaUsar.id;

    const citaId = 
      pacienteParaUsar.citaId || 
      pacienteParaUsar.idCita;

    enviarRegistro(idExpediente, data, citaId);
  };

  const handleCambiarPaciente = () => {
    go("buscar-paciente-preclinica", { modo: "preclinica" });
    setTimeout(() => {
      setSelectedPaciente(null);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <PageHeader
        title="Registro Preclínico"
        subtitle="Registro de signos vitales y datos preliminares"
        Icon={Activity}
        onVolver={() => go("inicio")}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                      Paciente: <strong>{nombreCompleto}</strong> — Exp: <strong>{numeroExpediente}</strong>
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
              <form 
                onSubmit={handleSubmit(
                  (data) => onSubmit(data),
                )} 
                className="space-y-6"
              >
                
                <SeccionSignosVitales register={register} errors={errors}/>

                <SeccionAntropometria register={register} errors={errors}/>

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
                    onClick={() => go("inicio")}
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
      </main>
    </div>
  );
}
