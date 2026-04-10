import { Weight, Ruler } from "lucide-react";
import { Input } from "@components/ui/input";
import { FormField } from "@components/common/FormField";
import { FormSection } from "@components/common/FormSection";

export function SeccionAntropometria({ register, errors }) {
    return (
        <FormSection title="Medidas Antropométricas">
            <FormField
                label="Peso (kg)"
                icon={Weight}
                required
                error={errors.peso?.message}
            >
                <Input
                    type="number"
                    step="0.1"
                    placeholder="Ej: 70.5"
                    {...register("peso", {
                        required: "El peso es obligatorio",
                        min: { value: 0.5, message: "Mínimo 0.5 kg" },
                        max: { value: 500, message: "Máximo 500 kg" },
                })}
                className={errors.peso ? "border-red-500" : "border-gray-300"}
                />
            </FormField>

            <FormField
                label="Talla (cm)"
                icon={Ruler}
                required
                error={errors.talla?.message}
            >
                <Input
                    type="number"
                    placeholder="Ej: 170"
                    {...register("talla", {
                        required: "La talla es obligatoria",
                        min: { value: 20, message: "Mínimo 20 cm" },
                        max: { value: 300, message: "Máximo 300 cm" },
                })}
                className={errors.talla ? "border-red-500" : "border-gray-300"}
                />
            </FormField>
        </FormSection>
    );
}