import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { Login } from "../pages/Login";
import { MemoryRouter } from "react-router-dom";

// Mock navigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock AuthContext
const mockLogin = vi.fn();

vi.mock("@/features/auth/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin
  })
}));

describe("Login component", () => {

  test("renderiza inputs y botón", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Ingrese su usuario")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingrese su contraseña")).toBeInTheDocument();
    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
  });

  test("permite escribir usuario y contraseña", () => {

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usuarioInput = screen.getByPlaceholderText("Ingrese su usuario");
    const claveInput = screen.getByPlaceholderText("Ingrese su contraseña");

    fireEvent.change(usuarioInput, { target: { value: "admin" } });
    fireEvent.change(claveInput, { target: { value: "123456" } });

    expect(usuarioInput.value).toBe("admin");
    expect(claveInput.value).toBe("123456");
  });

  test("ejecuta login correctamente", async () => {

    mockLogin.mockResolvedValue({
      success: true
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Ingrese su usuario"), {
      target: { value: "admin" }
    });

    fireEvent.change(screen.getByPlaceholderText("Ingrese su contraseña"), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByText("Iniciar sesión"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("admin", "123456");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

  });

  test("muestra error cuando el login falla", async () => {

    mockLogin.mockResolvedValue({
      success: false,
      error: "Credenciales incorrectas"
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Ingrese su usuario"), {
      target: { value: "admin" }
    });

    fireEvent.change(screen.getByPlaceholderText("Ingrese su contraseña"), {
      target: { value: "123456" }
    });

    fireEvent.click(screen.getByText("Iniciar sesión"));

    await waitFor(() => {
      expect(screen.getByText("Credenciales incorrectas")).toBeInTheDocument();
    });

  });

  test("recorta espacios antes de enviar credenciales", async () => {

    mockLogin.mockResolvedValue({
      success: true
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Ingrese su usuario"), {
      target: { value: "  admin  " }
    });

    fireEvent.change(screen.getByPlaceholderText("Ingrese su contraseña"), {
      target: { value: "  123456  " }
    });

    fireEvent.click(screen.getByText("Iniciar sesión"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("admin", "123456");
    });

  });

});