import React, { useState, useMemo } from 'react';
import { useUsuarios } from '@/features/admin/hooks/useUsuarios';
import { Card, CardTitle, CardDescription, CardContent, CardHeader } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Users, UserPlus, Loader2, CheckCircle2, Power, Mail, Edit, Search } from "lucide-react";
import { DialogoEnvioCredenciales } from '@/features/admin/components/DialogoEnvioCredenciales';

import { DataTable } from "@components/common/DataTable";
import { PageHeader } from "@components/layout/PageHeader";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { StatCard } from "@components/common/StatCard"
import { FilterInput } from "@components/common/FilterSearch"

export function GestionUsuarios({ onNavigate, onVolver }) {
    const { user: currentUser } = useAuth();
    const { usuarios, loading, busqueda, setBusqueda, handleToggleStatus, handleSendCredentials } = useUsuarios();

    const [isMailModalOpen, setIsMailModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sending, setSending] = useState(false);

    const usuariosExcluyendoActual = useMemo(() => {
        return usuarios.filter(u => u.id !== currentUser?.id);
    }, [usuarios, currentUser]);

    const columns = useMemo(() => [
        {
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
            header: "Rol",
            accessorKey: "rolNombre",
            render: (usuario) => (
                <Badge variant="outline" className="font-normal">
                    {usuario.rolNombre}
                </Badge>
            )
        },
        {
            header: "Estado",
            accessorKey: "activo",
            render: (usuario) => (
                <Badge className={usuario.activo ? 'bg-green-100 text-green-700 border-none' : 'bg-red-100 text-red-700 border-none'}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                </Badge>
            )
        },
        {
            header: "Registro",
            accessorKey: "updatedAt",
            render: (usuario) => (
                <span className="text-sm text-gray-600">
                    {new Date(usuario.updatedAt).toLocaleDateString()}
                </span>
            )
        },
        {
            header: "Acciones",
            id: "actions",
            className: "text-center",
            render: (usuario) => (
                <div className="flex justify-center gap-1">
                    <Button 
                        size="icon" variant="ghost" 
                        title="Reenviar Credenciales"
                        className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        onClick={() => {
                            setSelectedUser(usuario);
                            setIsMailModalOpen(true);
                        }}
                    >
                        <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                        size="icon" variant="ghost" 
                        title="Editar"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                            sessionStorage.setItem("edit_user_id", usuario.id);
                            onNavigate('formulario-usuario');
                        }}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                        size="icon" variant="ghost" 
                        title={usuario.activo ? "Desactivar" : "Activar"}
                        className={`h-8 w-8 ${usuario.activo ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                        onClick={() => handleToggleStatus(usuario.id)}
                    >
                        <Power className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ], [handleToggleStatus, onNavigate]);

    const confirmSendCredentials = async (id) => {
        setSending(true);
        await handleSendCredentials(id);
        setSending(false);
        setIsMailModalOpen(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="mt-2 text-gray-500">Cargando personal...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">

            <PageHeader title="Gestión de Usuarios" subtitle="Administrar accesos y roles del sistema" Icon={UserPlus} onVolver={onVolver}/>

            <main className="min-h-screen bg-slate-50/50 p-6 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Otros Usuarios" value={usuariosExcluyendoActual.length} icon={Users} iconColor="text-blue-600"/>
                    <StatCard title="Activos" value={usuariosExcluyendoActual.filter(u => u.activo).length} icon={CheckCircle2} iconColor="text-green-600" />
                    <StatCard title="Inactivos" value={usuariosExcluyendoActual.filter(u => !u.activo).length} icon={Power} iconColor="text-red-600" />
                </div>

                <Card className="bg-white shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Listado de Usuarios</CardTitle>
                                <CardDescription>Gestione los usuarios del sistema</CardDescription>
                            </div>
                            <Button 
                                onClick={() => {
                                    sessionStorage.removeItem("edit_user_id");
                                    onNavigate('formulario-usuario');
                                }}
                                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                            >
                                <UserPlus className="h-4 w-4 mr-2" /> Nuevo Usuario
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <div className="relative">    
                                <FilterInput icon={Search} value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre, usuario o correo..." />
                            </div>
                        </div>

                        <DataTable 
                            columns={columns} 
                            data={usuariosExcluyendoActual}
                            searchPlaceholder="Buscar por nombre, usuario o correo..."
                            searchValue={busqueda}
                            onSearchChange={setBusqueda}
                        />
                    </CardContent>
                </Card>

                <DialogoEnvioCredenciales 
                    isOpen={isMailModalOpen}
                    onClose={() => setIsMailModalOpen(false)}
                    onConfirm={confirmSendCredentials}
                    usuario={selectedUser}
                    procesando={sending}
                />
            </main>
        </div>
    );
}