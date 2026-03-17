export function validarLogin(nombreUsuario, clave) {

    const usuario = nombreUsuario.trim();
    const password = clave.trim();

    if (!/^[A-Za-z0-9._-]{4,20}$/.test(usuario)) {
        return "Usuario: 4–20 caracteres válidos";
    }

    if (!/^[\x20-\x7E]{6,50}$/.test(password)) {
        return "Contraseña: 6–50 caracteres";
    }

  return null;
}