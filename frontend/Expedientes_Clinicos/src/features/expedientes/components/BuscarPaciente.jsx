import React, { useState } from "react";

import { useBuscarPacientes } from "../hooks/useBuscarPaciente";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Users, Loader2, Eye, ChevronLeft, ChevronRight, FileText, ArrowLeft } from "lucide-react";

export function BuscarPaciente({ onVolver, onVerExpediente }) {
    
    const [criterio, setCriterio] = useState("nombre");

    const {
        termino,
        setTermino,
        pagina,
        paginacion,
        buscando,
        resultados,
        busquedaRealizada,
        ejecutarBusqueda
    } = useBuscarPacientes();

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !buscando) {
            ejecutarBusqueda(1);
        }
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
                            <Label className="text-gray-700">
                                Término de búsqueda
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input 
                                    id="termino"
                                    type="text"
                                    placeholder={
                                        criterio === "nombre" ? "Ej: Ana Martínez" :
                                        criterio === "identidad" ? "Ej: 001-2023-001" :
                                        criterio === "codigo" ? "Ej: EXP-1739728450123" : "Ej: 15/03/1985"
                                    }
                                    value={termino} 
                                    onChange={(e) => setTermino(e.target.value)} 
                                    onKeyDown={handleKeyPress}
                                    className="pl-10 border-gray-300"
                                    disabled={buscando}
                                />
                            </div>
                        </div>

                        {/* Botón buscar */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-transparent">Acción</label>
                            <Button 
                                onClick={() => ejecutarBusqueda(1)}
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
                        {/* <TableHead>Fecha de Nacimiento</TableHead> */}
                        <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.isArray(resultados) && resultados.length > 0 ? (
                            resultados.map((p) => (
                                <TableRow key={p.idPaciente || p.codigo || Math.random()}>
                                    <TableCell className="font-mono text-blue-600">
                                        {p.expedientes?.numeroExpediente || p.codigo || "SIN EXP"}
                                    </TableCell>
                                    <TableCell className="font-medium">{`${p.nombre || ''} ${p.apellido || ''}`}</TableCell>
                                    <TableCell>{p.dni || p.identidad}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => onVerExpediente(p)}>
                                            <Eye className="h-4 w-4 mr-1" /> Ver
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                                    No se encontraron pacientes que coincidan con la búsqueda.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                    {/* Paginación Dinámica */}
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
                        <p className="text-sm text-gray-500">
                            Página <span className="font-medium text-blue-600">{pagina}</span> de{" "}
                            <span className="font-medium">{paginacion.totalPaginas}</span>
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagina === 1 || buscando}
                                onClick={() => ejecutarBusqueda(pagina - 1)}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagina === paginacion.totalPaginas || buscando}
                                onClick={() => ejecutarBusqueda(pagina + 1)}
                            >
                                Siguiente <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>

                </Card>
            )}
        </main>
    </div>
  );
}