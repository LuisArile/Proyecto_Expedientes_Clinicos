import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { Changepassword } from "../features/dashboard/components/Changepassword";
import { MemoryRouter } from "react-router-dom";

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

// mock AuthContext
const mockUser = {
  id: 1,
  nombreUsuario: "admin",
  token: "fake-token"
};

vi.mock("@/features/auth/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser
  })
}));

// mock fetch
globalThis.fetch = vi.fn();

/* ---------------- TESTS ---------------- */

describe("Changepassword", () => {

  test("renderiza el formulario correctamente", () => {

    render(
      <MemoryRouter>
        <Changepassword />
      </MemoryRouter>
    );

    expect(screen.getByText("Cambiar Contraseña")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingrese su contraseña actual")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingrese su nueva contraseña")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirme su nueva contraseña")).toBeInTheDocument();

  });

  test("muestra error si las contraseñas no coinciden", async () => {

    render(
      <MemoryRouter>
        <Changepassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Ingrese su contraseña actual"), {
      target: { value: "123456" }
    });

    fireEvent.change(screen.getByPlaceholderText("Ingrese su nueva contraseña"), {
      target: { value: "abc123" }
    });

    fireEvent.change(screen.getByPlaceholderText("Confirme su nueva contraseña"), {
      target: { value: "xyz123" }
    });

    fireEvent.click(screen.getByText("Guardar cambios"));

    expect(screen.getByText("Las contraseñas no coinciden")).toBeInTheDocument();

  });

  test("envía request correctamente", async () => {

    fetch.mockResolvedValue({
      ok: true
    });

    render(
      <MemoryRouter>
        <Changepassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Ingrese su contraseña actual"), {
      target: { value: "123456" }
    });

    fireEvent.change(screen.getByPlaceholderText("Ingrese su nueva contraseña"), {
      target: { value: "abc123" }
    });

    fireEvent.change(screen.getByPlaceholderText("Confirme su nueva contraseña"), {
      target: { value: "abc123" }
    });

    fireEvent.click(screen.getByText("Guardar cambios"));

    await waitFor(() => {

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:4000/api/change-password",
        expect.objectContaining({
          method: "PUT"
        })
      );

    });

  });

  test("muestra mensaje de éxito", async () => {

    fetch.mockResolvedValue({
      ok: true
    });

    render(
      <MemoryRouter>
        <Changepassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Ingrese su contraseña actual"), {
      target: { value: "123456" }
    });

    fireEvent.change(screen.getByPlaceholderText("Ingrese su nueva contraseña"), {
      target: { value: "abc123" }
    });

    fireEvent.change(screen.getByPlaceholderText("Confirme su nueva contraseña"), {
      target: { value: "abc123" }
    });

    fireEvent.click(screen.getByText("Guardar cambios"));

    await waitFor(() => {
      expect(screen.getByText("Contraseña actualizada correctamente")).toBeInTheDocument();
    });

  });

});