const AuditoriaService = require("../src/services/auditoriaService");

describe("AuditoriaService", () => {
    let service;
    let mockRepository;

    beforeEach(() => {
        mockRepository = {
            crear: jest.fn(),
            obtenerTodos: jest.fn(),
            obtenerEstadisticas: jest.fn()
        };

        service = new AuditoriaService(mockRepository);
    });

    describe("Método registrar (Base)", () => {
        test("debe crear registro de auditoría con argumentos correctos", async () => {
            const registroMock = { id: 1 };
            mockRepository.crear.mockResolvedValue(registroMock);

            const resultado = await service.registrar(1, "INICIO_SESION", "detalle prueba", "mock-tx");

            expect(mockRepository.crear).toHaveBeenCalledWith({
                usuarioId: 1,
                accion: "INICIO_SESION",
                detalles: "detalle prueba"
            }, "mock-tx");

            expect(resultado).toEqual(registroMock);
        });

        test("debe retornar null y no llamar al repo si no hay usuarioId", async () => {
            const resultado = await service.registrar(null, "ACCION");

            expect(resultado).toBeNull();
            expect(mockRepository.crear).not.toHaveBeenCalled();
        });

        test("debe manejar errores del repository sin lanzar excepción", async () => {

            const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});
            
            mockRepository.crear.mockRejectedValue(new Error("DB error"));

            const resultado = await service.registrar(1, "ACCION");

            expect(resultado).toBeNull();
            expect(spyError).toHaveBeenCalled();
            spyError.mockRestore();
        });
    });

    describe("Métodos de Conveniencia (Wrappers)", () => {
        test("registrarSesion debe construir mensaje dinámico", async () => {
            await service.registrarSesion(1, "INICIO_SESION", "admin");
            
            expect(mockRepository.crear).toHaveBeenCalledWith(
                expect.objectContaining({ detalles: "Usuario admin entró al sistema" }),
                null
            );
        });

        test("registrarExpediente debe manejar tanto IDs como objetos de datos", async () => {

            await service.registrarExpediente(1, "Creacion", 10, "tx-123");
            expect(mockRepository.crear).toHaveBeenCalledWith(
                {
                    usuarioId: 1,
                    accion: "Creacion DE EXPEDIENTE",
                    detalles: "Expediente ID: 10. Proceso de creacion"
                }, 
                "tx-123"
            );

            await service.registrarExpediente(1, "Actualizacion", {
                idExpediente: 5,
                detalles: "Cambio de diagnóstico"
            });
            expect(mockRepository.crear).toHaveBeenLastCalledWith(
                expect.objectContaining({ detalles: "Expediente ID: 5. Cambio de diagnóstico" }),
                null
            );
        });

        test("registrarBusqueda debe usar formato estandarizado", async () => {
            await service.registrarBusqueda(1, "hipertensión");
            expect(mockRepository.crear).toHaveBeenCalledWith(
                expect.objectContaining({ 
                    accion: "BUSQUEDA",
                    detalles: "Búsqueda global con término: hipertensión" 
                }),
                null
            );
        });
    });

    describe("Lectura y Mapeo de Datos", () => {
        test("obtenerLogs debe transformar el modelo de BD al formato de UI", async () => {
            const fechaFija = new Date('2026-03-25T10:00:00');
            
            mockRepository.obtenerTodos.mockResolvedValue([
                {
                    id: 1,
                    accion: "Actualizacion DE EXPEDIENTE",
                    detalles: "Log de prueba",
                    fecha: fechaFija,
                    usuario: {
                        nombre: "Juan",
                        apellido: "Pérez",
                        nombreUsuario: "jPérez",
                        rol: { nombre: "ADMIN" }
                    }
                }
            ]);

            const result = await service.obtenerLogs();

            const evento = result.eventos[0];
            expect(evento.usuario).toBe("Juan Pérez");
            expect(evento.modulo).toBe("Expedientes");
            expect(evento.rol).toBe("ADMIN");
            expect(result.metadatos.total).toBe(1);
            expect(result.metadatos.modulosUnicos).toContain("Expedientes");
        });

        test("obtenerLogs debe manejar registros sin usuario (acciones de sistema)", async () => {
            mockRepository.obtenerTodos.mockResolvedValue([{
                id: 99,
                accion: "BACKUP",
                fecha: new Date(),
                usuario: null
            }]);

            const result = await service.obtenerLogs();
            expect(result.eventos[0].usuario).toBe("Sistema");
            expect(result.eventos[0].modulo).toBe("General");
        });
    });
});