import React, { useState } from "react";
import { Hospital, LogOut, KeyRound, ChevronRight, ChevronLeft } from "lucide-react";

import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { ALL_MENU_ITEMS } from "@/constants/allMenuItems";
import { useRoleConfig } from "@/features/auth/hooks/useRoleConfig";
import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";

export function Sidebar({ currentView  }) {
  const { user, logout, checkPermission } = useAuth();
  const { go } = useSafeNavigation();
  const roleConfig = useRoleConfig(user?.rol);

  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;
  
  const menuItems = ALL_MENU_ITEMS.filter(item => 
    item.permission === "default" || checkPermission(item.permission)
  );

  return (
    <div className={`flex flex-col h-screen ${isCollapsed ? "w-20" : "w-64"} bg-white border-r border-gray-200 shadow-lg transition-all duration-300 relative`}>
      
      {/* Botón para contraer/expandir */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-blue-600 text-white rounded-full p-1 shadow-md hover:bg-blue-700 z-50"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shrink-0">
            <Hospital className="h-6 w-6 text-blue-600" />
          </div>
          {!isCollapsed && (
            <div className="text-white whitespace-nowrap">
              <h2 className="font-bold text-sm">SGEC</h2>
              <p className="text-xs text-blue-100">Sistema de Expedientes</p>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0 font-bold text-blue-700">
            {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.nombre} {user.apellido}</p>
              <p className="text-xs text-gray-500 truncate">@{user.nombreUsuario}</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <Badge variant="outline" className={`text-xs px-2 py-1 ${roleConfig.color}`}>
            {roleConfig.label}
          </Badge>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {!isCollapsed && (
          <p className="text-xs font-semibold text-gray-500 mb-3 px-3 uppercase">Menú</p>
        )}
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                title={isCollapsed ? item.label : ""}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-gray-500"}`} />
                {!isCollapsed && (
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-medium truncate">{item.label}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Changepassword / Logout Button */}
      <div className={`transition-all duration-300 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white ${isCollapsed ? "p-2" : "p-5"}`}>
        <Button
          onClick={(e) => {
            e.preventDefault();
            go("changepassword");
          }}
          title={isCollapsed ? "Cambiar contraseña" : ""}
          className={`w-full flex items-center transition-all duration-200 rounded-xl
                      border border-blue-200
                      text-gray-700 bg-gray-50 hover:bg-blue-50
                      hover:text-blue-700 hover:border-blue-600 mb-3 
            ${isCollapsed ? "justify-center p-2 h-10" : "px-4 py-2 gap-2"}`}
        >
          <KeyRound className={`shrink-0 text-gray-500 group-hover:text-blue-600 ${isCollapsed ? "h-5 w-5" : "h-5 w-5"}`} />
          {!isCollapsed && (
            <span className="text-sm font-medium whitespace-nowrap">
              Cambiar contraseña
            </span>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={logout}
          title={isCollapsed ? "Cerrar Sesión" : ""}
          className={`w-full flex items-center transition-all duration-200 rounded-xl
                    border border-red-400 text-red-600
                    font-medium hover:bg-red-600
                    hover:text-white hover:border-red-600 
            ${isCollapsed ? "justify-center p-2 h-10" : "justify-center gap-2 px-4 py-2"}`}
        >
          <LogOut className={`shrink-0 ${isCollapsed ? "h-5 w-5" : "h-4 w-4"}`} />
          {!isCollapsed && (
            <span className="text-sm whitespace-nowrap">Cerrar Sesión</span>
          )}
        </Button>
      </div>

      {/* Footer */}
      <div className={`transition-all duration-300 text-center bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 ${isCollapsed ? "p-2" : "p-4"}`}>
        <span className="text-base font-medium text-gray-600">
          <span className={`inline-flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {!isCollapsed && <span className="whitespace-nowrap">Sesión activa</span>}
          </span>
        </span>
      </div>
    </div>
  );
}