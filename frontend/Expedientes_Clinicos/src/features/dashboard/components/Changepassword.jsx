import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
import { Lock, User, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { validatePasswordChange } from "@/components/validaciones/validatePasswordChange";

export function Changepassword({ onNavigate }) {

  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validatePasswordChange({
      currentPassword,
      newPassword,
      confirmPassword
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/usuarios/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        }
      );

      if (!response.ok) {
        throw new Error("Error al cambiar la contraseña");
      }

      setSuccess("Contraseña actualizada correctamente");

      setTimeout(() => {
        onNavigate("inicio");
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

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

          <div>

            <Label className="block text-sm text-gray-600 mb-1">
              Usuario
            </Label>

            <div className="relative">

              <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

              <Input
                type="text"
                value={user?.nombreUsuario || ""}
                disabled
                className="w-full pl-10 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 text-sm"
              />

            </div>

          </div>


          <div>

            <Label className="block text-sm text-gray-600 mb-1">
              Contraseña actual
            </Label>

            <div className="relative">

              <Input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}  
                placeholder="Ingrese su contraseña actual"
                className="w-full py-2 px-3 rounded-lg border border-gray-300
                           focus:ring-2 focus:ring-blue-500 text-gray-900"
              />

              {showCurrent ? (
                <EyeOff
                  onClick={() => setShowCurrent(false)}
                  className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 cursor-pointer"
                />
              ) : (
                <Eye
                  onClick={() => setShowCurrent(true)}
                  className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 cursor-pointer"
                />
              )}

            </div>

            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.currentPassword}
              </p>
            )}

          </div>


          <div>

            <Label className="block text-sm text-gray-600 mb-1">
              Nueva contraseña
            </Label>

            <div className="relative">

              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingrese su nueva contraseña"
                className="w-full py-2 px-3 rounded-lg border border-gray-300
                           focus:ring-2 focus:ring-blue-500 text-gray-900"
              />

              {showNew ? (
                <EyeOff
                  onClick={() => setShowNew(false)}
                  className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 cursor-pointer"
                />
              ) : (
                <Eye
                  onClick={() => setShowNew(true)}
                  className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 cursor-pointer"
                />
              )}

            </div>

            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.newPassword}
              </p>
            )}

          </div>


          <div>

            <Label className="block text-sm text-gray-600 mb-1">
              Confirmar nueva contraseña
            </Label>

            <div className="relative">

              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme su nueva contraseña"
                className="w-full py-2 px-3 rounded-lg border border-gray-300
                           focus:ring-2 focus:ring-blue-500 text-gray-900"
              />

              {showConfirm ? (
                <EyeOff
                  onClick={() => setShowConfirm(false)}
                  className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 cursor-pointer"
                />
              ) : (
                <Eye
                  onClick={() => setShowConfirm(true)}
                  className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 cursor-pointer"
                />
              )}

            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}

          </div>


          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}


          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg text-white font-medium 
                       bg-gradient-to-r from-blue-600 to-blue-500 
                       hover:from-blue-700 hover:to-blue-600"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>


          {success && (
            <div className="flex items-center gap-2 justify-center 
                            bg-green-50 border border-green-200 
                            text-green-700 text-sm rounded-lg p-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>{success}</span>
            </div>
          )}


          <div className="text-center mt-2">

            <Button
              type="button"
              onClick={() => onNavigate("inicio")}
              className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-red-600 hover:text-white"
            >
              Cancelar
            </Button>

          </div>

        </form>

      </div>

    </div>
  );
}