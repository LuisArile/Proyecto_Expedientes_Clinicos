/**
 * Valida la robustez de una contraseña y la coincidencia con su confirmación.
 * Retorna un string con el error o null si es válida.
 * Validación coherente con backend: mayúscula, minúscula, número, carácter especial, mínimo 8.
 */
export function validatePasswordSchema( currentPassword = null, newPassword, confirmPassword = null) {
    
    // Eliminar espacios al inicio y finales 
    const current = currentPassword?.trim();
    const newPass = newPassword?.trim();
    const confirm = confirmPassword?.trim();
    
    if (!newPass) return "La contraseña es obligatoria";
    
    if (newPass.length < 8) return "La contraseña debe tener al menos 8 caracteres";

    const hasUpperCase = /[A-Z]/.test(newPass); // Al menos una mayúscula
    const hasLowerCase = /[a-z]/.test(newPass); // Al menos una minúscula
    const hasNumber = /[0-9]/.test(newPass); // Al menos un número
    const hasSpecial = /[!@#$%^&*()_\-+=[\]{};:,.<>?/|\\]/.test(newPass); // Al menos un carácter especial

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        return "Debe incluir mayúscula, minúscula y un número";
    }

    if (!hasSpecial) {
        return "Debe incluir al menos un carácter especial: !@#$%^&*()_-+=[]{};<>?/|:,.";
    }

    if (currentPassword && newPass === current) {
        return "La nueva contraseña no puede ser igual a la actual";
    }

    if (confirmPassword !== null && newPass !== confirm) {
        return "Las contraseñas no coinciden";
    }

    return null;
}