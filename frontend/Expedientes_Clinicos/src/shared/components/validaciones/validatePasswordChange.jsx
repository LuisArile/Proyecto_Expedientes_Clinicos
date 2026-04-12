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

  // Longitud mínima
  if (newPass.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres";
  }

  // Evitar que sea igual a la contraseña actual
  if (current === newPass) {
    return "La nueva contraseña no puede ser igual a la actual";
  }

  // Validar formato completo: mayúscula, minúscula, número y carácter especial
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:,.<>?/|\\])[\w!@#$%^&*()_\-+=[\]{};:,.<>?/|\\]+$/;
  if (!passwordRegex.test(newPass)) {
    return "La contraseña debe contener mayúscula, minúscula, número y carácter especial (!@#$%^&*()_-+=[]{};<>?/|:,.)";
  }

  // Confirmación
  if (newPass !== confirm) {
    return "Las contraseñas no coinciden";
  }

  return null;
}