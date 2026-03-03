import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, User, Calendar, Phone, Mail, MapPin, IdCard, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { crearExpediente, validarIdentidadDuplicada } from "../services/expedienteService";

export function FormularioExpediente({ onSuccess, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [generoSeleccionado, setGeneroSeleccionado] = useState("");
  const [idDuplicado, setIdDuplicado] = useState(false);
  const [guardandoExpediente, setGuardandoExpediente] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [resultadoRegistro, setResultadoRegistro] = useState({
    success: false,
    mensaje: "",
    numeroExpediente: null,
  });

  const obtenerMensajeError = (error) => {
    const mensajeBase =
      error?.message ||
      error?.error ||
      "Ocurrió un error al crear el expediente";

    if (mensajeBase.includes("\n")) {
      return mensajeBase.split("\n")[0].trim();
    }

    return mensajeBase;
  };

  // Validar si el ID ya existe
  const validarIdDuplicado = async (id) => {
    if (!id) {
      setIdDuplicado(false);
      return false;
    }
    try {
      const existe = await validarIdentidadDuplicada(id);
      setIdDuplicado(existe);
      return existe;
    } catch (error) {
      console.error("Error validando identidad:", error);
      setIdDuplicado(false);
      return false;
    }
  };

  const onSubmit = async (data) => {
    console.log("Formulario enviado con datos:", data);
    
    // Validar ID duplicado antes de guardar
    const existe = await validarIdDuplicado(data.numeroIdentidad);
    if (existe) {
      toast.error("El número de identidad ya existe en el sistema");
      return;
    }

    setGuardandoExpediente(true);

    try {
      // Preparar datos del paciente
      const pacienteData = {
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.numeroIdentidad,
        correo: data.correo || null,
        fechaNacimiento: data.fechaNacimiento,
        sexo: generoSeleccionado,
        direccion: data.direccion,
        telefono: data.telefono,
      };

      // Preparar datos del expediente
      const expedienteData = {
        estado: "activo",
        observaciones: "",
      };

      console.log("Enviando a API:", { pacienteData, expedienteData });

      // Llamar al API para crear el expediente
      const response = await crearExpediente(pacienteData, expedienteData);

      console.log("Respuesta del servidor:", response);

      setGuardandoExpediente(false);

      if (response.success) {
        const numeroExpediente = response.data?.expediente?.numeroExpediente || "N/A";
        
        setResultadoRegistro({
          success: true,
          mensaje: `Expediente creado exitosamente. ${numeroExpediente}`,
          numeroExpediente: numeroExpediente,
        });
        setMostrarModal(true);
      } else {
        setResultadoRegistro({
          success: false,
          mensaje: response.error || "Error desconocido al crear el expediente",
          numeroExpediente: null,
        });
        setMostrarModal(true);
      }
    } catch (error) {
      setGuardandoExpediente(false);
      console.error("Error:", error);
      
      setResultadoRegistro({
        success: false,
        mensaje: obtenerMensajeError(error),
        numeroExpediente: null,
      });
      setMostrarModal(true);
    }
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
          
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Nombres <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: Juan Carlos"
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 2, message: "Mínimo 2 caracteres" }
                })}
                className={errors.nombre ? "border-red-500" : "border-gray-300"}
              />
              {errors.nombre && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.nombre.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido" className="text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Apellidos <span className="text-red-500">*</span>
              </Label>
              <Input
                id="apellido"
                placeholder="Ej: Pérez Gómez"
                {...register("apellido", {
                  required: "El apellido es obligatorio",
                  minLength: { value: 2, message: "Mínimo 2 caracteres" }
                })}
                className={errors.apellido ? "border-red-500" : "border-gray-300"}
              />
              {errors.apellido && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.apellido.message}
                </p>
              )}
            </div>
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
            {errors.numeroIdentidad && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.numeroIdentidad.message}
              </p>
            )}
            {idDuplicado && (
              <p className="text-xs text-red-500 font-medium">Esta identidad ya está registrada.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha de Nacimiento */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" /> Fecha Nacimiento <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                {...register("fechaNacimiento", { required: "Campo obligatorio" })}
                className={errors.fechaNacimiento ? "border-red-500" : ""}
              />
              {errors.fechaNacimiento && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.fechaNacimiento.message}
                </p>
              )}
            </div>

            {/* Género (Select de UI compatible con React Hook Form) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">Sexo <span className="text-red-500">*</span></Label>
              <Select
                onValueChange={(val) => {
                  setGeneroSeleccionado(val);
                  setValue("sexo", val);
                }}
              >
                <SelectTrigger className={errors.sexo ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Hombre</SelectItem>
                  <SelectItem value="femenino">Mujer</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("sexo", { required: "Seleccione sexo" })} />
              {errors.sexo && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.sexo.message}
                </p>
              )}
            </div>
          </div>

          {/* Correo */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-600" /> Correo</Label>
            <Input 
              type="email"
              {...register("correo", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo inválido"
                }
              })} 
              placeholder="correo@ejemplo.com"
              className={errors.correo ? "border-red-500" : ""}
            />
            {errors.correo && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.correo.message}
              </p>
            )}
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> Dirección <span className="text-red-500">*</span></Label>
            <Textarea
              {...register("direccion", { required: "Dirección requerida" })}
              className={errors.direccion ? "border-red-500 resize-none" : "resize-none"}
            />
            {errors.direccion && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.direccion.message}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-600" /> Teléfono <span className="text-red-500">*</span></Label>
            <Input 
              {...register("telefono", { required: "Teléfono requerido" })} 
              className={errors.telefono ? "border-red-500" : ""}
            />
            {errors.telefono && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.telefono.message}
              </p>
            )}
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

        {/* Modal de Resultado */}
        {mostrarModal && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className={`${resultadoRegistro.success ? 'bg-green-50' : 'bg-red-50'} border-b`}>
                <div className="flex items-center gap-3">
                  {resultadoRegistro.success ? (
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                  <CardTitle className={resultadoRegistro.success ? 'text-green-900' : 'text-red-900'}>
                    {resultadoRegistro.success ? '¡Registro Exitoso!' : 'Error en el Registro'}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {resultadoRegistro.success && (
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong>Número de Expediente:</strong> {resultadoRegistro.numeroExpediente}
                    </p>
                  </div>
                )}
                <Button
                  onClick={() => {
                    setMostrarModal(false);
                    if (resultadoRegistro.success) {
                      if (onSuccess) onSuccess();
                    }
                  }}
                  className={`w-full ${resultadoRegistro.success ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Aceptar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}