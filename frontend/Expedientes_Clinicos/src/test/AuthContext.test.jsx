import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "../features/auth/AuthProvider";
import { useAuth } from "../features/auth/useAuth";
import { authService } from "../features/auth/authService";

vi.mock("../features/auth/authService", () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn()
  }
}));

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

describe("AuthProvider", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  test("estado inicial sin sesion", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user").textContent).toBe("no-user");
    expect(screen.getByTestId("auth").textContent).toBe("false");
  });

  test("hidrata usuario desde sessionStorage", () => {
    sessionStorage.setItem("user", JSON.stringify({ nombre: "Juan" }));
    sessionStorage.setItem("token", "abc123");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user").textContent).toBe("Juan");
    expect(screen.getByTestId("auth").textContent).toBe("true");
  });

  test("login exitoso actualiza contexto", async () => {
    authService.login.mockResolvedValue({
      success: true,
      user: { id: 1, nombre: "Admin" }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("login"));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith("admin", "1234");
      expect(screen.getByTestId("user").textContent).toBe("Admin");
      expect(screen.getByTestId("auth").textContent).toBe("true");
    });
  });

  test("logout limpia el estado del usuario", async () => {
    sessionStorage.setItem("user", JSON.stringify({ nombre: "Juan" }));
    sessionStorage.setItem("token", "abc123");
    authService.logout.mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("logout"));

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled();
      expect(screen.getByTestId("user").textContent).toBe("no-user");
      expect(screen.getByTestId("auth").textContent).toBe("false");
    });
  });
});