import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, User, Calendar, Phone, Mail, MapPin, IdCard, AlertCircle, CheckCircle2, XCircle, Search, Loader2 } from "lucide-react";

import { useExpedienteForm } from "../hooks/useExpedienteForm";
import { FormField } from "@/components/common/FormField";
import { FormSection } from "@/components/common/FormSection";
import { StatusModal } from "@/components/common/StatusModal";

export function FormularioExpediente({ onSuccess, onCancel, onVolver }) {
  const {
    register, handleSubmit, formState: { errors }, setValue,
  } = useForm();

  const [generoSeleccionado, setGeneroSeleccionado] = useState("");

  const {
    loading,
    idDuplicado,
    modal, setModal,
    validarId, 
    enviarFormulario
  } = useExpedienteForm(onSuccess);

  const onSubmit = (data) => {
    enviarFormulario(data, generoSeleccionado);
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <PageHeader
          title="Crear Expediente" subtitle="Crear expedientes clinicos" Icon={Search}
          onVolver={onVolver}
      />
      
      <Card className="w-full max-w-3xl mx-auto shadow-lg border-blue-100 mt-4">
        <CardHeader className="space-y-1 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-blue-900">Crear Nuevo Expediente</CardTitle>
              <CardDescription className="text-gray-600">
                Registro oficial de paciente en el sistema clínico
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Sección de Información Básica */}
            <FormSection title="Información Básica">
              {/* Nombres */}
              <FormField label="Nombres" icon={User} required 
                error={errors.nombre?.message}
              >
                <Input
                  id="nombre" placeholder="Ej: Juan Carlos"
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                    minLength: { value: 2, message: "Mínimo 2 caracteres" }
                  })}
                  className={errors.nombre ? "border-red-500" : "border-gray-300"}
                />
              </FormField>
              {/* Apellidos */}
              <FormField 
                label="Apellidos" icon={User} required 
                error={errors.apellido?.message}
              >
                <Input
                  id="apellido" placeholder="Ej: Pérez Gómez"
                  {...register("apellido", {
                    required: "El apellido es obligatorio",
                    minLength: { value: 2, message: "Mínimo 2 caracteres" }
                  })}
                  className={errors.apellido ? "border-red-500" : "border-gray-300"}
                />
              </FormField>
              {/* Número de Identidad con validación de duplicados */}
              <FormField 
                label="Número de Identidad" icon={IdCard} required 
                error={errors.numeroIdentidad?.message || (idDuplicado ? "Esta identidad ya está registrada." : null)}
                className="md:col-span-2"
              >
                <Input 
                  id="numeroIdentidad" placeholder="0000-0000-00000"
                  {...register("numeroIdentidad", { 
                    required: "La identidad es obligatoria",
                    pattern: {
                      value: /^[0-9]{4}-[0-9]{4}-[0-9]{5}$/,
                      message: "Formato requerido: 0000-0000-00000"
                  }})}
                  onBlur={(e) => validarId(e.target.value)}
                  className={errors.numeroIdentidad || idDuplicado ? "border-red-500" : "border-gray-300"}
                />
              </FormField>
            </FormSection>

            {/* Sección de Datos Demográficos */}
            <FormSection title="Datos Demográficos">
              {/* Fecha de Nacimiento */}
              <FormField 
                label="Fecha de Nacimiento" icon={Calendar} required
                error={errors.fechaNacimiento?.message}
              >
                <Input
                  type="date"
                  {...register("fechaNacimiento", { required: "Campo obligatorio" })}
                  className={errors.fechaNacimiento ? "border-red-500" : "border-gray-300"}
                />
              </FormField>
              {/* Género */}
              <FormField 
                label="Sexo" required 
                error={errors.sexo?.message}
              >
                <Select
                  onValueChange={(val) => {
                    setGeneroSeleccionado(val);
                    setValue("sexo", val);
                  }}
                >
                  <SelectTrigger className={errors.sexo ? "border-red-500" : "border-gray-300"}>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Hombre</SelectItem>
                    <SelectItem value="femenino">Mujer</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("sexo", { required: "Seleccione sexo" })} />
              </FormField>
            </FormSection>

            {/* Sección de Contacto */}
            <FormSection title="Información de Contacto">
              {/* Correo Electrónico */}
              <FormField 
                label="Correo Electrónico" icon={Mail} 
                error={errors.correo?.message}
              >
                <Input 
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...register("correo", {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Correo inválido"
                    }
                  })} 
                  className={errors.correo ? "border-red-500" : "border-gray-300"}
                />
              </FormField>
              {/* Teléfono */}
              <FormField 
                label="Teléfono" icon={Phone} required
                error={errors.telefono?.message}
              >
                <Input 
                  placeholder="Ej: +504 9999-9999"
                  {...register("telefono", { required: "Teléfono requerido" })} 
                  className={errors.telefono ? "border-red-500" : "border-gray-300"}
                />
              </FormField>
              {/* Dirección Completa */}
              <FormField 
                label="Dirección Completa" icon={MapPin} required
                error={errors.direccion?.message}
                className="md:col-span-2"
              >
                <Textarea
                  placeholder="Barrio, Calle, Número de casa..."
                  {...register("direccion", { required: "Dirección requerida" })}
                  className={`${errors.direccion ? "border-red-500" : "border-gray-300"} resize-none min-h-[100px]`}
                />
              </FormField>
            </FormSection>

            {/* Botones */}
            <div className="flex gap-4 pt-6 border-t mt-8">
              <Button
                type="submit"
                disabled={loading || idDuplicado}
                className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 text-base font-semibold transition-all shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Confirmar Registro"
                )}
              </Button>
              <Button
                type="button" variant="outline" onClick={onCancel}
                className="flex-1 h-11 text-base border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </Button>
            </div>
          </form>
          {/* Modal de Resultado */}
          <StatusModal 
            isOpen={modal.open} 
            result={modal.result} 
            onClose={() => {
              setModal({ ...modal, open: false });
              if (modal.result.success) onSuccess?.();
            }} 
          />
        </CardContent>
      </Card>
    </div>
  );
}