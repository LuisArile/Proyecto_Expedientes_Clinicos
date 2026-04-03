import { seguridadAPI } from "@/shared/services/api";

export const securityService = {
  cambiarPassword: async (userId, currentPassword, newPassword) => {
    try {
        return await seguridadAPI.cambiarPassword(userId, currentPassword, newPassword);
    } catch (error) {
        console.error("Error en securityService:", error);
        throw error;
    }
  }
};