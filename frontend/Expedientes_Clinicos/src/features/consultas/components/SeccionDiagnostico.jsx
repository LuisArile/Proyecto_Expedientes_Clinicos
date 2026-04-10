import React from "react";
import { FormSection } from "@components/common/FormSection";
import { FormField } from "@components/common/FormField";
import { Textarea } from "@components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@components/ui/select";

export function SeccionDiagnostico({ register, errors, tipoDiag, setValue }) {
  return (
    <FormSection title="Diagnóstico y Evaluación">
      {/* TIPO DE DIAGNÓSTICO */}
      <FormField 
        label="Tipo de Diagnóstico" 
        required 
        error={errors.tipoDiagnostico?.message}
      >
        <Select 
          value={tipoDiag} 
          onValueChange={(val) => setValue("tipoDiagnostico", val)}
        >
          <SelectTrigger className="w-full rounded-lg border-gray-300">
            <SelectValue placeholder="Seleccione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRESUNTIVO">Presuntivo</SelectItem>
            <SelectItem value="DEFINITIVO">Definitivo</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {/* DESCRIPCIÓN CLÍNICA */}
      <div className="md:col-span-2">
        <FormField 
          label="Descripción Clínica" 
          required 
          error={errors.diagnostico?.message}
        >
          <Textarea
            {...register("diagnostico", {
              required: "El diagnóstico es obligatorio",
              validate: (value) => {
                if (value.trim() === "") return "No puede estar vacío o solo espacios";
                if (value.length < 10) return "Debe tener al menos 10 caracteres";
                return true;
              },
            })}
            placeholder="Describa el estado del paciente..."
            className="border border-gray-300 focus-visible:ring-purple-500 min-h-[120px]"
          />
        </FormField>
      </div>
    </FormSection>
  );
}