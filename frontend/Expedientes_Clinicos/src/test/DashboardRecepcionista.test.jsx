import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { DashboardFeature } from "../features/dashboard/components/DashboardFeature";
import { MemoryRouter } from "react-router-dom";

/* -------- MOCKS -------- */

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { nombre: "Laura", apellido: "Lopez", rol: "RECEPCIONISTA" }
  })
}));

vi.mock("../features/dashboard/hooks/useDashboardData", () => ({
  useDashboardData: () => ({
    loading: false,
    tarjetas: [
      { id: "pacientes", valor: 12, pie: "nuevos" },
      { id: "expedientes", valor: 4, pie: "hoy" },
      { id: "citas", valor: 6, pie: "agendadas" }
    ],
    actividad: [
      { nombre: "Juan Perez", tipo: "EXP-01", fecha: "2026-03-16T09:10:00.000Z" }
    ]
  })
}));

// Componentes UI
vi.mock("@components/ui/card", () => ({
  Card: ({ children }) => <div>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <div>{children}</div>,
  CardDescription: ({ children }) => <div>{children}</div>
}));

// Util
vi.mock("@/utils/dateFormatter", () => ({
  obtenerFechaActual: () => "2026-03-07"
}));

/* -------- TESTS -------- */

describe("DashboardRecepcionista", () => {

  test("renderiza nombre del recepcionista", () => {
    render(
      <MemoryRouter>
        <DashboardFeature onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Bienvenido/a, Laura Lopez")
    ).toBeInTheDocument();
  });

  test("renderiza estadísticas del día", () => {
    render(
      <MemoryRouter>
        <DashboardFeature onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Pacientes Registrados")).toBeInTheDocument();
    expect(screen.getByText("Citas Agendadas")).toBeInTheDocument();
    expect(screen.getByText("Expedientes Creados")).toBeInTheDocument();
  });

  test("renderiza pacientes recientes", () => {
    render(
      <MemoryRouter>
        <DashboardFeature onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Juan Perez")).toBeInTheDocument();
    expect(screen.getByText("EXP-01")).toBeInTheDocument();
  });

});