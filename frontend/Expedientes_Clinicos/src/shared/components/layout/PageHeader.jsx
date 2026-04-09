import React from "react";
import { Button } from "@components/ui/button";
import { Users, ArrowLeft } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRoleConfig } from "@/features/auth/hooks/useRoleConfig";

export function PageHeader({ title, subtitle, Icon, onVolver, rightContent}) {
    const { user } = useAuth();
    const roleConfig = useRoleConfig(user?.rol?.nombre || user?.rol);

    const displayName = user?.nombre && user?.apellido 
        ? `${user.nombre} ${user.apellido}` 
        : user?.nombreUsuario || "Invitado";

    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {onVolver && (
                    <>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={onVolver}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                            <ArrowLeft className="size-4 mr-2" /> Volver
                        </Button>
                        <div className="border-l border-gray-300 h-6 mx-2"/>
                    </>
                    )}
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-blue-900">{title}</h1>
                        <p className="text-sm text-gray-600">{subtitle}</p>
                    </div>
                </div>

                {rightContent ? (
                    rightContent
                ) : (
                    <div className="flex items-center gap-4">

                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-700">{displayName}</p>
                            <p className={`text-[10px] px-2 py-0.5 rounded-full inline-block font-semibold uppercase tracking-wider ${roleConfig.color}`}>
                                {roleConfig.label}
                            </p>
                        </div>
                        <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="size-5 text-blue-600" />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}