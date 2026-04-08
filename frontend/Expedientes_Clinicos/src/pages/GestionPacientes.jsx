import { useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useExpediente } from "@/features/expedientes/hooks/useExpediente";

import { ExpedienteHeader } from "@/features/expedientes/components/visor/ExpedienteHeader";
import { PacienteResumen } from "@/features/expedientes/components/section/PacienteResumen";
import { ExpedienteTabs } from "@/features/expedientes/components/visor/ExpedienteTabs";

import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";
import { useExpedienteContext } from "@/features/expedientes/hooks/useExpedienteContext";

export function VerExpediente() {
    const { checkPermission } = useAuth();
    const { go, goBack } = useSafeNavigation();
    const { paciente: pacienteContexto } = useExpedienteContext();
    
    const VIEW_ID = "gestion-pacientes";
    
    const idParaCarga = pacienteContexto?.idPaciente
               
    console.log("Paciente en Contexto:", pacienteContexto);
    console.log("ID detectado para carga:", idParaCarga);

    const { data, loading } = useExpediente(idParaCarga);

    const [tabActiva, setTabActiva] = useState("datos");

    const puedeEditar = checkPermission("EDITAR_EXPEDIENTE");

    if (!pacienteContexto) return null;
    if (loading) return <div className="p-6">Cargando expediente...</div>;
    if (!data) return <div>Error: No se pudo cargar la información</div>;

    const handleEditar = () => {
      go("editar-expediente")
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
            <ExpedienteHeader
                paciente={data.paciente}
                expediente={data.expediente}
                onVolver={() => goBack(VIEW_ID)}
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