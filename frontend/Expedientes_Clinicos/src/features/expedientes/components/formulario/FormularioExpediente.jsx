import React, { useEffect} from "react";

import { useForm, useWatch, Controller } from "react-hook-form";

import { ValidatedInput } from "@components/validaciones/validarInput"; 
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { PageHeader } from "@components/layout/PageHeader";
import { FormHeader } from "@components/common/FormHeader";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { FileText, User, Calendar, Phone, Mail, MapPin, IdCard, Search, Loader2, X } from "lucide-react";

import { useExpedienteForm } from "../../hooks/useExpedienteForm";
import { FormField } from "@components/common/FormField";
import { FormSection } from "@components/common/FormSection";
import { StatusModal } from "@components/common/StatusModal";
import { formatearFecha} from "@/utils/dateFormatter";

import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";
import { useExpedienteContext } from "../../hooks/useExpedienteContext";

export function FormularioExpediente({ viewConfig }) {

  const { paciente, setPaciente } = useExpedienteContext();
  const { goBack } = useSafeNavigation();

  const esEdicion = viewConfig?.id === "editar-expediente";
  const modo = esEdicion ? "editar" : "crear";

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm();

  const generoSeleccionado = useWatch({ control, name: "sexo", defaultValue: "" });

  const { loading, idDuplicado, modal, setModal, validarId, enviarFormulario } = useExpedienteForm(modo, paciente, setPaciente);

  // Prellenar el formulario si es edición
  useEffect(() => {
    if (esEdicion && paciente) {
      const p = paciente.paciente || paciente;

      const sexoDB = p.sexo ? String(p.sexo).trim().toLowerCase() : "";
      const sexoFinal = (sexoDB === "masculino" || sexoDB === "femenino") ? sexoDB : "";

      console.log("Sincronizando formulario con:", p.nombre, "Sexo:", sexoFinal);
      reset({
        nombre: p.nombre || "",
        apellido: p.apellido || "",
        numeroIdentidad: p.dni || "",
        fechaNacimiento: formatearFecha(p.fechaNacimiento) || "",
        correo: p.correo || "",
        telefono: p.telefono || "",
        direccion: p.direccion || "",
        sexo: sexoFinal
      });
    }
  }, [esEdicion, paciente, reset]);

  const onCancel = () => goBack(viewConfig.id);

  const inputClass = (name) => `${errors[name] || (name === 'numeroIdentidad' && idDuplicado) ? "border-red-500" : "border-gray-300"} transition-all`;

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">

      <PageHeader 
        title={viewConfig.metadata?.title || "Expediente"} 
        subtitle={esEdicion ? "Modificar datos del expediente clínico" : "Crear expedientes clinicos"} 
        Icon={Search} 
        onVolver={onCancel} 
      />
      
      <Card className="w-full max-w-3xl mx-auto shadow-lg border-blue-100 mt-4 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 p-0">
          <FormHeader  
            title={esEdicion ? "Editar Datos del Expediente" : "Crear Nuevo Expediente"} 
            subtitle={esEdicion ? "Actualización de datos del paciente y expediente clínico" : "Registro oficial de paciente en el sistema clínico"} 
            icon={FileText} 
            align="left"
          />
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit((data) => enviarFormulario(data, generoSeleccionado))} className="space-y-8">
            {/* Sección de Información Básica */}
            <FormSection title="Información Básica">
              {/* Nombres */}
              <FormField  icon={User} >
                <ValidatedInput
                  name="nombre"
                  label="Nombres"
                  placeholder="Ej: Juan Carlos"
                  register={register}
                  error={errors.nombre?.message}
                  type="nombre"
                  minLength={2}
                />
              </FormField>
              {/* Apellidos */}
              <FormField icon={User}>
                <ValidatedInput
                  name="apellido"
                  label="Apellidos"
                  placeholder="Ej: Pérez Gómez"
                  register={register}
                  error={errors.apellido?.message}
                  type="apellido"
                  minLength={2}
                />
              </FormField>
              {/* Número de Identidad con validación de duplicados */}
              <FormField  icon={IdCard} className="md:col-span-2" >
                <ValidatedInput
                  name="numeroIdentidad"
                  label="Número de Identidad"
                  placeholder="0000-0000-00000"
                  register={register}
                  error={errors.numeroIdentidad?.message}
                  type="identidad"
                  duplicateError={idDuplicado && "Esta identidad ya existe"}
                  onBlur={(e) => {
                    const p = paciente?.paciente || paciente;
                    validarId(e.target.value, p?.dni);
                  }}
                />
              </FormField>
            </FormSection>

            {/* Sección de Datos Demográficos */}
            <FormSection title="Demográficos y Contacto">
              {/* Fecha de Nacimiento */}
              <FormField label="Fecha de Nacimiento" icon={Calendar} required error={errors.fechaNacimiento?.message}>
                <Input type="date"
                  {...register("fechaNacimiento", { required: "Campo obligatorio" })} className={inputClass("fechaNacimiento")}
                />
              </FormField>
              {/* Género */}
              <FormField label="Sexo" required error={errors.sexo?.message}>
                <Controller
                  control={control}
                  name="sexo"
                  rules={{ required: "Seleccione el sexo del paciente" }}
                  render={({ field }) => (
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ""}
                    >
                      <SelectTrigger className={inputClass("sexo")}>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Hombre</SelectItem>
                        <SelectItem value="femenino">Mujer</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              {/* Correo Electrónico */}
              <FormField icon={Mail}>
                <ValidatedInput
                  name="correo"
                  label="Correo Electrónico"
                  placeholder="correo@ejemplo.com"
                  register={register}
                  error={errors.correo?.message}
                  type="correo"
                  required={false}
                  minLength={5}
                />
              </FormField>
              {/* Teléfono */}
              <FormField icon={Phone} >
                <ValidatedInput
                  name="telefono"
                  label="Teléfono"
                  placeholder="Ej: +504 9999-9999"
                  register={register}
                  error={errors.telefono?.message}
                  type="telefono"
                  minLength={8}
                />
              </FormField>
              {/* Dirección Completa */}
              <FormField label="Dirección Completa" icon={MapPin} required error={errors.direccion?.message} className="md:col-span-2">
                <Textarea placeholder="Barrio, Calle, Número de casa..."
                  {...register("direccion", { required: "Dirección requerida" })}
                  className={`${inputClass("direccion")} resize-none`}
                />
              </FormField>
            </FormSection>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button type="submit" disabled={loading || idDuplicado} className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 text-base font-semibold transition-all shadow-md">
                {loading ? <Loader2 className="animate-spin" /> : (esEdicion ? "Guardar Cambios" : "Confirmar Registro")}
              </Button>
              <Button 
                type="button" 
                onClick={onCancel} 
                className={`flex-1 h-11 text-base font-semibold transition-all shadow-md flex items-center justify-center gap-2 ${
                  esEdicion 
                    ? "bg-red-50 text-red-600 border-2 border-red-300 hover:bg-red-100 hover:border-red-400" 
                    : "bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
                }`}
              >
                <X size={18} />
                Cancelar
              </Button>
            </div>
          </form>
          {/* Modal de Resultado */}
          <StatusModal 
            isOpen={modal.open} result={modal.result} 
            onClose={() => {
              setModal(prev => ({ ...prev, open: false }));
              if (modal.result.success) {
                console.log("Navegando de regreso a:", viewConfig.id);
                goBack(viewConfig.id);
              }
            }} 
          />
        </CardContent>
      </Card>
    </div>
  );
}