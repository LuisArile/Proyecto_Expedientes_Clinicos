import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Sidebar } from "../components/layout/sidebar";
import { MemoryRouter } from "react-router-dom";

/* ---------- MOCKS ---------- */

const mockLogout = vi.fn();
const mockNavigate = vi.fn();
const authState = {
  user: {
    nombre: "Carlos",
    apellido: "Perez",
    nombreUsuario: "cperez",
    rol: "ADMINISTRADOR",
    permisos: ["CREAR_EXPEDIENTE"]
  },
  logout: mockLogout
};

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => authState
}));

/* ---------- TESTS ---------- */

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = {
      nombre: "Carlos",
      apellido: "Perez",
      nombreUsuario: "cperez",
      rol: "ADMINISTRADOR",
      permisos: ["CREAR_EXPEDIENTE"]
    };
    authState.logout = mockLogout;
  });

  test("renderiza información del usuario", () => {

    render(
      <MemoryRouter>
        <Sidebar currentView="dashboard" onNavigate={mockNavigate} />
      </MemoryRouter>
    );

    expect(screen.getByText("Carlos Perez")).toBeInTheDocument();
    expect(screen.getByText("@cperez")).toBeInTheDocument();

  });

  test("renderiza menú según permisos", () => {

    render(
      <MemoryRouter>
        <Sidebar currentView="dashboard" onNavigate={mockNavigate} />
      </MemoryRouter>
    );

    expect(screen.getByText("Crear Expediente")).toBeInTheDocument();
    expect(screen.queryByText("Gestión de Roles")).not.toBeInTheDocument();

  });

  test("navega al hacer click en item permitido", () => {

    render(
      <MemoryRouter>
        <Sidebar currentView="dashboard" onNavigate={mockNavigate} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Crear Expediente"));

    expect(mockNavigate).toHaveBeenCalledWith("crear-expediente");

  });

  test("navega a cambiar contraseña", () => {

    render(
      <MemoryRouter>
        <Sidebar currentView="dashboard" onNavigate={mockNavigate} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Cambiar contraseña"));

    expect(mockNavigate).toHaveBeenCalledWith("changepassword");

  });

  test("ejecuta logout", () => {

    render(
      <MemoryRouter>
        <Sidebar currentView="dashboard" onNavigate={mockNavigate} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Cerrar Sesión"));

    expect(mockLogout).toHaveBeenCalled();

  });

  test("si no hay usuario no renderiza contenido", () => {

    authState.user = null;

    const { container } = render(
      <MemoryRouter>
        <Sidebar currentView="inicio" onNavigate={mockNavigate} />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();

  });

});