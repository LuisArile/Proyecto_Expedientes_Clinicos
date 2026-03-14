import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Changepassword } from "@/features/dashboard/components/Changepassword";
import { useAuth } from "@/features/auth/AuthContext";

vi.mock("@/features/auth/AuthContext", () => ({
  useAuth: vi.fn()
}));

vi.mock("@/components/validaciones/validatePasswordChange", () => ({
  validatePasswordChange: vi.fn()
}));

import { validatePasswordChange } from "@/components/validaciones/validatePasswordChange";

describe("Changepassword Component", () => {

  const mockNavigate = vi.fn();

  beforeEach(() => {

    useAuth.mockReturnValue({
      user: { nombreUsuario: "admin" }
    });

    global.fetch = vi.fn();

    localStorage.setItem("token", "fake-token");

  });

  test("debe renderizar el formulario correctamente", () => {

    render(<Changepassword onNavigate={mockNavigate} />);

    expect(screen.getByText("Cambiar Contraseña")).toBeInTheDocument();
    expect(screen.getByDisplayValue("admin")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingrese su contraseña actual")).toBeInTheDocument();

  });

  test("debe mostrar error de validación", async () => {

    validatePasswordChange.mockReturnValue("Error de validación");

    render(<Changepassword onNavigate={mockNavigate} />);

    fireEvent.click(screen.getByText("Guardar cambios"));

    expect(await screen.findByText("Error de validación")).toBeInTheDocument();

  });

  test("debe enviar formulario correctamente", async () => {

    validatePasswordChange.mockReturnValue(null);

    fetch.mockResolvedValue({
      ok: true
    });

    render(<Changepassword onNavigate={mockNavigate} />);

    fireEvent.change(
      screen.getByPlaceholderText("Ingrese su contraseña actual"),
      { target: { value: "1234" } }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Ingrese su nueva contraseña"),
      { target: { value: "abcd1234" } }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Confirme su nueva contraseña"),
      { target: { value: "abcd1234" } }
    );

    fireEvent.click(screen.getByText("Guardar cambios"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(await screen.findByText("Contraseña actualizada correctamente"))
      .toBeInTheDocument();

  });

  test("debe manejar error del backend", async () => {

    validatePasswordChange.mockReturnValue(null);

    fetch.mockResolvedValue({
      ok: false
    });

    render(<Changepassword onNavigate={mockNavigate} />);

    fireEvent.change(
      screen.getByPlaceholderText("Ingrese su contraseña actual"),
      { target: { value: "1234" } }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Ingrese su nueva contraseña"),
      { target: { value: "abcd1234" } }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Confirme su nueva contraseña"),
      { target: { value: "abcd1234" } }
    );

    fireEvent.click(screen.getByText("Guardar cambios"));

    expect(await screen.findByText("Error al cambiar la contraseña"))
      .toBeInTheDocument();

  });

  test("botón cancelar debe navegar a inicio", () => {

    render(<Changepassword onNavigate={mockNavigate} />);

    fireEvent.click(screen.getByText("Cancelar"));

    expect(mockNavigate).toHaveBeenCalledWith("inicio");

  });

});