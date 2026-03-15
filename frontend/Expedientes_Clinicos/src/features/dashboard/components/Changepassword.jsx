import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff, Search, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useAuth } from "@/features/auth/useAuth";
import { FormField } from "@/components/common/FormField";
import { PageHeader } from "@/components/layout/PageHeader";
import { useChangePassword } from "../hooks/useChangePassword";
import { FormHeader } from "@/components/common/FormHeader";

export function Changepassword( { onVolver } ) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { changePassword, loading, error, success, setError, setSuccess } = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");
    setSuccess("");

    const isOk = await changePassword(currentPassword, newPassword, confirmPassword);
      if (isOk) {
        setTimeout(() => {
          if (onVolver) onVolver();
          else navigate("/dashboard");
        }, 2000);
      }    
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 px-4 pb-8">
    
      <PageHeader title="Cambiar contraseña" subtitle="Cambiar contraseña de usuario" Icon={Search} onVolver={onVolver} />

      <Card className="w-full max-w-md mx-auto shadow-lg border-blue-100 mt-6 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 py-4">
          <FormHeader title="Cambiar Contraseña" subtitle="Actualice sus credenciales de acceso" icon={Lock} compact={true}/>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Usuario fijo */} 
            <FormField label="Usuario">
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input 
                  value={user?.nombreUsuario || "Usuario"} 
                  disabled
                  className="bw-full pl-10 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 text-sm"
                />
              </div>
            </FormField>

            {/* Contraseña actual */}
            <FormField label="Contraseña actual" required>
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingrese su contraseña actual"
                  className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900"
                  required
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
            </FormField>

            {/* Nueva contraseña */}
            <FormField label="Nueva contraseña" required>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingrese su nueva contraseña"
                  className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900"
                  required                
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
            </FormField>

            <FormField label="Confirmar Nueva contraseña" required>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme su nueva contraseña"
                  className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900"
                  required                
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
            </FormField>

            {error && <p className="text-destructive text-sm text-center font-medium">{error}</p>}
            {success && <p className="text-green-600 text-sm text-center font-medium">{success}</p>}

            <div className="pt-2 space-y-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg text-white font-medium 
                          bg-gradient-to-r from-blue-600 to-blue-500 
                          hover:from-blue-700 hover:to-blue-600"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Guardando...</>
                ) : (
                  <><ShieldCheck className="mr-2 h-5 w-5" /> Guardar cambios</>
                )}
              </Button>

              <Button
                type="button"
                // onClick={onCancel}
                onClick={() => { navigate("/dashboard");}}
                className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-red-600 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar y volver
              </Button>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-6 text-center">
              <p className="text-[11px] text-slate-400 leading-tight">
                Para mayor seguridad, se recomienda cambiar su contraseña cada 90 días
              </p>
            </div>
          </form>
        </CardContent>        
      </Card>
    </div>
  );
}