import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Auditoria } from "@/features/admin/components/Auditoria";

import { useAuditoria } from "@/features/admin/hooks/useAuditoria";

vi.mock("@/features/admin/hooks/useAuditoria", () => ({
    useAuditoria: vi.fn(),
}));

vi.mock("@/components/common/DataTable", () => ({
    DataTable: ({ columns, data, emptyMessage }) => (
        <table>
            <tbody>
                {data.length === 0 ? (
                    <tr><td>{emptyMessage}</td></tr>
                ) : (
                    data.map((item, i) => {
                        const detailCol = columns.find(c => c.header === "DETALLES");

                        return (
                            <tr key={i}>
                                <td>{item.usuario}</td>
                                <td>{item.accion}</td>
                                <td>
                                    {detailCol.render(item)}
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    ),
}));

const mockEventos = [
    {
        id: "LOG-001",
        fecha: "2026-03-25",
        hora: "10:00 AM",
        usuario: "Juan Pérez",
        rol: "ADMIN",
        modulo: "Expedientes",
        accion: "Creó nuevo expediente médico",
        detalles: '{"pacienteId": 123}'
    }
];

describe("Componente Auditoria", () => {
    const mockOnVolver = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("debe mostrar el estado de carga inicialmente", () => {
        useAuditoria.mockReturnValue({ loading: true });
        
        render(<Auditoria onVolver={mockOnVolver} />);
        expect(screen.getByText(/Cargando bitácora/i)).toBeInTheDocument();
    });

    test("debe renderizar las estadísticas y la tabla cuando hay datos", async () => {
        useAuditoria.mockReturnValue({
            eventos: mockEventos,
            loading: false,
            totalEventos: 1,
            eventosHoy: 1,
            usuariosUnicos: ["Juan Pérez"],
            modulosUnicos: ["Expedientes"],
            busqueda: "",
            filtroUsuario: "todos",
            filtroModulo: "todos",
            filtroFecha: "",
            setBusqueda: vi.fn(),
        });

        render(<Auditoria onVolver={mockOnVolver} />);

        expect(screen.getByText("Auditoría del Sistema")).toBeInTheDocument();
        
        const stats = screen.getAllByText("1");
        expect(stats.length).toBeGreaterThan(0);
        
        expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    });

    test("debe abrir el modal de detalles al hacer clic en el botón de la tabla", async () => {
        useAuditoria.mockReturnValue({
            eventos: mockEventos,
            loading: false,
            totalEventos: 1,
            eventosHoy: 1,
            usuariosUnicos: ["Juan Pérez"],
            modulosUnicos: ["Expedientes"],
            setBusqueda: vi.fn(),
        });

        render(<Auditoria onVolver={mockOnVolver} />);

        const btnDetalles = screen.getByRole("button", { name: /ver-detalles/i });
        fireEvent.click(btnDetalles);

        expect(await screen.findByText(/Detalle del Evento/i)).toBeInTheDocument();

        const idEvento = await screen.findByText("LOG-001");
        const detallesEvento = await screen.findByText(mockEventos[0].detalles);

        expect(idEvento).toBeInTheDocument();
        expect(detallesEvento).toBeInTheDocument();
    });

    test("debe llamar a onVolver cuando se presiona el botón de regresar", () => {
        useAuditoria.mockReturnValue({
            eventos: [],
            loading: false,
            totalEventos: 0,
            eventosHoy: 0,
            usuariosUnicos: [],
            modulosUnicos: [],
        });

        render(<Auditoria onVolver={mockOnVolver} />);
        
        const btnVolver = screen.getByRole("button", { name: /volver/i }); 
        fireEvent.click(btnVolver);

        expect(mockOnVolver).toHaveBeenCalledTimes(1);
    });
});