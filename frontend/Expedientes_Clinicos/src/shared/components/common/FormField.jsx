import { Label } from "@components/ui/label";
import { AlertCircle } from "lucide-react";

export function FormField({ label, icon: Icon, error, required, children, className = "" }) {
    return (
        <div className={`space-y-2 ${className}`}>
        {label && (
            <Label className="text-gray-700 flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-blue-600" />}
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
        )}
        
        {children}

        {error && (
            <p className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-3 w-3" /> {error}
            </p>
        )}
        </div>
    );
}