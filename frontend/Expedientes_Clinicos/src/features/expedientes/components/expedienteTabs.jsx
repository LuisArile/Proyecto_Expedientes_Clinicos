import { User, Activity, Stethoscope, Pill, TestTube, Paperclip, FileText, History } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import { Card, CardHeader } from "@components/ui/card";

import { DatosPaciente } from "@/features/expedientes/components/section/DatosPaciente";
import { Preclinica } from "@/features/expedientes/components/section/Preclinica";
import { Consultas } from "@/features/expedientes/components/section/Consultas";
import { Recetas } from "@/features/expedientes/components/section/Recetas";
import { Documentos } from "@/features/expedientes/components/section/Documentos";
import { Diagnosticos } from "@/features/expedientes/components/section/Diagnosticos";
import { Historial } from "@/features/expedientes/components/section/Historial";
import { Examenes } from "@/features/expedientes/components/section/Examenes";

import { useAuth } from "@/features/auth/hooks/useAuth";

export function ExpedienteTabs({ tabActiva, setTabActiva, data }) {

  const { checkPermission } = useAuth();

  const tabsConfig = [
    { id: "datos", label: "Datos", icon: User, permission: "VER_DATOS_BASICOS" },
    { id: "preclinica", label: "Preclínica", icon: Activity, permission: "VER_PRECLINICAS" },
    { id: "consultas", label: "Consultas", icon: Stethoscope, permission: "VER_CONSULTAS" },
    { id: "recetas", label: "Recetas", icon: Pill, permission: "VER_RECETAS" },
    { id: "examenes", label: "Exámenes", icon: TestTube, permission: "VER_EXAMENES" },
    { id: "documentos", label: "Documentos", icon: Paperclip, permission: "VER_DOCUMENTOS" },
    { id: "diagnosticos", label: "Diagnósticos", icon: FileText, permission: "VER_DIAGNOSTICOS" },
    { id: "historial", label: "Historial", icon: History, permission: "VER_HISTORIAL_CLINICO" },
  ];

  const tabsVisibles = tabsConfig.filter(tab => checkPermission(tab.permission));

  return (
    <Card className="bg-white shadow-sm border-slate-200">
      <Tabs value={tabActiva} onValueChange={setTabActiva}>
        <CardHeader className="border-b border-gray-200 pb-0">
          <TabsList className={`grid w-full gap-1 bg-gray-100 rounded-full grid-cols-8 lg:grid-cols-${tabsVisibles.length}`}>
            {tabsVisibles.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 rounded-full text-gray-600 transition-all 
                  data-[state=active]:bg-white
                  data-[state=active]:text-black"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </CardHeader>

        {checkPermission("VER_DATOS_BASICOS") && (
          <TabsContent value="datos"><DatosPaciente paciente={data.paciente} /></TabsContent>
        )}

        {checkPermission("VER_PRECLINICAS") && (
          <TabsContent value="preclinica"><Preclinica data={data.registrosPreclinicos} /></TabsContent>
        )}

        {checkPermission("VER_CONSULTAS") && (
          <TabsContent value="consultas"><Consultas data={data.consultasMedicas} /></TabsContent>
        )}

        {checkPermission("VER_RECETAS") && (
          <TabsContent value="recetas"><Recetas data={data.consultasMedicas} /></TabsContent>
        )}

        {checkPermission("VER_EXAMENES") && (
          <TabsContent value="examenes"><Examenes data={data.consultasMedicas} /></TabsContent>        
        )}

        {checkPermission("VER_DOCUMENTOS") && (
          <TabsContent value="documentos"><Documentos data={data.documentos} /></TabsContent>
        )}

        {checkPermission("VER_DIAGNOSTICOS") && (
          <TabsContent value="diagnosticos"><Diagnosticos data={data.consultasMedicas} /></TabsContent>
        )}

        {checkPermission("VER_HISTORIAL_CLINICO") && (
          <TabsContent value="historial"><Historial data={data} /></TabsContent>
        )}
      </Tabs>
    </Card>
  );
}