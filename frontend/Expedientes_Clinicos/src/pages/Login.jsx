import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { User, Lock, Eye, Activity, EyeOff } from "lucide-react";
import { FormField } from "@/components/common/FormField";
import { useLoginForm } from "../hooks/useLoginForm";
import { FormHeader } from "@/components/common/FormHeader";

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
    } catch {
      setError("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <FormHeader />

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Usuario */}
          <FormField label="Usuario" required>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                name="nombreUsuario"
                type="text"
                placeholder="Ingrese su usuario"
                value={formData.nombreUsuario}
                onChange={handleChange}
                className="text-gray-800 w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                required
              />
            </div>
          </FormField>

          {/* Password */}
          <FormField label="Contraseña" required>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                name="clave"
                type={showClave ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={formData.clave}
                onChange={handleChange}
                className="text-gray-800 w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowClave(!showClave)}
                className="absolute right-3 top-3 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showClave ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm text-center animate-pulse">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-blue-500 
                       hover:from-blue-700 hover:to-blue-600 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Validando acceso..." : "Iniciar sesión"}
          </Button>

          <div className="border-t pt-4 mt-4 text-center text-xs text-gray-400">
            Para soporte técnico, contacte al administrador del sistema
          </div>
        </form>
      </div>
    </div>
  );
}