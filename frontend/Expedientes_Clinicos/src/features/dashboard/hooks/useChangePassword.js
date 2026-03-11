import { useState } from "react";
import { securityService } from "../services/securityService";
import { useAuth } from "@/features/auth/AuthContext";

export function useChangePassword() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    try {
      setLoading(true);
      await securityService.cambiarPassword(user.id, currentPassword, newPassword);
      setSuccess("Contraseña actualizada correctamente");
      return true;
    } catch (err) {
      setError(err.message || "Error al cambiar la contraseña");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, error, success };
}