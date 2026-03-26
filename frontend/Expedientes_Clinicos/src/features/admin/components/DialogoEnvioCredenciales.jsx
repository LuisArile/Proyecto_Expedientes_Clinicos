import React from 'react';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from "../../../components/ui/alert-dialog";
import { Mail, Loader2, Info } from "lucide-react";

export function DialogoEnvioCredenciales({ isOpen, onClose, onConfirm, usuario, procesando }) {
  if (!usuario) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-purple-700">
            <Mail className="h-5 w-5" />
            Enviar Credenciales de Acceso
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-sm text-muted-foreground space-y-4 pt-2">
              <p>
                Se enviará un correo electrónico a <span className="font-bold text-gray-900">{usuario.correo}</span> con las credenciales para <span className="font-bold text-gray-900">{usuario.nombre} {usuario.apellido}</span>.
              </p>
              
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <p className="text-xs font-semibold text-purple-800 uppercase mb-2 flex items-center gap-1">
                  <Info className="h-3 w-3" /> El correo incluirá:
                </p>
                <ul className="list-disc list-inside text-sm text-purple-900 space-y-1">
                  <li>Nombre de usuario: <strong>@{usuario.nombreUsuario}</strong></li>
                  <li>Contraseña temporal generada</li>
                  <li>Instrucciones de cambio de clave</li>
                </ul>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={procesando}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm(usuario.id);
            }}
            disabled={procesando}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {procesando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Enviar ahora
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}