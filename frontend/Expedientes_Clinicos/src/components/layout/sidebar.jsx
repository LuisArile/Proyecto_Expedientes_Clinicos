import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/useAuth";
import { ROLE_STRATEGIES } from "@/constants/roles"
import { ALL_MENU_ITEMS } from "@/constants/allMenuItems";

import {
  Hospital, LogOut, KeyRound
} from "lucide-react";

export function Sidebar({ currentView, onNavigate  }) {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const roleKey = user.rol?.toUpperCase();
  
  const menuItems = ALL_MENU_ITEMS.filter(item => {
    return user.permisos?.includes(item.permission) || item.permission === "default";
  });

  const roleConfig = ROLE_STRATEGIES[roleKey] || { 
    label: roleKey, 
    color: "bg-gray-100 text-gray-800" 
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200 shadow-lg">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg">
            <Hospital className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-white">
            <h2 className="font-bold text-sm">SGEC</h2>
            <p className="text-xs text-blue-100">Sistema de Expedientes</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-700 font-semibold text-sm">
              {user.nombre
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {user.nombre} {user.apellido}
            </p>
            <p className="text-xs text-gray-500">@{user.nombreUsuario}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`text-xs px-2 py-1 ${roleConfig.color}`}
        >
          {roleConfig.label}
        </Badge>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 mb-3 px-3">
            MENÚ PRINCIPAL
          </p>
          {menuItems.length > 0 ? (
            menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">
                    {item.label}
                  </p>
                  {item.description && !isActive && (
                    <p className="text-xs text-gray-500">{item.description}</p>
                  )}
                </div>
              </button>
            );
          })
          ) : (
            <p className="text-sm text-gray-500 px-3"> 
              No tienes permisos asignados.</p>
          )}
          </div>
        </div>

      {/* Logout Button */}
      <div className="p-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <Button
          onClick={() => onNavigate("changepassword")}
          className="w-full flex items-center gap-2  mb-3 rounded-xl 
                    border border-blue-200
                    text-gray-700 bg-gray-50 
                    hover:bg-blue-50 hover:text-blue-700
                    hover:border-blue-600 
                    transition-all duration-200"
        >
          <KeyRound className="h-5 w-5 text-gray-500 group-hover:text-blue-600" />
          <span className="text-sm font-medium">
            Cambiar contraseña
          </span>
        </Button>
        <Button
          variant="outline"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2
                    rounded-xl border border-red-400
                    text-red-600 font-medium
                    hover:bg-red-600 hover:text-white
                    hover:border-red-600
                    transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>

      {/* Footer */}
      <div className="p-4 text-center bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
        <span className="text-base font-medium text-gray-600">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Sesión activa
          </span>
        </span>
      </div>
    </div>
  );
}
