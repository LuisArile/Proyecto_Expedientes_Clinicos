import React from 'react';

export function DetailBox({ label, value, icon: Icon, className = "" }) {
    return (
        <div className={`flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 ${className}`}>
        
        <div className="h-10 w-10 shrink-0 rounded-lg bg-white flex items-center justify-center border border-slate-200 text-slate-400 shadow-sm">
            <Icon className="h-5 w-5" />
        </div>

        
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">
                {label}
            </p>
            <p className="text-sm font-semibold text-slate-700 truncate">
                {value || "---"}
            </p>
        </div>
        </div>
    );
}