import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TestTube, Save, X } from "lucide-react";

import { useExamenes } from "../hooks/useExamenes";
import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader } from "@components/ui/card";

import { PageHeader } from "@components/layout/PageHeader";
import { FormHeader } from "@components/common/FormHeader";
import { ValidatedInput } from "@components/validaciones/validarInput";
import { FormSection } from "@components/common/FormSection";

export function FormularioCrearExamen() {

  const { go } = useSafeNavigation();
  const { handleCrear, handleActualizar } = useExamenes();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const isEdit = !!sessionStorage.getItem("edit_examen");

  // const inputClass = (name) =>
  //   `${errors[name] ? "border-red-500" : "border-gray-300"} 
  //    transition-all focus:ring-blue-500`;

  useEffect(() => {
    const data = sessionStorage.getItem("edit_examen");

    if (data) {
      const examen = JSON.parse(data);
      setValue("id", examen.id);
      setValue("nombre", examen.nombre);
      setValue("especialidad", examen.especialidad);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      if (data.id) {
        await handleActualizar(data.id, data);
      } else {
        await handleCrear(data);
      }

      sessionStorage.removeItem("edit_examen");

      go("catalogo-examenes")

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>

      <PageHeader
        title="Registro de Examen"
        subtitle="Gestión de exámenes clínicos del sistema"
        Icon={TestTube}
        onVolver={() => go("catalogo-examenes")}
      />

      <main className="max-w-3xl mx-auto p-4 sm:p-6">

        <Card className="shadow-xl border-none overflow-hidden bg-white/80 backdrop-blur-md">

          <CardHeader className="bg-gradient-to-r from-white to-indigo-200 p-0 border-b border-blue-100 text-white">
            <FormHeader
              title={isEdit ? "Editar Examen" : "Nuevo Examen"}
              subtitle={
                isEdit
                  ? "Modifique la información del examen"
                  : "Complete la información del examen"
              }
              icon={TestTube}
              align="left"
            />
          </CardHeader>

          <CardContent className="p-8">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              <FormSection title="Información del Examen">

                <div className="flex flex-col gap-6">
                  <ValidatedInput
                    name="nombre"
                    label="Nombre del Examen"
                    register={register}
                    error={errors.nombre?.message}
                    placeholder="Ej: Hemograma Completo"
                    minLength={5}
                    onlyLetters={true}
                  />

                  <ValidatedInput
                    name="especialidad"
                    label="Especialidad"
                    register={register}
                    error={errors.especialidad?.message}
                    placeholder="Ej: Laboratorio Clínico"
                    minLength={4}
                    onlyLetters={true}
                  />
                </div>

              </FormSection>

              <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 border-t">

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => go("catalogo-examenes")}
                  className="h-11 px-5 border-gray-300 text-gray-600 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                >
                  <X className="mr-2 size-4" />
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <Save className="mr-2 size-5" />
                  {isEdit ? "Actualizar Examen" : "Guardar Examen"}
                </Button>

              </div>

            </form>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}