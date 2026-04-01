import { useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useExpediente } from "@/features/expedientes/hooks/useExpediente";

import { ExpedienteHeader } from "@/features/expedientes/components/expedienteHeader";
import { PacienteResumen } from "@/features/expedientes/components/pacienteResumen";
import { ExpedienteTabs } from "@/features/expedientes/components/expedienteTabs";
export function VerExpediente({ paciente, onVolver, onEditarExpediente }) {
    const { checkPermission } = useAuth();
    
    const idParaCarga = paciente?.expedientes?.idExpediente || paciente?.idExpediente

    const { data, loading } = useExpediente(idParaCarga);

    const [tabActiva, setTabActiva] = useState("datos");

    const puedeEditar = checkPermission("EDITAR_EXPEDIENTE") || checkPermission("ADMINISTRAR_SISTEMA");

    if (loading) return <div className="p-6">Cargando...</div>;

    if (!data) return <div>Error cargando expediente</div>;

    const handleEditar = () => {
      if (onEditarExpediente) {
        onEditarExpediente({ ...data, idExpediente: idParaCarga });
      }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
            <ExpedienteHeader
                paciente={data.paciente}
                expediente={data.expediente}
                onVolver={onVolver}
                onEditar={handleEditar}
                puedeEditar={puedeEditar}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <PacienteResumen paciente={data.paciente} />
                
                <ExpedienteTabs
                    data={data}
                    tabActiva={tabActiva}
                    setTabActiva={setTabActiva}
                />
            </main>
        </div>
    );
}