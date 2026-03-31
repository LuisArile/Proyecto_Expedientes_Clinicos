import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

export function StatusModal({ isOpen, result, onClose }) {
    if (!isOpen) return null;

    const isSuccess = result.success;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <Card className="w-full max-w-md border-none shadow-2xl animate-in zoom-in-95 duration-200 rounded-2xl overflow-hidden bg-white">
                <CardHeader className={`${isSuccess ? 'bg-blue-50' : 'bg-red-50'} border-b border-gray-100 pb-4`}>
                    <div className="flex flex-col items-center gap-2 pt-2">
                        {isSuccess ? (
                            <CheckCircle2 className="h-12 w-12 text-blue-600 mb-1" />
                        ) : (
                            <XCircle className="h-12 w-12 text-red-600 mb-1" />
                        )}
                        <CardTitle className={`text-xl font-bold ${isSuccess ? 'text-blue-900' : 'text-red-900'}`}>
                            {isSuccess ? '¡Operación Exitosa!' : 'Hubo un inconveniente'}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 pb-8 px-8 space-y-6">
                    <p className="text-slate-600 text-center text-balance leading-relaxed">
                        {result.mensaje}
                    </p>
                    {isSuccess && result.numeroExpediente && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-1">
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                                Referencia del Registro
                            </span>
                            <p className="text-lg text-blue-700 font-mono font-bold tracking-wider">
                                {result.numeroExpediente}
                            </p>
                        </div>
                    )}
                    <Button 
                        onClick={onClose} 
                        className={`w-full 
                            ${isSuccess 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-red-600 hover:bg-red-700'
                            }`}
                    >
                        Continuar
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}