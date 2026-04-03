import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

const mockLogout = vi.fn();
const mockCheckPermission = vi.fn();

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { 
        nombre: "Carlos", 
        apellido: "Perez", 
        nombreUsuario: "cperez", 
        rol: "ADMINISTRADOR" 
    },
    logout: mockLogout,
    checkPermission: mockCheckPermission,
  }),
}));

vi.mock("@/features/auth/hooks/useRoleConfig", () => ({
  useRoleConfig: () => ({ 
    label: "Administrador", 
    color: "bg-blue-100 text-blue-800" 
  }),
}));

vi.mock("@/constants/allMenuItems", () => ({
  ALL_MENU_ITEMS: [
    { id: "dashboard", label: "Inicio", icon: () => <div data-testid="icon" />, permission: "default" },
    { id: "pacientes", label: "Pacientes", icon: () => <div data-testid="icon" />, permission: "VER_PACIENTES" },
  ],
}));

import { Sidebar } from "@components/layout/sidebar";

describe("Sidebar", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockCheckPermission.mockImplementation(() => true);
  });

  test("renderiza información del usuario e iniciales en el avatar", () => {
    render(<Sidebar currentView="dashboard" onNavigate={mockNavigate} />);
    
    expect(screen.getByText("Carlos Perez")).toBeInTheDocument();
    expect(screen.getByText("@cperez")).toBeInTheDocument();
    expect(screen.getByText("CP")).toBeInTheDocument();
  });

  test("renderiza menú filtrado según checkPermission", () => {
    mockCheckPermission.mockImplementation((perm) => perm === "default");

    render(<Sidebar currentView="dashboard" onNavigate={mockNavigate} />);
    
    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.queryByText("Pacientes")).not.toBeInTheDocument();
  });

  test("aplica estilos de activo al item actual", () => {
    render(<Sidebar currentView="dashboard" onNavigate={mockNavigate} />);
    
    const button = screen.getByText("Inicio").closest("button");
    expect(button).toHaveClass("bg-blue-600");
  });

  test("navega al hacer click en los botones de acción inferior", () => {
    render(<Sidebar currentView="dashboard" onNavigate={mockNavigate} />);
    
    const btnPass = screen.getByText(/Cambiar contraseña/i);
    fireEvent.click(btnPass);
    expect(mockNavigate).toHaveBeenCalledWith("changepassword");

    const btnLogout = screen.getByText(/Cerrar Sesión/i);
    fireEvent.click(btnLogout);
    expect(mockLogout).toHaveBeenCalled();
  });
});