import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Loader2 } from "lucide-react";

export function ModalDetalleBase({ 
    isOpen, 
    onClose, 
    title, 
    subtitle, 
    icon: Icon, 
    footerText,
    primaryAction, // { label, onClick, icon: Icon, loading, className }
    colorScheme = { 
        iconBg: "bg-slate-50", 
        iconText: "text-slate-500", 
        border: "border-slate-100",
        accent: "text-slate-400" 
    },
    children 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl gap-0 p-0 border-slate-200 shadow-xl overflow-hidden bg-white"> 
            
            <DialogHeader className={`p-6 border-b ${colorScheme.border} bg-white`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 ${colorScheme.iconBg} rounded-lg border ${colorScheme.border}`}>
                        <Icon className={`h-5 w-5 ${colorScheme.iconText}`} />
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
                            {title}
                        </DialogTitle>
                        <DialogDescription className={`text-[10px] ${colorScheme.accent} font-medium uppercase tracking-wider`}>
                            {subtitle}
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <div className="p-6">
                {children}
            </div>

            <DialogFooter className={`p-4 bg-slate-50/50 border-t ${colorScheme.border} flex items-center justify-between sm:justify-between`}>
                <div className="text-[10px] text-slate-400 px-2 italic">
                    {footerText || "Generado por el sistema SGEC"}
                </div>
            
                <div className="flex gap-2">
                    <Button 
                        variant="ghost" 
                        onClick={onClose}
                        className="text-slate-500 hover:bg-slate-100 font-semibold text-sm"
                    >
                        Cerrar
                    </Button>

                    {primaryAction && (
                    <Button 
                        onClick={primaryAction.onClick}
                        disabled={primaryAction.loading}
                        className={`${primaryAction.className} font-semibold text-sm shadow-sm`}
                    >
                        {primaryAction.loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            primaryAction.icon && <primaryAction.icon className="h-4 w-4 mr-2" />
                        )}
                        {primaryAction.label}
                    </Button>
                    )}
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}