import { Badge } from "@components/ui/badge";
import { ROLE_STRATEGIES } from "@/constants/roles";

export const getUsuarioBaseColumns = () => [
    {
        id: "nombre",
        header: "Usuario",
        accessorKey: "nombre",
        render: (usuario) => (
            <div>
                <p className="font-medium text-gray-900">{usuario.nombre} {usuario.apellido}</p>
                <p className="text-xs text-gray-500">@{usuario.nombreUsuario} • {usuario.correo}</p>
            </div>
        )
    },
    {
        id: "rol",
        header: "Rol",
        accessorKey: "rolNombre",
        render: (usuario) => { 
            const roleStyle = ROLE_STRATEGIES[usuario.rolNombre?.toUpperCase()] || { label: usuario.rol, color: "bg-gray-100" };
            return (
                <Badge variant="outline" className={`${roleStyle.color} font-normal`}>
                    {usuario.rolNombre}
                </Badge>
            );
        }
    },
    {
        id: "estado",
        header: "Estado",
        accessorKey: "activo",
        render: (usuario) => (
            <Badge className={usuario.activo ? 'bg-green-100 text-green-700 border-none' : 'bg-red-100 text-red-700 border-none'}>
                {usuario.activo ? 'Activo' : 'Inactivo'}
            </Badge>
        )
    },
    {
        id: "registro",
        header: "Registro",
        accessorKey: "updatedAt",
        render: (usuario) => (
            <span className="text-sm text-gray-600">
                {new Date(usuario.updatedAt).toLocaleDateString()}
            </span>
        )
    }
];