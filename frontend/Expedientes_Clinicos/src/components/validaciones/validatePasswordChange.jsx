export function validatePasswordChange({ currentPassword, newPassword, confirmPassword }) {

  // Eliminar espacios al inicio y final
  const current = currentPassword?.trim();
  const newPass = newPassword?.trim();
  const confirm = confirmPassword?.trim();

  if (!current) {
    return "Debe ingresar su contraseña actual";
  }

  if (!newPass) {
    return "Debe ingresar una nueva contraseña";
  }

  if (!confirm) {
    return "Debe confirmar la nueva contraseña";
  }

  // Longitud mínima y máxima
  if (newPass.length < 8) {
    return "La nueva contraseña debe tener al menos 8 caracteres";
  }

  if (newPass.length > 64) {
    return "La contraseña no puede exceder los 64 caracteres";
  }

  // Evitar que sea igual a la contraseña actual
  if (current === newPass) {
    return "La nueva contraseña no puede ser igual a la actual";
  }

  // Al menos una mayúscula un numero y una minúscula
  if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$/.test(newPass)) {
    return "La contraseña debe contener al menos una mayúscula, una minúscula y un número";
}

  // Al menos un carácter especial
  if (!/[!@#$%^&*()_\-+=\[\]{};:,.<>?/|\\]/.test(newPass)) {
    return "La contraseña debe contener al menos un carácter especial";
  }

  // Confirmación
  if (newPass !== confirm) {
    return "Las contraseñas no coinciden";
  }

  return null;
}