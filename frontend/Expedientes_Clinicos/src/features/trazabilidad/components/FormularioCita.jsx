import { useForm, useWatch } from 'react-hook-form';
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Badge } from "@components/ui/badge";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Card, CardContent } from "@components/ui/card";
import { Loader2, CalendarIcon, UserPlus, CheckCircle2, Clock, User, Phone, FileText } from "lucide-react";
import { FormField } from "@components/common/FormField";
import { FormHeader } from "@components/common/FormHeader";
import { FormSection } from "@components/common/FormSection";

export function FormularioCita({ modo = "agendar", onVolver }) {
  
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      prioridad: "normal",
      tipoIngreso: "primera-vez",
      fechaCita: modo === "hoy" ? new Date().toISOString().split("T")[0] : ""
    }
  });

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

  const esHoy = modo === "hoy";

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card className="shadow-xl border-t-4 border-blue-600">
        <FormHeader 
          title={esHoy ? "Registro de Paciente - Hoy" : "Programar Cita Futura"}
          subtitle={esHoy ? "Ingreso directo a flujo de atención" : "Reserva de cupo para fecha posterior"}
          icon={esHoy ? UserPlus : CalendarIcon}
          align="left"
        />
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            <FormSection title="Información del Paciente">
              <FormField label="Nombre Completo" icon={User} error={errors.nombrePaciente?.message} required>
                <Input 
                  placeholder="Ej. Juan Pérez"
                  {...register("nombrePaciente", { required: "El nombre es obligatorio" })}
                />
              </FormField>

              <FormField label="Número de Identidad" icon={FileText} error={errors.identidad?.message} required>
                <Input 
                  placeholder="0000-0000-00000"
                  {...register("identidad", { 
                    required: "La identidad es obligatoria",
                    pattern: { value: /^\d{4}-\d{4}-\d{5}$/, message: "Formato: 0000-0000-00000" }
                  })}
                />
              </FormField>

              <FormField label="Teléfono de Contacto" icon={Phone} error={errors.telefono?.message} required>
                <Input 
                  placeholder="+504 0000-0000"
                  {...register("telefono", { required: "El teléfono es obligatorio" })}
                />
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
              <Button type="button" variant="outline" onClick={onVolver}>
                Cancelar
              </Button>
              <Button 
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