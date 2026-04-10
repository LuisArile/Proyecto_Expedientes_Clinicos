import { useEffect } from "react";
import { useForm, useWatch } from 'react-hook-form';
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Badge } from "@components/ui/badge";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Loader2, CalendarIcon, UserPlus, CheckCircle2, Clock, User, Phone, FileText } from "lucide-react";
import { FormField } from "@components/common/FormField";
import { FormHeader } from "@components/common/FormHeader";
import { FormSection } from "@components/common/FormSection";
import { PageHeader } from "@components/layout/PageHeader";
import { useExpedienteContext } from "../../expedientes/hooks/useExpedienteContext";
import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";

export function FormularioCita({ viewConfig }) {

  const { paciente } = useExpedienteContext();
  const { go } = useSafeNavigation();

  const targetBack = viewConfig?.parent || "agenda-citas";

  const modo = viewConfig?.metadata?.modo || "agendar";
  const esHoy = modo === "hoy";

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      prioridad: "normal",
      tipoIngreso: "primera-vez",
      fechaCita: esHoy ? new Date().toISOString().split("T")[0] : ""
    }
  });

  useEffect(() => {
    if (paciente) {
        setValue("nombrePaciente", `${paciente.nombre} ${paciente.apellido}`);
        setValue("identidad", paciente.dni);
        setValue("telefono", paciente.telefono || "");
    }
  }, [paciente, setValue]);

  const procesando = false;

  const prioridadSeleccionada = useWatch({
    control: control,
    name: "prioridad",
  });

  const tipoIngresoSeleccionado = useWatch({
    control: control,
    name: "tipoIngreso",
  });

  const onSubmit = (data) => {
    console.log(`Datos enviados (${modo}):`, data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">

      <PageHeader 
        title="Programar Cita Futura" subtitle="Reserva de cupo para fecha posterior" Icon={FileText} 
        onVolver={() => go(targetBack)}
      />
      
      <Card className="w-full max-w-3xl mx-auto shadow-lg border-blue-100 mt-4 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 p-0">
          <FormHeader 
            title={esHoy ? "Registro de Paciente - Hoy" : "Programar Cita Futura"}
            subtitle={esHoy ? "Ingreso directo a flujo de atención" : "Reserva de cupo para fecha posterior"}
            icon={esHoy ? UserPlus : CalendarIcon}
            align="left"
          />
        </CardHeader> 

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            <FormSection title="Información del Paciente">
              <FormField label="Nombre Completo" icon={User} error={errors.nombrePaciente?.message} required>
                <Input disabled {...register("nombrePaciente")}/>
              </FormField>

              <FormField label="Número de Identidad" icon={FileText} error={errors.identidad?.message} required>
                <Input disabled {...register("identidad")}/>
              </FormField>

              <FormField label="Teléfono de Contacto" icon={Phone} error={errors.telefono?.message} required>
                <Input disabled {...register("telefono")}/>
              </FormField>

              {esHoy && (
                <FormField label="Tipo de Ingreso" required>
                  <Select value={tipoIngresoSeleccionado} onValueChange={(val) => setValue("tipoIngreso", val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primera-vez">Primera Vez</SelectItem>
                      <SelectItem value="subsecuente">Subsecuente</SelectItem>
                      <SelectItem value="emergencia">Emergencia</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              )}
            </FormSection>

            <FormSection title="Detalles de la Cita">
              {!esHoy ? (
                <>
                  <FormField label="Fecha de la Cita" icon={CalendarIcon} error={errors.fechaCita?.message} required>
                    <Input type="date" {...register("fechaCita", { required: "La fecha es obligatoria" })} />
                  </FormField>
                  <FormField label="Hora" icon={Clock} error={errors.horaCita?.message} required>
                    <Input type="time" {...register("horaCita", { required: "La hora es obligatoria" })} />
                  </FormField>
                </>
              ) : (
                <div className="md:col-span-2">
                  <Alert className="bg-green-50 border-green-200 py-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-xs text-green-800">
                      Registro automático para el día de hoy: <strong>{new Date().toLocaleDateString()}</strong>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <FormField label="Prioridad / Triaje" className="md:col-span-2">
                <Select value={prioridadSeleccionada} onValueChange={(val) => setValue("prioridad", val, {shouldValidate: true, shouldDirty: true })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal"><Badge variant="outline" className="text-blue-600">Normal</Badge></SelectItem>
                    <SelectItem value="media"><Badge variant="outline" className="text-yellow-600">Media</Badge></SelectItem>
                    <SelectItem value="alta"><Badge variant="outline" className="text-orange-600">Alta</Badge></SelectItem>
                    <SelectItem value="urgente"><Badge variant="outline" className="text-red-600">Urgente</Badge></SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Motivo de Consulta" className="md:col-span-2" error={errors.motivoConsulta?.message} required>
                <Textarea 
                  placeholder="Describa brevemente el motivo..."
                  rows={3}
                  {...register("motivoConsulta", { 
                    required: "El motivo es obligatorio",
                    minLength: { value: 10, message: "Mínimo 10 caracteres" }
                  })}
                />
              </FormField>
            </FormSection>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => {go(targetBack);}}>
                Cancelar
              </Button>
              <Button 
                onClick={() => {go(targetBack);}}
                type="submit"
                className={esHoy ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
                disabled={procesando}
              >
                {procesando ? <Loader2 className="animate-spin mr-2" /> : null}
                {esHoy ? "Registrar Ingreso" : "Agendar Cita"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}