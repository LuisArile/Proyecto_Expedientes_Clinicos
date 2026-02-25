import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, User, Calendar, Phone, Mail, MapPin, IdCard, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// Simulación de IDs existentes en el sistema
const idsExistentes = ["001-2023-001", "001-2023-002", "001-2024-015"];

export function FormularioExpediente({ onSuccess, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const [generoSeleccionado, setGeneroSeleccionado] = useState("");
  const [idDuplicado, setIdDuplicado] = useState(false);
  const [guardandoExpediente, setGuardandoExpediente] = useState(false);
  
  // Observar el campo de identidad para validaciones en tiempo real
  const numeroIdentidad = watch("numeroIdentidad");

  // Validar si el ID ya existe
  const validarIdDuplicado = (id) => {
    if (!id) return false;
    const existe = idsExistentes.includes(id);
    setIdDuplicado(existe);
    return existe;
  };

  const onSubmit = async (data) => {
    // Validar ID duplicado antes de guardar
    if (validarIdDuplicado(data.numeroIdentidad)) {
      toast.error("El número de identidad ya existe en el sistema");
      return;
    }

    setGuardandoExpediente(true);

    // Simular guardado asíncrono
    setTimeout(() => {
      const idExpediente = `EXP-${Date.now()}`;
      
      console.log("Expediente creado con éxito:", {
        idExpediente,
        ...data,
        genero: generoSeleccionado,
      });

      setGuardandoExpediente(false);
      
      toast.success(`Expediente creado exitosamente`, {
        description: `ID: ${idExpediente}`,
        duration: 5000,
      });

      // Redirigir o limpiar vista después del éxito
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onCancel) onCancel();
      }, 2000);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-blue-100 mt-4">
      <CardHeader className="space-y-1 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl text-blue-900">Crear Nuevo Expediente</CardTitle>
            <CardDescription className="text-gray-600">
              Registro oficial de paciente en el sistema clínico
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Nombre Completo */}
          <div className="space-y-2">
            <Label htmlFor="nombreCompleto" className="text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Nombre Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombreCompleto"
              placeholder="Ej: Juan Pérez"
              {...register("nombreCompleto", {
                required: "El nombre es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" }
              })}
              className={errors.nombreCompleto ? "border-red-500" : "border-gray-300"}
            />
            {errors.nombreCompleto && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.nombreCompleto.message}
              </p>
            )}
          </div>

          {/* Número de Identidad con validación de duplicados */}
          <div className="space-y-2">
            <Label htmlFor="numeroIdentidad" className="text-gray-700 flex items-center gap-2">
              <IdCard className="h-4 w-4 text-blue-600" />
              Número de Identidad <span className="text-red-500">*</span>
            </Label>
            <Input
              id="numeroIdentidad"
              placeholder="0000-0000-00000"
              {...register("numeroIdentidad", {
                required: "La identidad es obligatoria",
                pattern: {
                  value: /^[0-9]{4}-[0-9]{4}-[0-9]{5}$/,
                  message: "Formato requerido: 0000-0000-00000"
                }
              })}
              onBlur={(e) => validarIdDuplicado(e.target.value)}
              className={errors.numeroIdentidad || idDuplicado ? "border-red-500" : "border-gray-300"}
            />
            {idDuplicado && (
              <p className="text-xs text-red-500 font-medium">Esta identidad ya está registrada.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha de Nacimiento */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" /> Fecha Nacimiento
              </Label>
              <Input
                type="date"
                {...register("fechaNacimiento", { required: "Campo obligatorio" })}
                className={errors.fechaNacimiento ? "border-red-500" : ""}
              />
            </div>

            {/* Género (Select de UI compatible con React Hook Form) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">Género</Label>
              <Select
                onValueChange={(val) => {
                  setGeneroSeleccionado(val);
                  setValue("genero", val);
                }}
              >
                <SelectTrigger className={errors.genero ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="femenino">Femenino</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("genero", { required: "Seleccione género" })} />
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> Dirección</Label>
            <Textarea
              {...register("direccion", { required: "Dirección requerida" })}
              className="resize-none"
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-600" /> Teléfono</Label>
            <Input {...register("telefono", { required: "Teléfono requerido" })} />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={guardandoExpediente}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {guardandoExpediente ? "Guardando..." : "Confirmar Registro"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}