import React from "react";
import { Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function SearchFilterCard({ 
  criterio, 
  setCriterio, 
  termino, 
  setTermino, 
  onSearch, 
  isLoading 
}) {
    
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading && termino.trim() !== "") {
      onSearch();
    }
  };

  const placeholders = {
    nombre: "Ej: Ana Martínez",
    identidad: "Ej: 0801-1990-12345",
    codigo: "Ej: EXP-2024-001",
    fecha: "DD/MM/AAAA"
  };

  return (
    <Card className="mb-8 shadow-lg border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Search className="size-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-blue-900">Búsqueda de Expedientes</CardTitle>
            <CardDescription>
              Filtre por los datos registrados del paciente
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Selector de Criterio */}
          <div className="md:col-span-3 space-y-2">
            <Label htmlFor="criterio" className="text-gray-700">
              Buscar por
            </Label>
            <Select value={criterio} onValueChange={setCriterio}>
              <SelectTrigger id="criterio" className="border-gray-300">
                <SelectValue placeholder="Seleccione criterio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nombre">Nombre Completo</SelectItem>
                <SelectItem value="identidad">Número de Identidad</SelectItem>
                <SelectItem value="codigo">Código de Expediente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Input de Texto */}
          <div className="md:col-span-6 space-y-2">
            <Label htmlFor="termino" className="text-gray-700">
              Término de búsqueda
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                id="termino"
                type="text"
                placeholder={placeholders[criterio] || "Escriba aquí..."}
                value={termino} 
                onChange={(e) => setTermino(e.target.value)} 
                onKeyDown={handleKeyPress}
                className="pl-10 border-gray-300"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Botón de Acción */}
          <div className="md:col-span-2 space-y-2">
            <Label className="text-transparent">Placeholder</Label>
            <Button 
              onClick={onSearch}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              // disabled={buscando}
              disabled={isLoading || !termino.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar Paciente
                </>
              )}
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}