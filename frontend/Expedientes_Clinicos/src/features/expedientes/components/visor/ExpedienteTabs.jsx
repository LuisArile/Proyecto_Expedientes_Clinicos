import { useEffect } from "react";

import { User, Route, Activity, Stethoscope, Pill, TestTube, Paperclip, FileText, History } from "lucide-react";
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
import { TimelineAtencion } from "@/features/expedientes/components/section/TimelineAtención";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function ExpedienteTabs({ tabActiva, setTabActiva, data }) {

  const { checkPermission } = useAuth();

  const tabsConfig = [
    { id: "datos", label: "Datos", icon: User, permission: "VER_DATOS_BASICOS" },
    { id: "trazabilidad", label: "Trazabilidad", icon: Route, permission: "VER_HISTORIAL_CLINICO" },
    { id: "preclinica", label: "Preclínica", icon: Activity, permission: "VER_PRECLINICAS" },
    { id: "consultas", label: "Consultas", icon: Stethoscope, permission: "VER_CONSULTAS" },
    { id: "recetas", label: "Recetas", icon: Pill, permission: "VER_RECETAS" },
    { id: "examenes", label: "Exámenes", icon: TestTube, permission: "VER_EXAMENES" },
    { id: "documentos", label: "Documentos", icon: Paperclip, permission: "VER_DOCUMENTOS" },
    { id: "diagnosticos", label: "Diagnósticos", icon: FileText, permission: "VER_DIAGNOSTICOS" },
    { id: "historial", label: "Historial", icon: History, permission: "VER_HISTORIAL_CLINICO" },
  ];

  const tabsVisibles = tabsConfig.filter(tab => checkPermission(tab.permission));

  useEffect(() => {
    if (tabsVisibles.length > 0 && !tabsVisibles.find(t => t.id === tabActiva)) {
      setTabActiva(tabsVisibles[0].id);
    }
  }, [tabsVisibles, tabActiva, setTabActiva]);

  return (
    <Card className="bg-white shadow-sm border-slate-200">
      <Tabs value={tabActiva} onValueChange={setTabActiva}>
        <CardHeader className="border-b border-gray-200 pb-0">
          <TabsList className={`grid w-full gap-1 bg-gray-100 rounded-full grid-cols-9 lg:grid-cols-${tabsVisibles.length}`}>
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

        {tabsVisibles.map(tab => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.id === "datos" && <DatosPaciente paciente={data.paciente} />}
            {tab.id === "trazabilidad" && <TimelineAtencion></TimelineAtencion>}
            {tab.id === "preclinica" && <Preclinica data={data.registrosPreclinicos} />}
            {tab.id === "consultas" && <Consultas data={data.consultasMedicas} />}
            {tab.id === "recetas" && <Recetas data={data.consultasMedicas} />}
            {tab.id === "examenes" && <Examenes data={data.consultasMedicas} />}
            {tab.id === "documentos" && <Documentos data={data.documentos} />}
            {tab.id === "diagnosticos" && <Diagnosticos data={data.consultasMedicas} />}
            {tab.id === "historial" && <Historial data={data} />}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}