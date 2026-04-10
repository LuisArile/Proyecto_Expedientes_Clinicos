import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, test, beforeEach, expect } from "vitest";
import { Auditoria } from "../features/admin/components/Auditoria";

// Mock hook
vi.mock("../features/admin/hooks/useAuditoria", () => ({
  useAuditoria: vi.fn(),
}));

// Mock DataTable 
vi.mock("../shared/components/common/DataTable", () => ({
  DataTable: ({ data, columns, emptyMessage }) => {
    if (!data || data.length === 0) return emptyMessage;

    return (
      <div>
        {data.map((row, i) => (
          <div key={i}>
            {columns.map((col, j) => (
              <div key={j}>
                {col.render ? col.render(row) : row[col.accessorKey]}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
}));

// Otros mocks UI
vi.mock("../shared/components/layout/PageHeader", () => ({
  PageHeader: ({ title }) => <div>{title}</div>,
}));

vi.mock("../shared/components/common/ModalDetalleBase", () => ({
  ModalDetalleBase: ({ isOpen, children }) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,
}));

vi.mock("../shared/components/common/DetailBox", () => ({
  DetailBox: ({ label, value }) => (
    <div>
      {label}: {value}
    </div>
  ),
}));

vi.mock("../shared/components/ui/detalleAuditoria", () => ({
  DetalleAuditoria: () => <div>Detalle Auditoria</div>,
}));

// Import después de mocks
import { useAuditoria } from "../features/admin/hooks/useAuditoria";

describe("Auditoria Component", () => {
  let baseMock;

  beforeEach(() => {
    vi.clearAllMocks();

    baseMock = {
      eventos: [
        {
          id: 1,
          fecha: "2024-01-01",
          hora: "10:00",
          usuario: "Juan",
          rol: "ADMINISTRADOR",
          modulo: "Usuarios",
          accion: "CREAR",
          detalles: "{}",
        },
      ],
      loading: false,
      busqueda: "",
      setBusqueda: vi.fn(),
      filtroUsuario: "todos",
      setFiltroUsuario: vi.fn(),
      filtroModulo: "todos",
      setFiltroModulo: vi.fn(),
      filtroFecha: "",
      setFiltroFecha: vi.fn(),
      totalEventos: 1,
      eventosHoy: 1,
      usuariosUnicos: ["Juan"],
      modulosUnicos: ["Usuarios"],
    };
  });

  // RENDER BÁSICO
  test("renderiza correctamente", () => {
    useAuditoria.mockReturnValue(baseMock);

    render(<Auditoria onVolver={() => {}} />);

    expect(screen.getByText("Auditoría del Sistema")).toBeInTheDocument();
    expect(screen.getByText("Juan")).toBeInTheDocument();
  });

  // LOADING
  test("muestra loader cuando loading es true", () => {
    useAuditoria.mockReturnValue({
      ...baseMock,
      loading: true,
    });

    render(<Auditoria onVolver={() => {}} />);

    expect(
      screen.getByText("Cargando bitácora de auditoría...")
    ).toBeInTheDocument();
  });

  // DATA TABLE
  test("muestra cantidad de eventos", () => {
    useAuditoria.mockReturnValue(baseMock);

    render(<Auditoria onVolver={() => {}} />);

    expect(screen.getByText("Juan")).toBeInTheDocument();
  });

  // EMPTY STATE
  test("muestra mensaje cuando no hay registros", () => {
    useAuditoria.mockReturnValue({
      ...baseMock,
      eventos: [],
    });

    render(<Auditoria onVolver={() => {}} />);

    expect(
      screen.getByText((text) =>
        text.includes("No se encontraron registros")
      )
    ).toBeInTheDocument();
  });

  // FILTROS
  test("actualiza búsqueda", () => {
    useAuditoria.mockReturnValue(baseMock);

    render(<Auditoria onVolver={() => {}} />);

    const input = screen.getByPlaceholderText("Buscar acción...");
    fireEvent.change(input, { target: { value: "test" } });

    expect(baseMock.setBusqueda).toHaveBeenCalledWith("test");
  });

  test("limpia filtros correctamente", () => {
    useAuditoria.mockReturnValue(baseMock);

    render(<Auditoria onVolver={() => {}} />);

    fireEvent.click(screen.getByText("Limpiar Filtros"));

    expect(baseMock.setBusqueda).toHaveBeenCalledWith("");
    expect(baseMock.setFiltroUsuario).toHaveBeenCalledWith("todos");
    expect(baseMock.setFiltroModulo).toHaveBeenCalledWith("todos");
    expect(baseMock.setFiltroFecha).toHaveBeenCalledWith("");
  });

  // HEADER DINÁMICO
  test("muestra contador filtrado cuando hay filtros activos", () => {
    useAuditoria.mockReturnValue({
      ...baseMock,
      busqueda: "test",
    });

    render(<Auditoria onVolver={() => {}} />);

    expect(
      screen.getByText((t) => t.includes("Mostrando"))
    ).toBeInTheDocument();
  });

  // MODAL
  test("abre modal al hacer click en detalles", () => {
    useAuditoria.mockReturnValue(baseMock);

    render(<Auditoria onVolver={() => {}} />);

    fireEvent.click(screen.getByLabelText("ver-detalles"));

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  test("muestra información en el modal", () => {
    useAuditoria.mockReturnValue(baseMock);

    render(<Auditoria onVolver={() => {}} />);

    fireEvent.click(screen.getByLabelText("ver-detalles"));

    expect(screen.getByText("Usuario: Juan")).toBeInTheDocument();
    expect(screen.getByText("Módulo: Usuarios")).toBeInTheDocument();
  });

  // ROLE FALLBACK
  test("maneja rol desconocido", () => {
    useAuditoria.mockReturnValue({
      ...baseMock,
      eventos: [
        {
          ...baseMock.eventos[0],
          rol: "DESCONOCIDO",
        },
      ],
    });

    render(<Auditoria onVolver={() => {}} />);

    // Validar que el contenido sigue renderizando
    expect(screen.getByText("Juan")).toBeInTheDocument();
  });
});