import React, { useState, useMemo, useCallback } from 'react';
import { Users, UserPlus, Loader2, CheckCircle2, Power, Search } from "lucide-react";

import { Button } from "@components/ui/button";
import { StatCard } from "@components/common/StatCard"
import { useAuth } from "@/features/auth/hooks/useAuth";
import { DataTable } from "@components/common/DataTable";
import { PageHeader } from "@components/layout/PageHeader";
import { FilterInput } from "@components/common/FilterSearch"
import { Card, CardTitle, CardDescription, CardContent, CardHeader } from "@components/ui/card";

import { useUsuarios } from '@/features/admin/hooks/useUsuarios';
import { DialogoEnvioCredenciales } from '@/features/admin/components/DialogoEnvioCredenciales';

import { useTableFactory } from "../../shared/hooks/useTableFactory";
import { usuarioActions } from "@/features/admin/components/actions/usuarioActions";
import { getUsuarioBaseColumns } from "@/features/admin/components/columns/usuarioBaseColumns";

export function GestionUsuarios({ onNavigate, onVolver }) {
    const { user: currentUser } = useAuth();

    const { 
        usuarios, loading, busqueda, setBusqueda, handleToggleStatus, handleSendCredentials 
    } = useUsuarios();

    const [isMailModalOpen, setIsMailModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sending, setSending] = useState(false);

    const usuariosExcluyendoActual = useMemo(() => {
        return usuarios.filter(u => u.id !== currentUser?.id);
    }, [usuarios, currentUser]);

    const handleOpenMailModal = useCallback((usuario) => {
        setSelectedUser(usuario);
        setIsMailModalOpen(true);
    }, []);

    const actions = useMemo(() => usuarioActions({
        onOpenMailModal: handleOpenMailModal,
        onNavigate,
        handleToggleStatus
    }), [handleOpenMailModal, onNavigate, handleToggleStatus]);

    const columns = useTableFactory({
        columns: getUsuarioBaseColumns(),
        actions
    });

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