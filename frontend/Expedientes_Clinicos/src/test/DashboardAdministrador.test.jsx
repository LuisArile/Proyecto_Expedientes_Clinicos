import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { DashboardAdministrador } from "../features/dashboard/components/DashboardAdministrador";
import { MemoryRouter } from "react-router-dom";

/* ---------------- MOCKS ---------------- */

// Mock AuthContext
vi.mock("@/features/auth/AuthContext", () => ({
  useAuth: () => ({
    user: {
      nombre: "Juan",
      apellido: "Perez"
    }
  })
}));

// Mock hook del dashboard
vi.mock("../features/dashboard/hooks/useAdminDashboard", () => ({
  useAdminDashboard: () => ({
    loading: false,
    estadisticas: {
      usuariosActivos: 10,
      eventosHoy: 5,
      medicamentos: 20,
      tiposExamen: 8
    },
    actividad: [
      {
        usuario: "admin",
        accion: "Creó un usuario",
        hora: "10:30"
      }
    ]
  })
}));

// Mock componentes UI (para evitar dependencias visuales)
vi.mock("@/components/ui/card", () => ({
  Card: ({ children }) => <div>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <div>{children}</div>,
  CardDescription: ({ children }) => <div>{children}</div>
}));

/* ---------------- TESTS ---------------- */

describe("DashboardAdministrador", () => {

  test("renderiza nombre del usuario", () => {

    render(
      <MemoryRouter>
        <DashboardAdministrador />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Bienvenido/a, Juan Perez")
    ).toBeInTheDocument();

  });

  test("renderiza estadísticas", () => {

    render(
      <MemoryRouter>
        <DashboardAdministrador />
      </MemoryRouter>
    );

    expect(screen.getByText("Usuarios Activos")).toBeInTheDocument();
    expect(screen.getByText("Eventos Hoy")).toBeInTheDocument();
    expect(screen.getAllByText("Medicamentos")[0]).toBeInTheDocument();
    expect(screen.getByText("Tipos de Examen")).toBeInTheDocument();

  });

  test("renderiza actividad reciente", () => {

    render(
      <MemoryRouter>
        <DashboardAdministrador />
      </MemoryRouter>
    );

    expect(screen.getByText("Creó un usuario")).toBeInTheDocument();
    expect(screen.getByText("10:30")).toBeInTheDocument();

  });

});