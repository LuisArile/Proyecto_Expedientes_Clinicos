import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Changepassword } from "@/features/dashboard/components/Changepassword";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "@/features/auth/components/AuthContext";
import { securityService } from "@/features/dashboard/services/securityService";

/* ---------------- MOCKS ---------------- */

// mock navigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock("@/features/dashboard/services/securityService", () => ({
  securityService: {
    cambiarPassword: vi.fn()
  }
}));

function renderWithAuth(ui) {
  return render(
    <AuthContext.Provider
      value={{
        user: {
          id: 1,
          nombreUsuario: "admin"
        },
        updateUser: vi.fn()
      }}
    >
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
}

/* ---------------- TESTS ---------------- */

describe("Changepassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renderiza el formulario correctamente", () => {

    renderWithAuth(<Changepassword />);

    expect(screen.getByText("Cambiar Contraseña")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingrese su contraseña actual")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingrese su nueva contraseña")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirme su nueva contraseña")).toBeInTheDocument();

  });

  test("muestra error si las contraseñas no coinciden", async () => {

    renderWithAuth(<Changepassword />);

    fireEvent.change(screen.getByPlaceholderText("Ingrese su contraseña actual"), {
      target: { value: "Actual123!" }
    });

    fireEvent.change(screen.getByPlaceholderText("Ingrese su nueva contraseña"), {
      target: { value: "Nueva123!" }
    });

    fireEvent.change(screen.getByPlaceholderText("Confirme su nueva contraseña"), {
      target: { value: "Otra123!" }
    });

    fireEvent.click(screen.getByText("Guardar cambios"));

    await waitFor(() => {
      expect(screen.getByText("Las contraseñas no coinciden")).toBeInTheDocument();
    });
    expect(securityService.cambiarPassword).not.toHaveBeenCalled();

  });

  test("envía cambio de contraseña correctamente", async () => {

    securityService.cambiarPassword.mockResolvedValue({ success: true });

    renderWithAuth(<Changepassword />);

    fireEvent.change(screen.getByPlaceholderText("Ingrese su contraseña actual"), {
      target: { value: "Actual123!" }
    });

    fireEvent.change(screen.getByPlaceholderText("Ingrese su nueva contraseña"), {
      target: { value: "Nueva123!" }
    });

    fireEvent.change(screen.getByPlaceholderText("Confirme su nueva contraseña"), {
      target: { value: "Nueva123!" }
    });

    fireEvent.click(screen.getByText("Guardar cambios"));

    await waitFor(() => {
      expect(securityService.cambiarPassword).toHaveBeenCalledWith(1, "Actual123!", "Nueva123!");
    });

  });

  test("muestra mensaje de éxito y ejecuta onVolver", async () => {
    const onVolver = vi.fn();
    securityService.cambiarPassword.mockResolvedValue({ success: true });

    renderWithAuth(<Changepassword onVolver={onVolver} />);

    fireEvent.change(screen.getByPlaceholderText("Ingrese su contraseña actual"), {
      target: { value: "Actual123!" }
    });

    fireEvent.change(screen.getByPlaceholderText("Ingrese su nueva contraseña"), {
      target: { value: "Nueva123!" }
    });

    fireEvent.change(screen.getByPlaceholderText("Confirme su nueva contraseña"), {
      target: { value: "Nueva123!" }
    });

    fireEvent.click(screen.getByText("Guardar cambios"));

    await waitFor(() => {
      expect(screen.getByText("Contraseña actualizada correctamente")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(onVolver).toHaveBeenCalled();
    }, { timeout: 3000 });

  });

});