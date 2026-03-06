import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { DashboardDoctor } from "../features/dashboard/components/DashboardDoctor";
import { MemoryRouter } from "react-router-dom";

/* ---------------- MOCKS ---------------- */

// Mock AuthContext
vi.mock("@/features/auth/AuthContext", () => ({
  useAuth: () => ({
    user: {
      nombre: "Carlos",
      apellido: "Ramirez"
    }
  })
}));

// Mock hook
vi.mock("../features/dashboard/hooks/useDoctorDashboard", () => ({
  useDoctorDashboard: () => ({
    loading: false,
    estadisticas: {
      horaInicio: "08:00",
      consultasRealizadas: 5,
      consultasPendientes: 3,
      examenesOrdenados: 2
    },
    consulta: [
      {
        nombre: "Juan Pérez",
        tipo: "Consulta general",
        hora: "09:30"
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

// Mock util
vi.mock("@/utils/dateFormatter", () => ({
  obtenerFechaActual: () => "2026-03-07"
}));

/* ---------------- TESTS ---------------- */

describe("DashboardDoctor", () => {

  test("renderiza nombre del doctor", () => {

    render(
      <MemoryRouter>
        <DashboardDoctor />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Bienvenido/a, Carlos Ramirez")
    ).toBeInTheDocument();

  });

  test("renderiza estadísticas", () => {

    render(
      <MemoryRouter>
        <DashboardDoctor />
      </MemoryRouter>
    );

    expect(screen.getByText("Consultas Realizadas")).toBeInTheDocument();
    expect(screen.getByText("Consultas Pendientes")).toBeInTheDocument();
    expect(screen.getByText("Exámenes Ordenados")).toBeInTheDocument();

  });

  test("renderiza próximas consultas", () => {

    render(
      <MemoryRouter>
        <DashboardDoctor />
      </MemoryRouter>
    );

    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByText("Consulta general")).toBeInTheDocument();
    expect(screen.getByText("09:30")).toBeInTheDocument();

  });

});