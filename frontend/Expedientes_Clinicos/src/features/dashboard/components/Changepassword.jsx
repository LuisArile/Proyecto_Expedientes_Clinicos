import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Eye } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

export function Changepassword() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:4000/api/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            currentPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al cambiar la contraseña");
      }

      setSuccess("Contraseña actualizada correctamente");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Icono */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <Lock className="text-blue-600 w-6 h-6" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Cambiar Contraseña
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Clínica Médica Vida Plena - Sistema de Gestión Hospitalaria
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Usuario fijo */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={user?.nombreUsuario || ""}
                disabled
                className="w-full pl-10 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Contraseña actual */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Contraseña actual
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Ingrese su contraseña actual"
              className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900"
              required
            />
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ingrese su nueva contraseña"
              className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900"
              required
            />
          </div>

          {/* Confirmar */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme su nueva contraseña"
              className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          {success && (
            <p className="text-green-600 text-sm text-center">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg text-white font-medium 
                       bg-gradient-to-r from-blue-600 to-blue-500 
                       hover:from-blue-700 hover:to-blue-600
                       transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>

          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-gray-500 text-sm hover:underline"
            >
              Cancelar y volver
            </button>
          </div>

          <div className="border-t pt-4 mt-4 text-center text-xs text-gray-400">
            Para mayor seguridad, se recomienda cambiar su contraseña cada 90 días
          </div>

        </form>
      </div>
    </div>
  );
}