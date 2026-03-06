import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { DashboardRecepcionista } from "../features/dashboard/components/DashboardRecepcionista";
import { MemoryRouter } from "react-router-dom";

/* -------- MOCKS -------- */

// AuthContext
vi.mock("@/features/auth/AuthContext", () => ({
  useAuth: () => ({
    user: { nombre: "Laura", apellido: "Lopez" }
  })
}));

// Hook
vi.mock("../features/dashboard/hooks/useRecepcionistaDashboard", () => ({
  useRecepcionistaDashboard: () => ({
    loading: false,
    estadisticas: {
      horaInicio: "08:00",
      pacientesAtendidos: 12,
      citasAgendadas: 6,
      expedientesCreados: 4
    },
    registro: [
      { nombre: "Juan", apellido: "Perez", id: "EXP-01", hora: "09:10" }
    ]
  })
}));

// Componentes UI
vi.mock("@/components/ui/card", () => ({
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
        <DashboardRecepcionista />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Bienvenido/a, Laura Lopez")
    ).toBeInTheDocument();
  });

  test("renderiza estadísticas del día", () => {
    render(
      <MemoryRouter>
        <DashboardRecepcionista />
      </MemoryRouter>
    );

    expect(screen.getByText("Pacientes atendidos")).toBeInTheDocument();
    expect(screen.getByText("Citas Agendadas")).toBeInTheDocument();
    expect(screen.getByText("Expedientes Creados")).toBeInTheDocument();
  });

  test("renderiza pacientes recientes", () => {
    render(
      <MemoryRouter>
        <DashboardRecepcionista />
      </MemoryRouter>
    );

    expect(screen.getByText("Juan Perez")).toBeInTheDocument();
    expect(screen.getByText("EXP-01")).toBeInTheDocument();
    expect(screen.getByText("09:10")).toBeInTheDocument();
  });

});