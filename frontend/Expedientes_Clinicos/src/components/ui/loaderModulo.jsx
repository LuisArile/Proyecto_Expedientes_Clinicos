export function LoaderModulo() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-4 animate-in fade-in duration-500">
            <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-sm font-semibold text-slate-600 tracking-wide">
                Preparando módulo clínico
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest animate-pulse">
                Cargando recursos...
                </p>
            </div>
        </div>
    );
}