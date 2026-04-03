import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { DashboardFeature } from "../features/dashboard/components/DashboardFeature";
import { MemoryRouter } from "react-router-dom";

/* ---------------- MOCKS ---------------- */

// Mock useAuth
vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      nombre: "Juan",
      apellido: "Perez",
      rol: "ADMINISTRADOR"
    }
  })
}));

// Mock hook de dashboard nuevo
vi.mock("../features/dashboard/hooks/useDashboardData", () => ({
  useDashboardData: () => ({
    loading: false,
    tarjetas: [
      { id: "usuarios", valor: 10, pie: "usuarios conectados" },
      { id: "auditoria", valor: 5, pie: "eventos hoy" },
      { id: "medicamentos", valor: 20, pie: "catálogo" },
      { id: "examenes", valor: 8, pie: "tipos" }
    ],
    actividad: [
      {
        usuario: "admin",
        accion: "Creó un usuario",
        fecha: "2026-03-16T10:30:00.000Z"
      }
    ]
  })
}));

// Mock componentes UI (para evitar dependencias visuales)
vi.mock("@components/ui/card", () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardDescription: ({ children, ...props }) => <div {...props}>{children}</div>
}));

/* ---------------- TESTS ---------------- */

describe("DashboardAdministrador", () => {

  test("renderiza nombre del usuario", () => {

    render(
      <MemoryRouter>
        <DashboardFeature onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Bienvenido/a, Juan Perez")
    ).toBeInTheDocument();

  });

  test("renderiza estadísticas", () => {

    render(
      <MemoryRouter>
        <DashboardFeature onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Usuarios Activos")).toBeInTheDocument();
    expect(screen.getByText("Eventos de Auditoría")).toBeInTheDocument();
    expect(screen.getAllByText("Medicamentos")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Exámenes")[0]).toBeInTheDocument();

  });

  test("renderiza actividad reciente", () => {

    render(
      <MemoryRouter>
        <DashboardFeature onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Creó un usuario")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();

  });

  test("navega al seleccionar un modulo", () => {

    const onNavigate = vi.fn();

    render(
      <MemoryRouter>
        <DashboardFeature onNavigate={onNavigate} />
      </MemoryRouter>
    );

    screen.getByText("Usuarios").click();

    expect(onNavigate).toHaveBeenCalledWith("/usuarios");

  });

});