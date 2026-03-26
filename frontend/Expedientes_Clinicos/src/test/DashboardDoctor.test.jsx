import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { DashboardFeature } from "../features/dashboard/components/DashboardFeature";
import { MemoryRouter } from "react-router-dom";

/* ---------------- MOCKS ---------------- */

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      nombre: "Carlos",
      apellido: "Ramirez",
      rol: "MEDICO"
    }
  })
}));

vi.mock("../features/dashboard/hooks/useDashboardData", () => ({
  useDashboardData: () => ({
    loading: false,
    tarjetas: [
      { id: "consultasRealizadas", valor: 5, pie: "hoy" },
      { id: "consultasPendientes", valor: 3, pie: "pendientes" },
      { id: "examenesOrdenados", valor: 2, pie: "ordenados" }
    ],
    actividad: [
      {
        nombre: "Juan Pérez",
        tipo: "Consulta general",
        fecha: "2026-03-16T09:30:00.000Z"
      }
    ]
  })
}));

// Mock componentes UI
vi.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardDescription: ({ children, ...props }) => <div {...props}>{children}</div>
}));

// Mock util
vi.mock("@/utils/dateFormatter", () => ({
  obtenerFechaActual: () => "2026-03-07"
}));

/* ---------------- TESTS ---------------- */

describe("DashboardDoctor", () => {

  test("renderiza nombre del doctor", () => {

    render(
      <MemoryRouter>
        <DashboardFeature onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Bienvenido/a, Carlos Ramirez")
    ).toBeInTheDocument();

  });

  test("renderiza estadísticas", () => {

    render(
      <MemoryRouter>
        <DashboardFeature onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Consultas Realizadas")).toBeInTheDocument();
    expect(screen.getByText("Consultas Pendientes")).toBeInTheDocument();
    expect(screen.getByText("Exámenes Ordenados")).toBeInTheDocument();

  });

  test("renderiza próximas consultas", () => {

    render(
      <MemoryRouter>
        <DashboardFeature onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByText("Consulta general")).toBeInTheDocument();

  });

});