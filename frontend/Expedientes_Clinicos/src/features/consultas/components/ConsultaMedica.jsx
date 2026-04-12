import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useConsultaMedica } from "../hooks/useConsultaMedica";
import { useDocumentos } from "../hooks/useDocumentos";
import { useConsultaContext } from "../hooks/useConsultaContext";
import { obtenerConsultaPorId } from "../services/consultaService";
import { Stethoscope, Save, Clock, Loader2, Search, Eye, ArrowLeft } from "lucide-react";

import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@components/ui/card";
import { FormField } from "@components/common/FormField";
import { PageHeader } from "@components/layout/PageHeader";
import { FormSection } from "@components/common/FormSection";
import { Alert, AlertDescription } from "@components/ui/alert";

import { SeccionExamenes } from "./SeccionExamenes";
import { SeccionTratamiento } from "./SeccionTratamiento";
import { SeccionDiagnostico } from "./SeccionDiagnostico";
import { SeccionDocumentos } from "./SeccionDocumentos";

import { StatusModal } from "@components/common/StatusModal";

import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";
import { usePacienteSelection } from "@/features/dashboard/hooks/usePacienteSelection";
import { useTriajeState } from "@/features/dashboard/hooks/useTriajeState";

export function ConsultaMedica({ onSuccess, viewConfig }) {
  const { user } = useAuth();
  const { go } = useSafeNavigation();
  const { selectedPaciente, setSelectedPaciente } = usePacienteSelection();
  const { pacienteEnAtencion } = useTriajeState();
  const { consultaId: contextConsultaId } = useConsultaContext();
  const [errorValidacion, setErrorValidacion] = useState("");
  const [cargandoConsulta, setCargandoConsulta] = useState(false);
  const [nuevoConsultaId, setNuevoConsultaId] = useState(null);

  const esVisualizacion = viewConfig?.id === "ver-consulta";
  const consultaIdActual = esVisualizacion ? contextConsultaId : null;

  const paciente = pacienteEnAtencion || selectedPaciente;

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      diagnostico: "",
      tipoDiagnostico: "",
      observacionesClinicas: "",
      medicamentos: [],
      examenes: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  const tipoDiag = useWatch({ control, name: "tipoDiagnostico" });

  // Hook para documentos - usar consultaIdActual si es visualización, sino null
  const {
    documentos,
    documentosPendientes,
    cargando: cargandoDocumentos,
    subiendo,
    subiendoCount,
    error: errorDocumentos,
    agregarDocumento,
    removerDocumentoPendiente,
    subirDocumentosPendientes,
    eliminarDoc,
  } = useDocumentos(consultaIdActual);

  // Cargar datos de la consulta si es visualización
  useEffect(() => {
    if (esVisualizacion && consultaIdActual) {
      const cargarConsulta = async () => {
        setCargandoConsulta(true);
        try {
          const consulta = await obtenerConsultaPorId(consultaIdActual);
          if (consulta) {
            // Parse diagnóstico si es string JSON
            let diagnosticoObj = { descripcion: "", tipo: "PRESUNTIVO" };
            if (typeof consulta.diagnostico === 'string') {
              try {
                diagnosticoObj = JSON.parse(consulta.diagnostico);
              } catch {
                diagnosticoObj.descripcion = consulta.diagnostico;
              }
            } else {
              diagnosticoObj = consulta.diagnostico;
            }

            // Pre-rellenar el formulario
            reset({
              diagnostico: diagnosticoObj.descripcion || "",
              tipoDiagnostico: diagnosticoObj.tipo || "PRESUNTIVO",
              observacionesClinicas: consulta.observaciones || "",
              medicamentos: consulta.recetas || [],
              examenes: consulta.examenes || [],
            });
          }
        } catch (err) {
          console.error("Error cargando consulta:", err);
          setErrorValidacion("Error al cargar la consulta");
        } finally {
          setCargandoConsulta(false);
        }
      };

      cargarConsulta();
    }
  }, [esVisualizacion, consultaIdActual, reset]);

  const {
    guardarConsulta,
    guardando,
    modal,
    setModal,
    examenesDisponibles,
    limpiarBorrador,
    medicamentosDisponibles,
  } = useConsultaMedica(paciente?.dni || null, methods, onSuccess);

  const alEnviar = async (data) => {
    // No permitir envío en modo visualización
    if (esVisualizacion) return;

    setErrorValidacion("");
    const idExpediente = paciente?.expedientes?.idExpediente;

    if (!idExpediente) {
      setErrorValidacion("No se pudo identificar el expediente");
      return;
    }

    if (data.tipoDiagnostico === "PRESUNTIVO") {
      if (!data.examenes || data.examenes.length === 0) {
        setErrorValidacion(
          "Debe agregar al menos un examen para diagnóstico presuntivo"
        );
        return;
      }
      const examenValido = data.examenes.some((e) => e.examenId);
      if (!examenValido) {
        setErrorValidacion(
          "Debe seleccionar al menos un examen válido"
        );
        return;
      }
    }

    if (data.tipoDiagnostico === "DEFINITIVO") {
      if (!data.medicamentos || data.medicamentos.length === 0) {
        setErrorValidacion(
          "Debe agregar al menos un medicamento para diagnóstico definitivo"
        );
        return;
      }

      const medicamentoValido = data.medicamentos.some(
        (m) => m.medicamentoId
      );
      if (!medicamentoValido) {
        setErrorValidacion(
          "Debe ingresar al menos un medicamento válido"
        );
        return;
      }
    }

    try {
      // Guardar consulta primero
      const response = await guardarConsulta(idExpediente, data);
      
      // Si la consulta se guardó exitosamente, obtener el ID
      if (response?.data?.id) {
        const newConsultaId = response.data.id;
        setNuevoConsultaId(newConsultaId);

        // Si hay documentos pendientes, subirlos
        if (documentosPendientes.length > 0) {
          try {
            await subirDocumentosPendientes(newConsultaId);
          } catch (err) {
            console.error("Error subiendo documentos:", err);
            // Continuar aunque falle la carga de documentos
          }
        }
      }
    } catch (err) {
      console.error("Error en alEnviar:", err);
    }
  };

  const handleCambiarPaciente = () => {
    go("buscar-paciente-consulta", { modo: "consulta-medica" });
    setSelectedPaciente(null);
  };

  if (!paciente) return null;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gradient-to-br from-purple-50 via-white to-gray-50">
      <PageHeader
        title="Consulta Médica"
        subtitle={`Atendiendo a: ${paciente.nombre} ${paciente.apellido}`}
        Icon={Stethoscope}
        onVolver={() => go("inicio")}
        userName={user?.nombre}
        systemName="Módulo de Atención Clínica"
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg border-blue-100">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-purple-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg shadow-md">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-green-900 font-bold">
                    Paciente en Consulta
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Paciente:{" "}
                    <strong>
                      {paciente.nombre} {paciente.apellido}
                    </strong>{" "}
                    — Exp:{" "}
                    <span className="font-semibold text-purple-700">
                      {paciente.expedientes?.numeroExpediente || "N/A"}
                    </span>
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCambiarPaciente}
                className="text-gray-600"
              >
                <Search className="size-4 mr-1" /> Cambiar paciente
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6 pb-6">
            <form
              onSubmit={handleSubmit(alEnviar)}
              className="space-y-6"
            >
              {cargandoConsulta ? (
                <Alert className="bg-blue-50/50 border-blue-100 mb-6 flex items-center justify-center h-24">
                  <Loader2 className="h-6 w-6 stroke-blue-600 animate-spin mr-3" />
                  <AlertDescription className="text-blue-700 font-medium">
                    Cargando datos de la consulta...
                  </AlertDescription>
                </Alert>
              ) : esVisualizacion ? (
                <Alert className="bg-blue-50/50 border-blue-100 mb-6">
                  <Eye className="h-4 w-4 stroke-blue-600" />
                  <AlertDescription className="text-blue-700 font-medium">
                    Consulta Médica en Modo de Visualización - CONS-{consultaIdActual}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-blue-50/50 border-blue-100 mb-6">
                  <Clock className="h-4 w-4 stroke-blue-600" />
                  <AlertDescription className="text-blue-700 font-medium">
                    Atención iniciada el{" "}
                    {new Date().toLocaleDateString()}
                  </AlertDescription>
                </Alert>
              )}

              {/* DIAGNÓSTICO */}
              <SeccionDiagnostico
                register={register}
                errors={errors}
                tipoDiag={tipoDiag}
                setValue={setValue}
                disabled={esVisualizacion}
              />

              {/* NOTAS */}
              <FormSection title="Notas Adicionales">
                <div className="md:col-span-2">
                  <FormField label="Observaciones Privadas">
                    <Textarea
                      {...register("observacionesClinicas")}
                      placeholder="Notas de seguimiento..."
                      disabled={esVisualizacion}
                      className="border border-gray-300 min-h-[100px] focus-visible:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* EXÁMENES */}
              <SeccionExamenes
                control={control}
                setValue={setValue}
                disponibles={examenesDisponibles}
              />

              {/* DOCUMENTOS ADJUNTOS */}
              <SeccionDocumentos
                documentosPendientes={documentosPendientes}
                documentos={documentos}
                subiendo={subiendo}
                subiendoCount={subiendoCount}
                cargando={cargandoDocumentos}
                error={errorDocumentos}
                onAgregarDocumento={agregarDocumento}
                onRemoverDocumentoPendiente={removerDocumentoPendiente}
                onEliminarDocumento={eliminarDoc}
                disabled={esVisualizacion}
              />

              {/* MEDICAMENTOS */}
              {tipoDiag === "DEFINITIVO" && (
                <SeccionTratamiento
                  control={control}
                  register={register}
                  setValue={setValue}
                  disponibles={medicamentosDisponibles}
                  errors={errors}
                />
              )}

              {/* ALERTA DE VALIDACIÓN */}
              {errorValidacion && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {errorValidacion}
                  </AlertDescription>
                </Alert>
              )}

              {/* BOTONES */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                {esVisualizacion ? (
                  <>
                    <Button
                      type="button"
                      onClick={() => go("gestion-pacientes")}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold shadow-lg transition-all active:scale-95"
                    >
                      <ArrowLeft className="mr-2" />
                      Volver al Expediente
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="submit"
                      disabled={guardando || subiendo}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 h-12 text-lg font-semibold shadow-lg transition-all active:scale-95"
                      title={documentosPendientes.length > 0 ? `Guardará la consulta y subirá ${documentosPendientes.length} documento(s)` : ""}
                    >
                      {guardando || subiendo ? (
                        <Loader2 className="animate-spin mr-2" />
                      ) : (
                        <Save className="mr-2" />
                      )}
                      {guardando ? "Registrando..." : subiendo ? "Subiendo documentos..." : "Finalizar Consulta"}
                      {documentosPendientes.length > 0 && !guardando && !subiendo && (
                        <span className="ml-2 text-xs bg-orange-200 text-orange-900 px-2 py-1 rounded-full">
                          +{documentosPendientes.length} doc
                        </span>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => go("inicio")}
                      disabled={guardando || subiendo}
                      className="h-12 px-8 text-gray-500 hover:text-red-600"
                    >
                      Descartar cambios
                    </Button>
                  </>
                )}
              </div>
            </form>

            {modal && (
              <StatusModal
                isOpen={modal.open}
                result={modal.result}
                onClose={() => {
                  setModal({ ...modal, open: false });
                  if (modal.result.success) {
                    limpiarBorrador();
                    // Navegar a la consulta en modo visualización
                    if (nuevoConsultaId) {
                      go("ver-consulta", { consultaId: nuevoConsultaId });
                    } else {
                      onSuccess?.();
                    }
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