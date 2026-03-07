import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { DashboardEnfermero } from "../features/dashboard/components/Dashboardenfermero";
import { MemoryRouter } from "react-router-dom";

/* ---------------- MOCKS ---------------- */

// Mock AuthContext
vi.mock("@/features/auth/AuthContext", () => ({
  useAuth: () => ({
    user: {
      nombre: "Ana",
      apellido: "Gomez"
    }
  })
}));

// Mock hook
vi.mock("../features/dashboard/hooks/useEnfermeroDashboard", () => ({
  useEnfermeroDashboard: () => ({
    loading: false,
    estadisticasHoy: {
      horaInicio: "08:00",
      pacientesEvaluados: 8,
      evaluacionesPendientes: 3
    },
    consulta: [
      {
        nombre: "Carlos Perez",
        tipo: "Triage",
        hora: "09:20"
      }
    ]
  })
}));

// Mock componentes UI
vi.mock("@/components/ui/card", () => ({
  Card: ({ children }) => <div>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <div>{children}</div>,
  CardDescription: ({ children }) => <div>{children}</div>
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children }) => <span>{children}</span>
}));

// Mock util
vi.mock("@/utils/dateFormatter", () => ({
  obtenerFechaActual: () => "2026-03-07"
}));

/* ---------------- TESTS ---------------- */

describe("DashboardEnfermero", () => {

  test("renderiza nombre del enfermero", () => {

    render(
      <MemoryRouter>
        <DashboardEnfermero />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Bienvenido/a, Ana Gomez")
    ).toBeInTheDocument();

  });

  test("renderiza estadísticas", () => {

    render(
      <MemoryRouter>
        <DashboardEnfermero />
      </MemoryRouter>
    );

    expect(screen.getByText("Pacientes Evaluados")).toBeInTheDocument();
    expect(screen.getByText("Evaluaciones Pendientes")).toBeInTheDocument();

  });

  test("renderiza pacientes en espera", () => {

    render(
      <MemoryRouter>
        <DashboardEnfermero />
      </MemoryRouter>
    );

    expect(screen.getByText("Carlos Perez")).toBeInTheDocument();
    expect(screen.getByText("Triage")).toBeInTheDocument();
    expect(screen.getByText("09:20")).toBeInTheDocument();

  });

});