import { ROLE_STRATEGIES } from "@/constants/roles";

export function useRoleConfig(roleName) {
  const roleKey = roleName?.toUpperCase().trim();
  
  const config = ROLE_STRATEGIES[roleKey] || { 
    label: roleName || "Invitado", 
    color: "bg-gray-100 text-gray-800 border-gray-200" 
  };

  return config;
}