import { Heart, Thermometer, Activity } from "lucide-react";
import { Input } from "@components/ui/input";
import { FormField } from "@components/common/FormField";
import { FormSection } from "@components/common/FormSection";

export function SeccionSignosVitales({ register, errors }) {
    return (
        <FormSection title="Signos Vitales">
            <FormField
                label="Presión Arterial"
                icon={Heart}
                required
                error={errors.presionArterial?.message}
            >
                <Input
                    placeholder="Ej: 120/80"
                    {...register("presionArterial", {
                        required: "La presión arterial es obligatoria",
                        pattern: {
                            value: /^\d{2,3}\/\d{2,3}$/,
                            message: "Formato: sistólica/diastólica (ej: 120/80)",
                        },
                    })}
                    className={errors.presionArterial ? "border-red-500" : "border-gray-300"}
                />
            </FormField>

            <FormField
                label="Temperatura (°C)"
                icon={Thermometer}
                required
                error={errors.temperatura?.message}
            >
                <Input
                    type="number"
                    step="0.1"
                    placeholder="Ej: 36.5"
                    {...register("temperatura", {
                        required: "La temperatura es obligatoria",
                        min: { value: 30, message: "Mínimo 30°C" },
                        max: { value: 45, message: "Máximo 45°C" },
                })}
                className={errors.temperatura ? "border-red-500" : "border-gray-300"}
                />
            </FormField>

            <FormField
                label="Frecuencia Cardíaca (lpm)"
                icon={Activity}
                required
                error={errors.frecuenciaCardiaca?.message}
            >
                <Input
                    type="number"
                    placeholder="Ej: 72"
                    {...register("frecuenciaCardiaca", {
                        required: "La frecuencia cardíaca es obligatoria",
                        min: { value: 30, message: "Mínimo 30 lpm" },
                        max: { value: 250, message: "Máximo 250 lpm" },
                })}
                className={errors.frecuenciaCardiaca ? "border-red-500" : "border-gray-300"}
                />
            </FormField>
        </FormSection>
    );
}