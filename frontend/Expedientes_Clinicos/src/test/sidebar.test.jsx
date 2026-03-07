import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { Sidebar } from "../components/layout/sidebar";
import { MemoryRouter } from "react-router-dom";

/* ---------- MOCKS ---------- */

const mockLogout = vi.fn();
const mockNavigate = vi.fn();

/* Mock correcto del AuthContext */
vi.mock("@/features/auth/AuthContext", () => ({
  useAuth: () => ({
    user: {
      nombre: "Carlos",
      apellido: "Perez",
      nombreUsuario: "cperez",
      rol: "ADMINISTRADOR"
    },
    logout: mockLogout
  })
}));

vi.mock("@/constants/menuStrategies", () => ({
  MENU_STRATEGIES: {
    ADMINISTRADOR: [
      {
        id: "dashboard",
        label: "Dashboard",
        description: "Panel principal",
        icon: () => <span>icon</span>
      }
    ]
  }
}));

vi.mock("@/constants/roles", () => ({
  ROLE_STRATEGIES: {
    ADMINISTRADOR: {
      label: "Administrador",
      color: "bg-blue"
    }
  }
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  )
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children }) => <span>{children}</span>
}));

/* ---------- TESTS ---------- */

describe("Sidebar", () => {

  test("renderiza información del usuario", () => {

    render(
      <MemoryRouter>
        <Sidebar currentView="dashboard" onNavigate={mockNavigate} />
      </MemoryRouter>
    );

    expect(screen.getByText("Carlos Perez")).toBeInTheDocument();
    expect(screen.getByText("@cperez")).toBeInTheDocument();

  });

  test("renderiza menú según rol", () => {

    render(
      <MemoryRouter>
        <Sidebar currentView="dashboard" onNavigate={mockNavigate} />
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();

  });

  test("navega al hacer click en item del menú", () => {

    render(
      <MemoryRouter>
        <Sidebar currentView="dashboard" onNavigate={mockNavigate} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Dashboard"));

    expect(mockNavigate).toHaveBeenCalledWith("dashboard");

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

});