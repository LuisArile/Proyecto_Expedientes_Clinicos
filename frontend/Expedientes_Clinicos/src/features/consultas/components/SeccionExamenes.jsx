import { useFieldArray, useWatch } from "react-hook-form";

import { FlaskConical, Plus, Trash2 } from "lucide-react";
import { Button } from "@components/ui/button";
import { FormField } from "@components/common/FormField";
import { FormSection } from "@components/common/FormSection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

export function SeccionExamenes({ control, setValue, disponibles }) {
    const { fields, append, remove } = useFieldArray({ control, name: "examenes" });
    const examenesWatch = useWatch({
        control,
        name: "examenes",
        defaultValue: []
    });

    return (
        <FormSection title="Exámenes Médicos">
            <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-purple-100 pb-2">
                    <h3 className="text-sm font-semibold text-purple-800 flex items-center gap-2">
                        <FlaskConical className="size-4" /> Exámenes
                    </h3>
                    <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ examenId: "", prioridad: "MEDIA" })}
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
                    fields.map((field, index) => (
                        <div key={field.id} className="grid w-full grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                            
                            <FormField label="Examen">
                                <Select
                                    value={String(examenesWatch?.[index]?.examenId || "")} 
                                    onValueChange={(val) => setValue(`examenes.${index}.examenId`, Number(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {disponibles?.map(ex => (
                                        <SelectItem key={ex.id} value={String(ex.id)}>{ex.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            {/* Selector de Prioridad... */}
                            <Button 
                                type="button"
                                variant="ghost"
                                onClick={() => remove(index)}
                                className="text-red-400"
                            >
                                <Trash2 className="size-5" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </FormSection>
    );
}