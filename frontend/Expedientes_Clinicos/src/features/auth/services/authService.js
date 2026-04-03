import { authAPI } from "@/shared/services/api";

export const authService = {
    async login(nombreUsuario, clave) {
        try {
        const result = await authAPI.login(nombreUsuario, clave);

        if (result.success && result.data) {

            sessionStorage.setItem("token", result.token);
            sessionStorage.setItem("user", JSON.stringify(result.data));

            return {
            success: true,
            user: result.data,
            };
        }

        return {
            success: false,
            error: result.error,
        };
        } catch {
        return {
            success: false,
            error: "No se pudo conectar con el servidor",
        };
        }
    },

    async logout() {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
        }
    },
};