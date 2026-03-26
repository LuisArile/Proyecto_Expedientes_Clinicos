import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "../features/auth/components/AuthProvider";
import { useAuth } from "../features/auth/hooks/useAuth";
import { authService } from "../features/auth/services/authService";

vi.mock("../features/auth/services/authService", () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn()
  }
}));

function TestComponent() {
  const { user, login, logout, isAuthenticated, checkPermission } = useAuth();

  return (
    <div>
      <p data-testid="user">{user ? user.nombre : "no-user"}</p>
      <p data-testid="auth">{isAuthenticated ? "true" : "false"}</p>
      <p data-testid="permission">
        {checkPermission("CREAR_EXPEDIENTE") ? "tiene-permiso" : "no-permiso"}
      </p>
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

  test("estado inicial extraído de sessionStorage", () => {
    const mockUser = { nombre: "Karla", permisos: ["VER_AUDITORIA"] };
    sessionStorage.setItem("user", JSON.stringify(mockUser));
    sessionStorage.setItem("token", "fake-token-123");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user").textContent).toBe("Karla");
    expect(screen.getByTestId("auth").textContent).toBe("true");
  });

  test("login exitoso guarda usuario y habilita permisos", async () => {
    const userResponse = { 
      id: 1, 
      nombre: "Admin", 
      permisos: ["CREAR_EXPEDIENTE"] 
    };
    
    authService.login.mockResolvedValue({
      success: true,
      user: userResponse
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("login"));

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("Admin");
      expect(screen.getByTestId("auth").textContent).toBe("true");
      expect(screen.getByTestId("permission").textContent).toBe("tiene-permiso");
    });
  });

  test("checkPermission retorna false si el permiso no existe", () => {
    sessionStorage.setItem("user", JSON.stringify({ nombre: "User", permisos: [] }));
    sessionStorage.setItem("token", "token");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("permission").textContent).toBe("no-permiso");
  });

  test("logout limpia el estado y llama al servicio", async () => {
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

  test("no autentica si falta el token en sessionStorage", () => {
    sessionStorage.setItem("user", JSON.stringify({ nombre: "Juan" }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("auth").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("no-user");
  });
});