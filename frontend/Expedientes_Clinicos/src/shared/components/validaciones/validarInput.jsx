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
  type = "default",
  onBlur,              // Permite ejecutar validaciones externas (ej. duplicados)
  duplicateError       // Mensaje de error por duplicados
}) {

  // Todas las reglas centralizadas
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
    },
    nombre: {
      regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
      message: "Solo se permiten letras y espacios"
    },
    apellido: {
      regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
      message: "Solo se permiten letras y espacios"
    },
    identidad: {
      // Formato hondureño: 0000-0000-00000
      regex: /^(0[1-9]|1[0-8])\d{2}-\d{4}-\d{5}$/,
      message: "Formato requerido: 0000-0000-00000"
    },
    correo: {
      // Validación de correo 
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
      message: "Ingrese un correo electrónico válido"
    },
    telefono: {
      // Teléfono hondureño: +504 9999-9999 o 9999-9999
      regex: /^(?:\+504\s?)?[2398]\d{3}-\d{4}$/,
      message: "Formato válido: +504 9999-9999 o 9999-9999"
    }
  };

  const validationRules = {
    required: required ? `${label} es obligatorio` : false,
    validate: (value) => {

      if (!value || value.trim() === "") {
        return "No puede estar vacío o solo espacios";
      }

      const trimmedValue = value.trim();

      //  Validación de longitud mínima
      if (trimmedValue.length < minLength) {
        return `Debe tener al menos ${minLength} caracteres`;
      }

      //  Validación solo letras (compatibilidad con versión anterior)
      if (onlyLetters && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(trimmedValue)) {
        return "Solo se permiten letras";
      }

      //  Validación específica según el tipo
      if (type !== "default" && PATTERNS[type]) {
        const { regex, message } = PATTERNS[type];
        if (!regex.test(trimmedValue)) {
          return message;
        }
      }

      //  Validación de duplicados (si se proporciona)
      if (duplicateError) {
        return duplicateError;
      }

      return true;
    }
  };

  return (
    <FormField label={label} required={required} error={error || duplicateError}>
      <Input
        {...register(name, validationRules)}
        placeholder={placeholder}
        onBlur={onBlur}
        className={`w-full rounded-lg border ${
          error || duplicateError ? "border-red-500" : "border-gray-300"
        }`}
      />
    </FormField>
  );
}