import { User, IdCard, Calendar, Shield, Phone, Mail, MapPin } from "lucide-react";
import { CardContent } from "@components/ui/card";
import { TabsContent } from "@components/ui/tabs";
import { formatearFecha } from "@/utils/dateFormatter";

export function DatosPaciente({ paciente }) {

  return (
    <CardContent className="pt-6">
      <TabsContent value="datos" className="mt-0 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" /> Información Personal
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Nombre completo</p>
                  <p className="font-semibold text-gray-900">{paciente.nombre} {paciente.apellido}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <IdCard className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Número de Identidad</p>
                  <p className="font-semibold text-gray-900">{paciente.dni}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                  <p className="font-semibold text-gray-900">{formatearFecha(paciente.fechaNacimiento)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Género</p>
                    <p className="font-semibold text-gray-900 capitalize">{paciente.sexo}</p>
                  </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-600" /> Información de Contacto
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-semibold text-gray-900">{paciente.telefono}</p>
                </div>
              </div>
              {paciente.correo && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Correo Electrónico</p>
                    <p className="font-semibold text-gray-900">{paciente.correo}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Dirección</p>
                  <p className="font-semibold text-gray-900">{paciente.direccion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </CardContent>
  );
}