import { vi, describe, test, beforeEach, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";

// --- MOCKS ---
vi.mock("../features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../shared/services/ViewRegistry", () => ({
  viewRegistry: {
    getAllViews: vi.fn(),
  },
}));

vi.mock("../features/dashboard/hooks/useSafeNavigation", () => ({
  useSafeNavigation: vi.fn(),
}));

vi.mock("../features/dashboard/hooks/usePacienteSelection", () => ({
  usePacienteSelection: vi.fn(),
}));

vi.mock("../features/dashboard/hooks/useTriajeState", () => ({
  useTriajeState: vi.fn(),
}));

vi.mock("../shared/components/layout/DashboardLayout", () => ({
  DashboardLayout: ({ children }) => <div data-testid="layout">{children}</div>,
}));

vi.mock("../shared/components/ui/loaderModulo", () => ({
  LoaderModulo: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock("../features/expedientes/context/ExpedienteProvider", () => ({
  ExpedienteProvider: ({ children }) => <div data-testid="expediente-provider">{children}</div>,
}));

vi.mock("../features/consultas/context/ConsultaProvider", () => ({
  ConsultaProvider: ({ children }) => <div data-testid="consulta-provider">{children}</div>,
}));

vi.mock("../features/preclinica/context/PreclinicaProvider", () => ({
  PreclinicaProvider: ({ children }) => <div data-testid="preclinica-provider">{children}</div>,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

import { useAuth } from "../features/auth/hooks/useAuth";
import { viewRegistry } from "../shared/services/ViewRegistry";
import { useSafeNavigation } from "../features/dashboard/hooks/useSafeNavigation";
import { usePacienteSelection } from "../features/dashboard/hooks/usePacienteSelection";
import { useTriajeState } from "../features/dashboard/hooks/useTriajeState";
import { useLocation } from "react-router-dom";

describe("Dashboard Component", () => {
  const mockGo = vi.fn();
  const mockSetSelectedPaciente = vi.fn();
  const mockSetPacienteEnAtencion = vi.fn();
  const adminUser = { id: 1, nombre: "Admin", idRol: 1, rol: "administrador" };

  beforeEach(() => {
    vi.clearAllMocks();
    
    useSafeNavigation.mockReturnValue({ go: mockGo });
    usePacienteSelection.mockReturnValue({
      selectedPaciente: null,
      setSelectedPaciente: mockSetSelectedPaciente,
    });
    useTriajeState.mockReturnValue({
      pacienteEnAtencion: null,
      setPacienteEnAtencion: mockSetPacienteEnAtencion,
    });
    useLocation.mockReturnValue({
      pathname: "/sistema/",
      state: null,
    });

    viewRegistry.getAllViews.mockReturnValue([
      { id: "inicio", path: "/", component: () => <div>Inicio</div> },
      { id: "gestion-pacientes", path: "/gestion/paciente", component: () => <div>Gestion</div>, requiresPaciente: true },
    ]);
  });

  test("muestra loader si no hay usuario", () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("renderiza layout cuando hay usuario", () => {
    useAuth.mockReturnValue({ user: adminUser, loading: false });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });

  test("llama getAllViews para obtener vistas disponibles", () => {
    useAuth.mockReturnValue({ user: adminUser, loading: false });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(viewRegistry.getAllViews).toHaveBeenCalled();
  });

  test("usa paciente de location.state si no hay selectedPaciente", () => {
    const pacienteMock = { id: 1, nombre: "Juan" };
    useAuth.mockReturnValue({ user: adminUser, loading: false });
    useLocation.mockReturnValue({
      pathname: "/sistema/gestion/paciente",
      state: { paciente: pacienteMock },
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(mockGo).not.toHaveBeenCalledWith("buscar-paciente");
  });

  test("redirige a buscar-paciente si no hay paciente para gestion-pacientes", () => {
    useAuth.mockReturnValue({ user: adminUser, loading: false });
    useLocation.mockReturnValue({
      pathname: "/sistema/gestion/paciente",
      state: null,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(mockGo).toHaveBeenCalledWith("buscar-paciente");
  });

  test("renderiza layout cuando la ruta no requiere paciente", () => {
    useAuth.mockReturnValue({ user: adminUser, loading: false });
    useLocation.mockReturnValue({
      pathname: "/sistema/",
      state: null,
    });
    
    usePacienteSelection.mockReturnValue({
      selectedPaciente: { id: 1, nombre: "Juan" },
      setSelectedPaciente: mockSetSelectedPaciente,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(mockSetSelectedPaciente).not.toHaveBeenCalled();
  });
});