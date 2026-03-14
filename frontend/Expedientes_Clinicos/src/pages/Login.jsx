import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { validarLogin } from "@/components/validaciones/validarLogin";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, Activity, EyeOff } from "lucide-react";
import { useAuth } from "../features/auth/AuthContext";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showClave, setShowClave] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const errorValidacion = validarLogin(nombreUsuario, clave);

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    const usuarioLimpio = nombreUsuario.trim();
    const claveLimpia = clave.trim();

    try {
      const result = await login(usuarioLimpio, claveLimpia);
      if(result && result.success){
        console.log("Login exitoso, redirigiendo...");
        navigate("/dashboard");
      } else {
        setError(result.error || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Icono superior */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <Activity className="text-blue-600 w-6 h-6" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-xl font-semibold text-center text-gray-800">
          Clínica Médica Vida Plena
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Sistema de Gestión Hospitalaria
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Usuario */}
          <div>
            <Label className="block text-sm text-gray-600 mb-1">
              Usuario
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Ingrese su usuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                className="text-gray-800 w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label className="block text-sm text-gray-600 mb-1">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <Input
                type={showClave ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                className="text-gray-800 w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                required
              />
            {showClave ? (
              <EyeOff
                onClick={() => setShowClave(false)}
                className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 cursor-pointer"
              />
            ) : (
              <Eye
                onClick={() => setShowClave(true)}
                className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 cursor-pointer"
              />
            )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          {/* Botón */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg text-white font-medium 
                       bg-gradient-to-r from-blue-600 to-blue-500 
                       hover:from-blue-700 hover:to-blue-600
                       transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Validando..." : "Iniciar sesión"}
          </Button>

          <div className="border-t pt-4 mt-4 text-center text-xs text-gray-400">
            Para soporte técnico, contacte al administrador del sistema
          </div>
        </form>
      </div>
    </div>
  );
}