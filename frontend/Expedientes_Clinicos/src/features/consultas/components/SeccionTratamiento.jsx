import { useFieldArray, useWatch } from "react-hook-form";
import { Pill, Plus, Trash2 } from "lucide-react";
import { ValidatedInput } from "@components/validaciones/validarInput";
import { Button } from "@components/ui/button";
import { FormField } from "@components/common/FormField";
import { FormSection } from "@components/common/FormSection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

export function SeccionTratamiento({ control, register, setValue, disponibles, errors }) {
  // Hook para manejar el arreglo dinámico de medicamentos
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicamentos",
  });

  // Observa los valores actuales del formulario
  const medicamentosWatch = useWatch({
    control,
    name: "medicamentos",
    defaultValue: [],
  }) || [];

  return (
    <FormSection title="Plan de Tratamiento">
      {/* Permite que la sección ocupe todo el ancho del grid */}
      <div className="md:col-span-2 w-full space-y-4">
        {/* Encabezado */}
        <div className="flex justify-between items-end border-b border-purple-100 pb-2">
          <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wider flex items-center gap-2">
            <Pill className="size-4" /> Plan de Tratamiento
          </h3>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                medicamentoId: "",
                dosis: "",
                frecuencia: "",
                duracion: "",
              })
            }
            className="text-purple-600 border-purple-200 hover:bg-purple-50 cursor-pointer"
          >
            <Plus className="mr-1 h-4 w-4" /> Agregar Medicamento
          </Button>
        </div>

        {/* Contenido */}
        {fields.length === 0 ? (
          <p className="text-center py-8 text-gray-400 italic text-sm border-2 border-dashed border-gray-100 rounded-xl">
            No hay medicamentos registrados.
          </p>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid w-full grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100"
              >
                {/* Select de Medicamento */}
                <FormField label="Medicamento">
                  <Select
                    value={medicamentosWatch[index]?.medicamentoId?.toString() || ""}
                    onValueChange={(val) =>
                      setValue(`medicamentos.${index}.medicamentoId`, Number(val))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar medicamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {disponibles
                        ?.filter((med) => {
                          return !medicamentosWatch.some((m, i) => {
                            if (i === index) return false;
                            return Number(m?.medicamentoId) === med.id;
                          });
                        })
                        .map((med) => (
                          <SelectItem key={med.id} value={String(med.id)}>
                            {med.nombre} - {med.categoria}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Dosis */}
                <ValidatedInput
                  name={`medicamentos.${index}.dosis`}
                  label="Dosis"
                  register={register}
                  error={errors?.medicamentos?.[index]?.dosis?.message}
                  placeholder="Ej: 500 mg"
                  type="dosis"
                />

                {/* Frecuencia */}
                <ValidatedInput
                  name={`medicamentos.${index}.frecuencia`}
                  label="Frecuencia"
                  register={register}
                  error={errors?.medicamentos?.[index]?.frecuencia?.message}
                  placeholder="Ej: cada 8 horas"
                  type="frecuencia"
                />

                {/* Duración */}
                <ValidatedInput
                  name={`medicamentos.${index}.duracion`}
                  label="Duración"
                  register={register}
                  error={errors?.medicamentos?.[index]?.duracion?.message}
                  placeholder="Ej: 7 días"
                  type="duracion"
                />

                {/* Botón eliminar */}
                <div className="flex items-center justify-center pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="size-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormSection>
  );
}