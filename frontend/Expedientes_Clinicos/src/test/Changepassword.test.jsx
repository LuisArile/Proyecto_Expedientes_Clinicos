import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

/* ---------------- MOCKS ---------------- */

// mock navigate
const mockNavigate = vi.fn();

vi.mock("@/features/dashboard/hooks/useSafeNavigation", () => ({
  useSafeNavigation: () => ({
    go: mockNavigate,
  }),
}));

vi.mock("@/features/dashboard/services/securityService", () => ({
  securityService: {
    cambiarPassword: vi.fn()
  }
}));

import { Changepassword } from "@/features/dashboard/components/Changepassword";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "@/features/auth/components/AuthContext";
import { securityService } from "@/features/dashboard/services/securityService";

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

  test("muestra mensaje de éxito y ejecuta navegación", async () => {
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

    await waitFor(() => {
      expect(screen.getByText("Contraseña actualizada correctamente")).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("inicio");
    }, { timeout: 3000 });
  });

});