import React from 'react';
import { Mail, User } from "lucide-react";
import { ModalDetalleBase } from '@components/common/ModalDetalleBase';
import { DetailBox } from '@components/common/DetailBox';

export function DialogoEnvioCredenciales({ isOpen, onClose, onConfirm, usuario, procesando }) {
  if (!usuario) return null;

  return (
    <ModalDetalleBase
      isOpen={isOpen}
      onClose={onClose}
      title="Enviar Credenciales"
      subtitle="Acción de Seguridad: AUTH_MAIL_SEND"
      icon={Mail}
      footerText="Seguridad de Acceso SGEC"
      colorScheme={{
        iconBg: "bg-purple-50",
        iconText: "text-purple-600",
        border: "border-purple-100",
        accent: "text-purple-400"
      }}
      primaryAction={{
        label: procesando ? "Enviando..." : "Enviar ahora",
        onClick: () => onConfirm(usuario.id),
        icon: Mail,
        loading: procesando,
        className: "bg-purple-600 hover:bg-purple-700 text-white"
      }}
    >
      <div className="space-y-5">
        <DetailBox label="Destinatario" value={`${usuario.nombre} ${usuario.apellido}`} icon={User} />
        
        <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 space-y-2">
          <p className="text-[10px] font-bold text-purple-400 uppercase">Resumen del paquete</p>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Correo:</span>
            <span className="font-mono font-medium">{usuario.correo}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">ID Usuario:</span>
            <span className="font-bold">@{usuario.nombreUsuario}</span>
          </div>
        </div>
      </div>
    </ModalDetalleBase>
  );
}