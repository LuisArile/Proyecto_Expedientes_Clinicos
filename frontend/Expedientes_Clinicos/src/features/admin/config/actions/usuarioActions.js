import { Mail, Power, Edit } from "lucide-react";

export const usuarioActions = ({ onOpenMailModal, go, handleToggleStatus }) => {
    return [
        {
            key: "mail",
            icon: Mail,
            title: "Reenviar Credenciales",
            onClick: (usuario) => onOpenMailModal(usuario),
            className: "h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50",
            variant: "ghost",
            size: "icon"
        },
        {
            key: "edit",
            icon: Edit,
            title: "Editar",
            onClick: (usuario) => {
                go("editar-usuario", {
                    id: usuario.id
                });
            },
            className: "h-8 w-8 text-blue-600 hover:bg-blue-50",
            variant: "ghost",
            size: "icon"
        },
        {
            key: "toggle",
            icon: Power,
            title: (usuario) => usuario.activo ? "Desactivar" : "Activar",
            onClick: (usuario) => handleToggleStatus(usuario.id),
            className: (usuario) =>
                `h-8 w-8 ${usuario.activo 
                    ? 'text-red-500 hover:bg-red-50' 
                    : 'text-green-500 hover:bg-green-50'
                }`,
            variant: "ghost",
            size: "icon"
        }
    ];
};