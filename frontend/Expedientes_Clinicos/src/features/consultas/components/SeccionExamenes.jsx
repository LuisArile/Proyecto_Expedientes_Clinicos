import { useFieldArray, Controller } from "react-hook-form";
import { FlaskConical, Plus, Trash2 } from "lucide-react";

import { Button } from "@components/ui/button";
import { FormField } from "@components/common/FormField";
import { FormSection } from "@components/common/FormSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

export function SeccionExamenes({ control, disponibles }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "examenes",
  });

  return (
    <FormSection title="Exámenes Médicos">
      {/* Este div permite ocupar todo el ancho del grid */}
      <div className="md:col-span-2 w-full space-y-4">
        <div className="flex justify-between items-end border-b border-purple-100 pb-2">
          <h3 className="text-sm font-semibold text-purple-800 flex items-center gap-2">
            <FlaskConical className="size-4" /> Exámenes
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ examenId: "", prioridad: "MEDIA" })
            }
            className="text-purple-600 border-purple-200 hover:bg-purple-50 cursor-pointer"
          >
            <Plus className="mr-1 h-4 w-4" /> Agregar Examen
          </Button>
        </div>

        {fields.length === 0 ? (
          <p className="text-center py-8 text-gray-400 italic text-sm border-2 border-dashed border-gray-100 rounded-xl">
            No hay exámenes agregados
          </p>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid w-full grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100"
              >
                {/* Select de Examen */}
                <FormField label="Examen">
                  <Controller
                    control={control}
                    name={`examenes.${index}.examenId`}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(val) =>
                          field.onChange(Number(val))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {disponibles?.map((ex) => (
                            <SelectItem key={ex.id} value={String(ex.id)}>
                              {ex.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                {/* Select de Prioridad */}
                <FormField label="Prioridad">
                  <Controller
                    control={control}
                    name={`examenes.${index}.prioridad`}
                    defaultValue="MEDIA"
                    render={({ field }) => (
                      <Select
                        value={field.value || "MEDIA"}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BAJA">Baja</SelectItem>
                          <SelectItem value="MEDIA">Media</SelectItem>
                          <SelectItem value="ALTA">Alta</SelectItem>
                          <SelectItem value="URGENTE">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                {/* Botón eliminar */}
                <div className="flex items-end justify-center md:justify-end pb-2">
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