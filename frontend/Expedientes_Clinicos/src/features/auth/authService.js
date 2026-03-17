import { authAPI } from "@/services/api";

export const authService = {
    async login(nombreUsuario, clave) {
        try {
        const result = await authAPI.login(nombreUsuario, clave);

        if (result.success && result.data) {
            const userData = result.data;

            sessionStorage.setItem("user", JSON.stringify(userData));
            sessionStorage.setItem("token", result.token);

            return {
            success: true,
            user: userData,
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