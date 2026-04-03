import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form'; 
import { User, Mail, ShieldCheck, Stethoscope, Save, X, Loader2, UserCog, Briefcase, UserPlus } from "lucide-react";

import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

import { PageHeader } from "@components/layout/PageHeader";
import { FormHeader } from "@components/common/FormHeader";
import { FormField } from "@components/common/FormField";
import { FormSection } from "@components/common/FormSection";
import { StatusModal } from "@components/common/StatusModal";

import { useUsuarioForm } from "../hooks/useUsuarioForm";

export function FormularioCreacionUsuario({ onVolver, onSuccess }) {
  const id = sessionStorage.getItem("edit_user_id");
  const isEdit = Boolean(id);

  const { roles, loading, modal, setModal, enviarFormulario, datosIniciales } = useUsuarioForm(id);
  const { register, handleSubmit, setValue, reset, control, formState: { errors } } = useForm();
  
  const selectedRol = useWatch({ control, name: "idRol" });

  useEffect(() => {
    if (datosIniciales) {
      reset({
        ...datosIniciales,
        idRol: String(datosIniciales.idRol),
        activo: datosIniciales.activo ?? true
      });
    }
  }, [datosIniciales, reset]);

  const inputClass = (name) => `${errors[name] ? "border-red-500" : "border-gray-300"} transition-all focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 pb-10">

      <PageHeader title={isEdit ? "Editar Personal" : "Registro de Personal"} subtitle="Gestión de credenciales y roles de acceso" Icon={UserCog} onVolver={onVolver}/>

      <main className="max-w-3xl mx-auto p-4 sm:p-6">
        <Card className="w-full max-w-3xl mx-auto shadow-lg border-blue-100 mt-4 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 p-0">
            <FormHeader 
              title={isEdit ? "Modificar Usuario" : "Nuevo Integrante"}
              subtitle="La contraseña temporal se enviará automáticamente por correo"
              icon={isEdit ? UserCog : UserPlus}
              align="left"
            />
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(enviarFormulario)} className="space-y-8">

              <FormSection title="Datos Personales">

                <FormField label="Nombre Completo" icon={User} required error={errors.nombre?.message}>
                  <Input 
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                    placeholder="Ej: Ana Maria"
                    className={inputClass("nombre")}
                  />
                </FormField>

                <FormField label="Apellido" icon={User} required error={errors.apellido?.message}>
                  <Input 
                    {...register("apellido", { required: "El apellido es obligatorio" })}
                    placeholder="Ej: Rodriguez"
                    className={inputClass("apellido")}
                  />
                </FormField>

                <FormField label="Correo Electrónico" icon={Mail} required error={errors.correo?.message} className="md:col-span-2">
                  <Input 
                    type="email"
                    {...register("correo", { 
                      required: "El correo es obligatorio",
                      pattern: { value: /^\S+@\S+$/i, message: "Formato de correo inválido" }
                    })}
                    placeholder="ana@clinica.com"
                    className={inputClass("correo")}
                  />
                </FormField>
              </FormSection>

              <FormSection title="Configuración de Cuenta">

                <FormField label="Nombre de Usuario" icon={Briefcase}>
                  <Input 
                    {...register("nombreUsuario")}
                    disabled={isEdit}
                    className={inputClass("nombreUsuario")}
                  />
                </FormField>

                <FormField label="Rol del Sistema" icon={ShieldCheck} required error={errors.idRol?.message}>
                  <Select 
                    value={selectedRol ? String(selectedRol) : ""}
                    onValueChange={(val) => setValue("idRol", val, { shouldValidate: true })}
                  >
                    <SelectTrigger className={inputClass("idRol")}>
                      <SelectValue placeholder="Seleccionar rol..." />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(r => (
                        <SelectItem key={r.idRol} value={String(r.idRol)}>
                          {r.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register("idRol", { required: true })} />
                </FormField>

                {isEdit && (
                  <FormField label="Estado del Usuario">
                    <Select 
                      defaultValue={datosIniciales?.activo ? "true" : "false"}
                      onValueChange={(val) => setValue("activo", val === "true")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem 
                          value="true">Activo</SelectItem>
                        <SelectItem value="false">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                )}

                {(Number(selectedRol) === 2) && (
                  <FormField label="Especialidad Médica" icon={Stethoscope}>
                    <Input 
                      {...register("especialidad")}
                      placeholder="Ej: Cardiología"
                      className="border-blue-200"
                    />
                  </FormField>
                )}

              </FormSection>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button type="submit" disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 size-5" />}
                  {isEdit ? "Actualizar Usuario" : "Registrar Usuario"}
                </Button>
                
                <Button type="button" variant="ghost" onClick={onVolver}>
                  <X className="mr-2 size-4" /> Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <StatusModal 
          isOpen={modal.open} 
          result={modal.result} 
          onClose={() => {
            setModal(prev => ({ ...prev, open: false }));
            if (modal.result.success) {
              sessionStorage.removeItem("edit_user_id");
              onSuccess();
            }
          }} 
        />
      </main>
    </div>
  );
}