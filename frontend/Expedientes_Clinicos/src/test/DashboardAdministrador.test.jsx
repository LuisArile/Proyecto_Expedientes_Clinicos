import { vi, describe, test, beforeEach, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dashboard } from "../features/pages/Dashboard";

// Mocks
vi.mock("../features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../features/dashboard/utils/verRegistro", () => ({
  getView: vi.fn(),
}));

vi.mock("../shared/components/layout/DashboardLayout", () => ({
  DashboardLayout: ({ children }) => <div data-testid="layout">{children}</div>,
}));

vi.mock("../shared/components/ui/loaderModulo", () => ({
  LoaderModulo: () => <div data-testid="loader">Loading...</div>,
}));

import { useAuth } from "../features/auth/hooks/useAuth";
import { getView } from "../features/dashboard/utils/verRegistro";

describe("Dashboard Component", () => {
  const mockComponent = vi.fn(() => <div>Vista mock</div>);

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    getView.mockReturnValue({
      component: mockComponent,
    });
  });

  test("muestra loader si no hay usuario", () => {
    useAuth.mockReturnValue({ user: null });

    render(<Dashboard />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("renderiza layout cuando hay usuario", () => {
    useAuth.mockReturnValue({ user: { id: 1 } });

    render(<Dashboard />);

    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });

  test("usa vista por defecto 'inicio'", () => {
    useAuth.mockReturnValue({ user: { id: 1 } });

    render(<Dashboard />);

    expect(getView).toHaveBeenCalledWith("inicio");
  });

  test("usa vista desde localStorage", () => {
    localStorage.setItem("sgec_view", "consulta-medica");

    useAuth.mockReturnValue({ user: { id: 1 } });

    render(<Dashboard />);

    expect(getView).toHaveBeenCalledWith("consulta-medica");
  });

  test("guarda vista en localStorage", () => {
    useAuth.mockReturnValue({ user: { id: 1 } });

    render(<Dashboard />);

    expect(localStorage.getItem("sgec_view")).toBe("inicio");
  });

  test("usa paciente simulado si no hay en localStorage", () => {
    useAuth.mockReturnValue({ user: { id: 1 } });

    render(<Dashboard />);

    const stored = JSON.parse(localStorage.getItem("sgec_selected_paciente"));

    expect(stored.codigo).toBe("PAC-001");
  });

  test("usa paciente desde localStorage", () => {
    const paciente = { codigo: "X1" };
    localStorage.setItem("sgec_selected_paciente", JSON.stringify(paciente));

    useAuth.mockReturnValue({ user: { id: 1 } });

    render(<Dashboard />);

    const stored = JSON.parse(localStorage.getItem("sgec_selected_paciente"));

    expect(stored.codigo).toBe("X1");
  });

  test("redirige a buscar-paciente si no hay paciente y vista protegida", () => {
    localStorage.setItem("sgec_view", "consulta-medica");

    useAuth.mockReturnValue({ user: { id: 1 } });

    // CLAVE: forzar null real
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "sgec_selected_paciente") return "null";
      if (key === "sgec_view") return "consulta-medica";
      return null;
    });

    render(<Dashboard />);

    expect(getView).toHaveBeenCalledWith("buscar-paciente");
  });

  test("pasa props correctamente al componente dinámico", () => {
    useAuth.mockReturnValue({ user: { id: 1 } });

    render(<Dashboard />);

    const props = mockComponent.mock.calls[0][0];

    expect(props).toEqual(
      expect.objectContaining({
        paciente: expect.any(Object),
        onVolver: expect.any(Function),
        onConsultaMedica: expect.any(Function),
        onEditarExpediente: expect.any(Function),
        onNavigate: expect.any(Function),
      })
    );
  });
});