import { render, screen, act } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../features/auth/AuthContext";

/* -------- MOCK FETCH -------- */

global.fetch = vi.fn();

/* -------- COMPONENTE DE PRUEBA -------- */

function TestComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <p data-testid="user">{user ? user.nombre : "no-user"}</p>
      <p data-testid="auth">{isAuthenticated ? "true" : "false"}</p>
      <button onClick={() => login("admin", "1234")}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

/* -------- TESTS -------- */

describe("AuthContext", () => {

  beforeEach(() => {
    localStorage.clear();
    fetch.mockReset();
  });

  test("estado inicial sin usuario", () => {

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user").textContent).toBe("no-user");
    expect(screen.getByTestId("auth").textContent).toBe("false");

  });

  test("login exitoso", async () => {

    fetch.mockResolvedValue({
      json: async () => ({
        success: true,
        data: { id: 1, nombre: "Juan", rol: "ADMIN" },
        token: "abc123"
      })
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("login").click();
    });

    expect(localStorage.getItem("user")).not.toBeNull();
    expect(localStorage.getItem("token")).toBe("abc123");

  });

  test("login fallido", async () => {

    fetch.mockResolvedValue({
      json: async () => ({
        success: false,
        error: "Credenciales incorrectas"
      })
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("login").click();
    });

    expect(localStorage.getItem("user")).toBeNull();

  });

  test("logout elimina sesión", async () => {

    localStorage.setItem("user", JSON.stringify({ nombre: "Juan" }));
    localStorage.setItem("token", "abc123");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("logout").click();
    });

    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();

  });

});