import { Input } from "@components/ui/input";
import { FormField } from "@components/common/FormField";

export function ValidatedInput({
  name,
  label,
  register,
  error,
  placeholder,
  minLength = 4,
  onlyLetters = false,
  required = true,
  type = "default"
}) {

  // 🔹 Todas las reglas centralizadas
  const PATTERNS = {
    dosis: {
    regex: /^(\d+(\.\d+)?)(\s)?(mg|g|ml|mcg|UI|tableta(s)?|cápsula(s)?)$/i,
    message: "Ej: 500 mg, 5 ml, 1 tableta"
  },
    frecuencia: {
      regex: /^(\d+)\s?(vez|veces)\s(al d[ií]a|por d[ií]a)$|^cada\s\d+\s(horas?|d[ií]as?)$/i,
      message: "Ej: cada 8 horas, 2 veces al día"
    },
    duracion: {
      regex: /^(\d+\s?(días?|semanas?|mes(es)?))$|^(indefinido|cr[oó]nico|permanente)$/i,
      message: "Ej: 7 días, 2 semanas o crónico"
    }
  };

  const validationRules = {
    required: required ? `${label} es obligatorio` : false,
    validate: (value) => {

      if (!value || value.trim() === "") {
        return "No puede estar vacío o solo espacios";
      }

      //  Validaciones base 
      if (value.trim().length < minLength) {
        return `Debe tener al menos ${minLength} caracteres`;
      }

      if (onlyLetters && !/^[a-zA-ZÁÉÍÓÚáéíóúñÑ/\s]+$/.test(value)) {
        return "Solo se permiten letras";
      }

      //  Validación específica 
      if (type !== "default" && PATTERNS[type]) {
        const { regex, message } = PATTERNS[type];

        if (!regex.test(value.trim())) {
          return message;
        }
      }

      return true;
    }
  };

  return (
    <FormField label={label} required={required} error={error}>
      <Input
        {...register(name, validationRules)}
        placeholder={placeholder}
        className="w-full h-10 rounded-lg border"
      />
    </FormField>
  );
}