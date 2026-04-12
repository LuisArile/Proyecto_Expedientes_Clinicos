// src/features/admin/components/FormularioCreacionUsuario.jsx
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLocation } from "react-router-dom";
import {
  Save,
  X,
  Loader2,
  UserCog,
  UserPlus,
} from "lucide-react";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

import { PageHeader } from "@components/layout/PageHeader";
import { FormHeader } from "@components/common/FormHeader";
import { FormSection } from "@components/common/FormSection";
import { FormField } from "@components/common/FormField";
import { StatusModal } from "@components/common/StatusModal";
import { ValidatedInput } from "@components/validaciones/validarInput";

import { useUsuarioForm } from "../hooks/useUsuarioForm";
import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";

export const FormularioCreacionUsuario = () => {
  const { goBack } = useSafeNavigation();
  const location = useLocation();
  const id = location.state?.id;
  const isEdit = Boolean(id);

  const {
    roles,
    loading,
    modal,
    setModal,
    enviarFormulario,
    datosIniciales,
  } = useUsuarioForm(id);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      correo: "",
      nombreUsuario: "",
      clave: "",
      idRol: "",
      activo: true,
      especialidades: "",
    },
  });

  const selectedRol = useWatch({ control, name: "idRol" });

  /**
   * Cargar datos en modo edición
   */
  useEffect(() => {
    if (datosIniciales) {
      reset({
        nombre: datosIniciales.nombre,
        apellido: datosIniciales.apellido,
        correo: datosIniciales.correo,
        nombreUsuario: datosIniciales.nombreUsuario,
        idRol: String(datosIniciales.idRol),
        activo: datosIniciales.activo ?? true,
        especialidades:
          datosIniciales.especialidades?.join(", ") || "",
      });
    }
  }, [datosIniciales, reset]);

  const VIEW_ID = isEdit ? "editar-usuario" : "crear-usuario";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 pb-10">
      <PageHeader
        title={isEdit ? "Editar Personal" : "Registro de Personal"}
        subtitle="Gestión de credenciales y roles de acceso"
        Icon={UserCog}
        onVolver={() => goBack(VIEW_ID)}
      />

      <main className="max-w-3xl mx-auto p-4 sm:p-6">
        <Card className="shadow-lg border-blue-100 mt-4">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 p-0">
            <FormHeader
              title={isEdit ? "Modificar Usuario" : "Nuevo Integrante"}
              subtitle="La contraseña temporal se enviará automáticamente por correo"
              icon={isEdit ? UserCog : UserPlus}
              align="left"
            />
          </CardHeader>

          <CardContent className="pt-6">
            <form
              onSubmit={handleSubmit(enviarFormulario)}
              className="space-y-8"
            >
              {/* Datos Personales */}
              <FormSection title="Datos Personales">
                <FormField label="Nombre" required error={errors.nombre?.message}>
                  <ValidatedInput
                    name="nombre"
                    register={register}
                    placeholder="Ej: Ana"
                    type="nombre"
                    minLength={2}
                  />
                </FormField>

                <FormField label="Apellido" required error={errors.apellido?.message}>
                  <ValidatedInput
                    name="apellido"
                    register={register}
                    placeholder="Ej: Rodríguez"
                    type="apellido"
                    minLength={2}
                  />
                </FormField>

                <FormField
                  label="Correo Electrónico"
                  required
                  error={errors.correo?.message}
                >
                  <ValidatedInput
                    name="correo"
                    register={register}
                    placeholder="ana@clinica.com"
                    type="correo"
                  />
                </FormField>
              </FormSection>

              {/* Configuración de Cuenta */}
              <FormSection title="Configuración de Cuenta">
                <FormField
                  label="Nombre de Usuario"
                  required
                  error={errors.nombreUsuario?.message}
                >
                  <ValidatedInput
                    name="nombreUsuario"
                    register={register}
                    placeholder="Ej: arodriguez"
                    minLength={4}
                  />
                </FormField>

                {/* Contraseña solo en creación */}
                {!isEdit && (
                  <FormField
                    label="Contraseña"
                    required
                    error={errors.clave?.message}
                  >
                    <ValidatedInput
                      name="clave"
                      register={register}
                      type="password"
                      minLength={8}
                      placeholder="Mínimo 8 caracteres"
                    />
                  </FormField>
                )}

                {/* Selección de Rol */}
                <FormField
                  label="Rol del Sistema"
                  required
                  error={errors.idRol?.message}
                >
                  <Select
                    value={selectedRol || ""}
                    onValueChange={(val) =>
                      setValue("idRol", val, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol..." />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((rol) => (
                        <SelectItem
                          key={rol.idRol}
                          value={String(rol.idRol)}
                        >
                          {rol.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    {...register("idRol", {
                      required: "El rol es obligatorio",
                    })}
                  />
                </FormField>

                {/* Estado del Usuario */}
                {isEdit && (
                  <FormField label="Estado del Usuario">
                    <Select
                      value={datosIniciales?.activo ? "true" : "false"}
                      onValueChange={(val) =>
                        setValue("activo", val === "true")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Activo</SelectItem>
                        <SelectItem value="false">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                )}

                {/* Especialidades para Médicos */}
                {Number(selectedRol) === 2 && (
                  <FormField
                    label="Especialidades Médicas"
                    required
                    error={errors.especialidades?.message}
                  >
                    <ValidatedInput
                      name="especialidades"
                      register={register}
                      placeholder="Ej: Cardiología, Medicina Interna"
                      minLength={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ingrese varias especialidades separadas por comas.
                    </p>
                  </FormField>
                )}
              </FormSection>

              {/* Botones */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    <Save className="mr-2 size-5" />
                  )}
                  {isEdit
                    ? "Actualizar Usuario"
                    : "Registrar Usuario"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => goBack(VIEW_ID)}
                  className="flex-1"
                >
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
            setModal((prev) => ({ ...prev, open: false }));
            if (modal.result.success) {
              goBack(VIEW_ID);
            }
          }}
        />
      </main>
    </div>
  );
};