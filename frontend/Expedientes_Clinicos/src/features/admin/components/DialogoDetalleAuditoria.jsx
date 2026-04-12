import React from 'react';
import { Mail, User, Activity } from "lucide-react";
import { Label } from "@components/ui/label";
import { ModalDetalleBase } from '@components/common/ModalDetalleBase';
import { DetailBox } from '@components/common/DetailBox';

export function DialogoDetalleAuditoria({ isOpen, onClose, evento }) {
  if (!evento) return null;

  return (
    <ModalDetalleBase
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle del Evento"
      subtitle={`Referencia: ${evento?.id}`}
      icon={Mail}
      footerText="Seguridad de Acceso SGEC"
      colorScheme={{
        iconBg: "bg-purple-50",
        iconText: "text-purple-600",
        border: "border-purple-100",
        accent: "text-purple-400"
      }}
    >
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <DetailBox label="Usuario" value={evento?.usuario} icon={User} />
                <DetailBox label="Módulo" value={evento?.modulo} icon={Activity}/>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metadatos del Registro</Label>
                <span className="text-[10px] text-slate-300 font-mono italic">application/json</span>
                </div>
                <pre className="bg-slate-50 text-slate-700 p-5 rounded-xl text-xs font-mono max-h-[280px] overflow-auto border border-slate-200 shadow-inner leading-relaxed">
                    {evento?.detalles}
                </pre>
            </div>
        </div>
    </ModalDetalleBase>
  );
}