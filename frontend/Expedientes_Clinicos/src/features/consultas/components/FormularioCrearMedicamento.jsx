import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Pill, Save, X } from "lucide-react";

import { useMedicamentos } from "../hooks/useMedicamentos";
import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader } from "@components/ui/card";

import { PageHeader } from "@components/layout/PageHeader";
import { FormHeader } from "@components/common/FormHeader";
import { ValidatedInput } from "@components/validaciones/validarInput";
import { FormSection } from "@components/common/FormSection";

export function FormularioCrearMedicamento() {

  const { go } = useSafeNavigation();

  const { handleCrear, handleActualizar } = useMedicamentos();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const isEdit = !!sessionStorage.getItem("edit_medicamento");

  useEffect(() => {
    const data = sessionStorage.getItem("edit_medicamento");

    if (data) {
      const medicamento = JSON.parse(data);
      setValue("id", medicamento.id);
      setValue("nombre", medicamento.nombre);
      setValue("categoria", medicamento.categoria);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      if (data.id) {
        await handleActualizar(data.id, data);
      } else {
        await handleCrear(data);
      }

      sessionStorage.removeItem("edit_medicamento");
     
      go("catalogo-medicamentos");

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>

      <PageHeader
        title="Registro de Medicamento"
        subtitle="Gestión de medicamentos del sistema"
        Icon={Pill}
        onVolver={() => go("catalogo-medicamentos")}
      />

      <main className="max-w-3xl mx-auto p-4 sm:p-6">

        <Card className="shadow-xl border-none overflow-hidden bg-white/80 backdrop-blur-md">

          <CardHeader className="bg-gradient-to-r from-white to-indigo-200 p-0 border-b border-blue-100 text-white">
            <FormHeader
              title={isEdit ? "Editar Medicamento" : "Nuevo Medicamento"}
              subtitle={
                isEdit
                  ? "Modifique la información del medicamento"
                  : "Complete la información del medicamento"
              }
              icon={Pill}
              align="left"
            />
          </CardHeader>

          <CardContent className="p-8">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              <FormSection title="Información del Medicamento">

                <div className="flex flex-col gap-6">

                  <ValidatedInput
                    name="nombre"
                    label="Nombre del Medicamento"
                    register={register}
                    error={errors.nombre?.message}
                    placeholder="Ej: Paracetamol"
                    minLength={3}
                    onlyLetters={true}
                  />

                  <ValidatedInput
                    name="categoria"
                    label="Categoría"
                    register={register}
                    error={errors.categoria?.message}
                    placeholder="Ej: Analgésico"
                    minLength={3}
                    onlyLetters={true}
                  />

                </div>

              </FormSection>

              <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 border-t">

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => go("catalogo-medicamentos")}
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
                  {isEdit ? "Actualizar Medicamento" : "Guardar Medicamento"}
                </Button>

              </div>

            </form>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}
