import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { DashboardFeature } from "../features/dashboard/components/DashboardFeature";
import { MemoryRouter } from "react-router-dom";

/* ---------------- MOCKS ---------------- */

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      nombre: "Ana",
      apellido: "Gomez",
      rol: "ENFERMERO"
    }
  })
}));

vi.mock("../features/dashboard/hooks/useDashboardData", () => ({
  useDashboardData: () => ({
    loading: false,
    tarjetas: [
      { id: "pacientesEvaluados", valor: 8, pie: "atendidos" },
      { id: "evaluacionesPendientes", valor: 3, pie: "pendientes" }
    ],
    actividad: [
      {
        nombre: "Carlos Perez",
        tipo: "Triage",
        fecha: "2026-03-16T09:20:00.000Z"
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
        <DashboardFeature onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Bienvenido/a, Ana Gomez")
    ).toBeInTheDocument();

  });

  test("renderiza estadísticas", () => {

    render(
      <MemoryRouter>
        <DashboardFeature onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Pacientes Evaluados")).toBeInTheDocument();
    expect(screen.getByText("Evaluaciones Pendientes")).toBeInTheDocument();

  });

  test("renderiza pacientes en espera", () => {

    render(
      <MemoryRouter>
        <DashboardFeature onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Carlos Perez")).toBeInTheDocument();
    expect(screen.getByText("Triage")).toBeInTheDocument();

  });

  test("permite navegar desde tarjeta con destino", () => {

    const onNavigate = vi.fn();

    render(
      <MemoryRouter>
        <DashboardFeature onNavigate={onNavigate} />
      </MemoryRouter>
    );

    screen.getByText("Pacientes Evaluados").click();
    expect(onNavigate).toHaveBeenCalledWith("pacientes-evaluados");

  });

});