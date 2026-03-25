import React, { useState, useMemo } from 'react';
import { useUsuarios } from '@/features/admin/hooks/useUsuarios';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Search, Loader2, CheckCircle2, Power, Mail, Edit } from "lucide-react";
import { DialogoEnvioCredenciales } from '../features/admin/components/DialogoEnvioCredenciales';
import { TablaUsuarios } from '../features/admin/components/TablaUsuarios';

import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/layout/PageHeader";

export function GestionUsuarios({ onNavigate, onVolver }) {
    const { usuarios, loading, busqueda, setBusqueda, handleToggleStatus, handleSendCredentials, stats } = useUsuarios();

    const [isMailModalOpen, setIsMailModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sending, setSending] = useState(false);

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
            accessorKey: "fechaCreacion",
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
                        className="h-8 w-8 text-blue-600"
                        onClick={() => {
                            sessionStorage.setItem("edit_user_id", usuario.id);
                            onNavigate('formulario-usuario');
                        }}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                        size="icon" variant="ghost" 
                        className={`h-8 w-8 ${usuario.activo ? 'text-red-500' : 'text-green-500'}`}
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
                    <StatCard title="Total" value={stats.total} icon={<Users className="text-blue-600" />} />
                    <StatCard title="Activos" value={stats.activos} icon={<CheckCircle2 className="text-green-600" />} color="text-green-600" />
                    <StatCard title="Inactivos" value={stats.inactivos} icon={<Power className="text-red-600" />} color="text-red-600" />
                </div>

                <Card className="bg-white shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <Input
                                placeholder="Buscar por nombre, usuario o correo..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="pl-10"
                            />
                            <Button 
                                onClick={() => {
                                    sessionStorage.removeItem("edit_user_id");
                                    onNavigate('formulario-usuario');
                                }}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <UserPlus className="h-4 w-4 mr-2" /> Nuevo Usuario
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable 
                            columns={columns} 
                            data={usuarios}
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

function StatCard({ title, value, icon, color = "text-gray-900" }) {
    return (
        <Card className="border-none shadow-sm bg-white">
            <CardContent className="pt-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">{title}</p>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                </div>
                <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center">{icon}</div>
            </CardContent>
        </Card>
    );
}