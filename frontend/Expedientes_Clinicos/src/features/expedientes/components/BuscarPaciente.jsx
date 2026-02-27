import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Users, Loader2, Eye, ChevronLeft, ChevronRight, FileText, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const pacientesDB = [
  { codigo: "EXP-001", nombre: "Carlos Rodríguez", identidad: "0801-1985-12345", fechaNacimiento: "15/03/1985", telefono: "+504 9876-5432", genero: "masculino", direccion: "Col. Kennedy, Bloque D, Casa 15, Tegucigalpa", correo: "carlos.rodriguez@email.com", estado: "activo" },
  { codigo: "EXP-002", nombre: "Ana Martínez", identidad: "0501-1990-67890", fechaNacimiento: "22/07/1990", telefono: "+504 3344-5566", genero: "femenino", direccion: "Barrio La Granja, Calle Principal, Casa 23, San Pedro Sula", correo: "ana.martinez@email.com", estado: "activo" },
];

export function BuscarPaciente({ onVolver, onVerExpediente }) {
  const [criterio, setCriterio] = useState("nombre");
  const [termino, setTermino] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const resultadosPorPagina = 10;

  const handleBuscar = () => {
    if (!termino.trim()) {
      toast.error("Por favor ingrese un término de búsqueda");
      return;
    }

    setBuscando(true);
    setBusquedaRealizada(false);
    setPaginaActual(1);

    // Simulación de API con timeout
    setTimeout(() => {
      const resultadosFiltrados = pacientesDB.filter((p) => {
        const t = termino.toLowerCase();
        if (criterio === "nombre") return p.nombre.toLowerCase().includes(t);
        if (criterio === "identidad") return p.identidad.includes(t);
        if (criterio === "codigo") return p.codigo.toLowerCase().includes(t);
        if (criterio === "fecha") return p.fechaNacimiento.toLowerCase().includes(t);
        return p.codigo.toLowerCase().includes(t);
      });

      setResultados(resultadosFiltrados);
      setBuscando(false);
      setBusquedaRealizada(true);
      
      resultadosFiltrados.length > 0 
        ? toast.success(`Se encontrarin: ${resultadosFiltrados.length}`) 
        : toast.info("No se encontraron resultados");
    }, 1000);
  };

  const indexUltimoResultado = paginaActual * resultadosPorPagina;
  const indexPrimerResultado = indexUltimoResultado - resultadosPorPagina;
  const resultadosActuales = resultados.slice(indexPrimerResultado, indexUltimoResultado);
  const totalPaginas = Math.ceil(resultados.length / resultadosPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={onVolver} 
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> 
                            Volver
                        </Button>
                        <div className="border-l border-gray-300 h-6 mx-2"></div>
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Search className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-blue-900">
                                Buscar Paciente
                            </h1>
                            <p className="text-sm text-gray-600">Consultar expedientes clínicos</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-700">Usuario</p>
                                <p className="text-xs text-gray-500">Sistema SGEC</p>
                            </div>
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        {/* Main Context */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Formulario de búsqueda */}
            <Card className="mb-8 shadow-lg border-blue-100">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
                    <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <Search className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-blue-900">Búsqueda de Expedientes</CardTitle>
                        <CardDescription>
                        Ingrese los datos del paciente para buscar en el sistema
                        </CardDescription>
                    </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-3 space-y-2">
                            <Label htmlFor="criterio" className="text-gray-700">
                                Buscar por
                            </Label>
                            <Select value={criterio} onValueChange={setCriterio}>
                                <SelectTrigger id="criterio" className="border-gray-300">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nombre">Nombre Completo</SelectItem>
                                    <SelectItem value="identidad">Numero de Identidad</SelectItem>
                                    <SelectItem value="codigo">Código de Expediente</SelectItem>
                                    <SelectItem value="fecha">Fecha de nacimiento</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Barra de búsqueda */}
                        <div className="md:col-span-7 space-y-2">
                            <Label lassName="text-gray-700">
                                Término de búsqueda
                            </Label>
                            <Input 
                                id="termino"
                                type="text"
                                placeholder={
                                    criterio === "nombre"
                                        ? "Ej: Ana Martínez"
                                        : criterio === "identidad"
                                        ? "Ej: 001-2023-001"
                                        : criterio === "codigo"
                                        ? "Ej: EXP-1739728450123"
                                        : "Ej: 15/03/1985"
                                }
                                value={termino} 
                                onChange={(e) => setTermino(e.target.value)} 
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        handleBuscar();
                                    }
                                }}
                                className="pl-10 border-gray-300"
                                disabled={buscando}
                            />
                        </div>

                        {/* Botón buscar */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-transparent">Acción</label>
                            <Button 
                                onClick={handleBuscar}
                                className="w-full bg-blue-600"
                                disabled={buscando}
                            >
                                {buscando ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Buscando...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-4 w-4" />
                                        Buscar
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {busquedaRealizada && (
                <Card className="overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead>Código de Expediente</TableHead>
                        <TableHead>Nombre Completo</TableHead>
                        <TableHead>Numero de Identidad</TableHead>
                        <TableHead>Fecha de Nacimiento</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {resultados.map((p) => (
                            <TableRow key={p.codigo}>
                            <TableCell className="font-mono text-blue-600">{p.codigo}</TableCell>
                            <TableCell className="font-medium">{p.nombre}</TableCell>
                            <TableCell>{p.identidad}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => onVerExpediente(p)}>
                                <Eye className="h-4 w-4 mr-1" /> Ver
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </Card>
            )}
        </main>
    </div>
  );
}