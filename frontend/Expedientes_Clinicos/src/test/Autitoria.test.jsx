import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, test, beforeEach, expect } from "vitest";
import { Auditoria } from "../pages/Auditoria";


vi.mock("../features/admin/hooks/useAuditoria", () => ({
  useAuditoria: vi.fn(),
}));

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, nombre: "Admin", rol: "administrador" },
    checkPermission: vi.fn(() => true),
  })),
}));

vi.mock("@/features/dashboard/hooks/useSafeNavigation", () => ({
  useSafeNavigation: vi.fn(() => ({
    go: vi.fn(),
  })),
}));

vi.mock("@/features/dashboard/hooks/usePacienteSelection", () => ({
  usePacienteSelection: vi.fn(() => ({
    selectedPaciente: null,
  })),
}));

vi.mock("@components/layout/PageHeader", () => ({
  PageHeader: ({ title, onVolver }) => (
    <div>
      <h1>{title}</h1>
      <button onClick={onVolver}>Volver</button>
    </div>
  ),
}));

vi.mock("@components/common/StatCard", () => ({
  StatCard: ({ title, value }) => (
    <div data-testid="stat-card">
      <span>{title}</span>: <span>{value}</span>
    </div>
  ),
}));

vi.mock("@components/common/FilterSearch", () => ({
  FilterInput: ({ label, value, onChange, placeholder }) => (
    <div>
      <label>{label}</label>
      <input 
        placeholder={placeholder} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  ),
  FilterSelect: ({ label, value, onValueChange, options }) => (
    <div>
      <label>{label}</label>
      <select value={value} onChange={(e) => onValueChange(e.target.value)}>
        <option value="todos">Todos</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  ),
}));

vi.mock("../features/admin/components/DialogoDetalleAuditoria", () => ({
  DialogoDetalleAuditoria: ({ isOpen, evento, onClose }) => 
    isOpen ? (
      <div data-testid="modal-detalle">
        <p>Detalle para: {evento?.usuario}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    ) : null
}));

vi.mock("@/shared/hooks/useTableFactory", () => ({
  useTableFactory: vi.fn(({ columns, actions }) => {
    return [
      ...columns,
      {
        id: 'actions',
        header: 'ACCIONES',
        render: (row) => {
          const action = Array.isArray(actions) ? actions[0] : null;
          return action ? (
            <button
              type="button"
              aria-label={action.key}
              onClick={() => action.onClick(row)}
            >
              {action.title}
            </button>
          ) : null;
        }
      }
    ];
  })
}));

vi.mock("@components/common/DataTable", () => ({
  DataTable: ({ data, columns, emptyMessage }) => {
    if (!data || data.length === 0) return <div>{emptyMessage}</div>;
    return (
      <table>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col, j) => (
                <td key={j}>
                  {col.render ? col.render(row) : row[col.accessorKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
}));

vi.mock("@/features/admin/config/columns/auditoriaBaseColumns", () => ({
  getAuditoriaBaseColumns: vi.fn(() => [
    { header: "Usuario", accessorKey: "usuario" },
    { header: "Acción", accessorKey: "accion" }
  ])
}));

import { useAuditoria } from "../features/admin/hooks/useAuditoria";

describe("Auditoria Component", () => {
  let baseMock;

  beforeEach(() => {
    vi.clearAllMocks();
    baseMock = {
      eventos: [
        {
          id: 1,
          usuario: "Juan",
          accion: "LOGIN",
          modulo: "Seguridad",
          fecha: "2024-04-12" 
        }
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
      totalEventos: 100,
      eventosHoy: 5,
      usuariosUnicos: ["Juan", "Maria"],
      modulosUnicos: ["Seguridad", "Pacientes"],
    };
  });

  test("renderiza el componente y las estadísticas correctamente", () => {
    useAuditoria.mockReturnValue(baseMock);
    render(
      <MemoryRouter>
        <Auditoria />
      </MemoryRouter>
    );

    expect(screen.getByText("Auditoría del Sistema")).toBeInTheDocument();
    
    const stats = screen.getAllByTestId("stat-card");
    expect(stats[0]).toHaveTextContent("Total Eventos: 100");
    expect(stats[2]).toHaveTextContent("Usuarios Activos: 2");
  });

  test("muestra loader durante la carga", () => {
    useAuditoria.mockReturnValue({ ...baseMock, loading: true });
    render(
      <MemoryRouter>
        <Auditoria />
      </MemoryRouter>
    );
    expect(screen.getByText(/Cargando bitácora/i)).toBeInTheDocument();
  });

  test("actualiza el filtro de búsqueda general", () => {
    useAuditoria.mockReturnValue(baseMock);
    render(
      <MemoryRouter>
        <Auditoria />
      </MemoryRouter>
    );
    
    const input = screen.getByPlaceholderText("Buscar acción...");
    fireEvent.change(input, { target: { value: "crear" } });
    
    expect(baseMock.setBusqueda).toHaveBeenCalledWith("crear");
  });

  test("limpia todos los filtros al hacer click en el botón", () => {
    useAuditoria.mockReturnValue(baseMock);
    render(
      <MemoryRouter>
        <Auditoria />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText("Limpiar Filtros"));
    
    expect(baseMock.setBusqueda).toHaveBeenCalledWith("");
    expect(baseMock.setFiltroUsuario).toHaveBeenCalledWith("todos");
    expect(baseMock.setFiltroModulo).toHaveBeenCalledWith("todos");
    expect(baseMock.setFiltroFecha).toHaveBeenCalledWith("");
  });

  test("abre el diálogo de detalles al interactuar con la tabla", async () => {
    useAuditoria.mockReturnValue(baseMock);
    render(
      <MemoryRouter>
        <Auditoria />
      </MemoryRouter>
    );

    const btnVer = await screen.findByLabelText("ver-detalles");
    fireEvent.click(btnVer);

    expect(screen.getByTestId("modal-detalle")).toBeInTheDocument();
    expect(screen.getByText("Detalle para: Juan")).toBeInTheDocument();
  });

  test("muestra mensaje de vacío cuando no hay eventos", () => {
    useAuditoria.mockReturnValue({ ...baseMock, eventos: [] });
    render(
      <MemoryRouter>
        <Auditoria />
      </MemoryRouter>
    );
    
    expect(screen.getByText("No se encontraron registros.")).toBeInTheDocument();
  });

  test("el contador de registros muestra información filtrada cuando corresponde", () => {
    useAuditoria.mockReturnValue({ 
      ...baseMock, 
      busqueda: "algo",
      eventos: [baseMock.eventos[0]] 
    });
    
    render(
      <MemoryRouter>
        <Auditoria />
      </MemoryRouter>
    );
    expect(screen.getByText(/Mostrando: 1 de 100/i)).toBeInTheDocument();
  });
});