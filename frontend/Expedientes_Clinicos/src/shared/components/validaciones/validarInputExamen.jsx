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
  required = true
}) {
  const validationRules = {
    required: required ? `${label} es obligatorio` : false,
    validate: (value) => {
      if (!value || value.trim() === "") {
        return "No puede estar vacío o solo espacios";
      }

      if (value.trim().length < minLength) {
        return `Debe tener al menos ${minLength} caracteres`;
      }

      if (onlyLetters && !/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/.test(value)) {
        return "Solo se permiten letras";
      }

      return true;
    }
  };

  return (
    <FormField label={label} required={required} error={error}>
      <Input
        {...register(name, validationRules)}
        placeholder={placeholder}
        className="w-full h-11 rounded-lg border"
      />
    </FormField>
  );
}