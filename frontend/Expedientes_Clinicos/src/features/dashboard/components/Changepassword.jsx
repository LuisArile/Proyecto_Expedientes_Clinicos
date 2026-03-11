import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff, Search, ShieldCheck, ArrowLeft } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useAuth } from "@/features/auth/AuthContext";
import { FormField } from "@/components/common/FormField";
import { PageHeader } from "@/components/layout/PageHeader";
import { useChangePassword } from "../hooks/useChangePassword";

export function Changepassword( onVolver ) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { changePassword, loading, error, success } = useChangePassword();

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
        setTimeout(() => navigate("/dashboard"), 1500);
      }    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
    
      <PageHeader
            title="Cambiar contraseña" subtitle="Cambiar contraseña de usuario" Icon={Search}
            onVolver={onVolver}
      />

      <Card className="w-full max-w-md mx-auto shadow-lg border-blue-100 mt-4 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 pb-6">
          {/* Icono */}
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <Lock className="text-blue-600 w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">Cambiar Contraseña</CardTitle>
          <CardDescription className="text-center text-gray-500 text-sm mb-6">
            Clínica Médica Vida Plena - Sistema de Gestión Hospitalaria
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Usuario fijo */} 
            <FormField label="Usuario" icon={User}>
              <Input 
                value={user?.nombreUsuario || "Usuario"} 
                disabled
                className="bg-gray-50 border-gray-200 text-gray-500 font-medium cursor-not-allowed"
              />
            </FormField>

            {/* Contraseña actual */}
            <FormField label="Contraseña actual" icon={Lock} required>
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
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
            <FormField label="Nueva contraseña" icon={Lock} required>
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

            <FormField label="Confirmar Nueva contraseña" icon={Lock} required>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme su nueva contraseña"
                  className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900"
                  required                
                />
                {showNew ? (
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
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md"
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
                className="w-full flex items-center justify-center text-sm text-slate-500 hover:text-slate-800 transition-colors"
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