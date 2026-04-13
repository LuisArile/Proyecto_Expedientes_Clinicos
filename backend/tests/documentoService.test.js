const DocumentoService = require("../src/services/documentoService");
const { BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } = require("@azure/storage-blob");

jest.mock("@azure/storage-blob");
jest.mock("../src/config/storage", () => ({
  containerClient: {
    getBlockBlobClient: jest.fn(),
  },
}));

const { containerClient } = require("../src/config/storage");

describe("DocumentoService", () => {
  let documentoRepository;
  let consultaMedicaRepository;
  let auditoriaService;
  let blockBlobClientMock;
  let service;

  beforeEach(() => {
    documentoRepository = {
      crear: jest.fn(),
      obtenerPorConsulta: jest.fn(),
      obtenerPorId: jest.fn(),
      eliminar: jest.fn(),
    };

    consultaMedicaRepository = {
      obtenerPorId: jest.fn(),
    };

    auditoriaService = {
      registrarEntidad: jest.fn(),
    };

    blockBlobClientMock = {
      uploadData: jest.fn(),
      url: "https://storage.blob.core.windows.net/container/blob",
      getProperties: jest.fn(),
      downloadToBuffer: jest.fn(),
      delete: jest.fn(),
    };

    containerClient.getBlockBlobClient.mockReturnValue(blockBlobClientMock);
    StorageSharedKeyCredential.mockImplementation(() => ({}));
    generateBlobSASQueryParameters.mockReturnValue("sv=2024-05&sig=test");

    service = new DocumentoService(
      documentoRepository,
      consultaMedicaRepository,
      auditoriaService
    );

    process.env.AZURE_STORAGE_ACCOUNT = "test";
    process.env.AZURE_STORAGE_ACCOUNT_KEY = "testkey";
    process.env.AZURE_STORAGE_CONTAINER = "testcontainer";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---- generarNombreBlobConRuta ----
  test("debe generar nombre con estructura correcta", () => {
    const nombre = service.generarNombreBlobConRuta("EXP001", "C1", "doc.pdf");
    expect(nombre).toMatch(/^EXP001\/C1\/\d+-doc\.pdf$/);
  });

  // ---- generarSASUrl ----
  test("debe generar URL con SAS token", () => {
    const url = service.generarSASUrl("EXP001/C1/doc.pdf");
    expect(url).toContain("sv=2024-05&sig=test");
  });

  test("debe lanzar error si falta configuración", () => {
    delete process.env.AZURE_STORAGE_ACCOUNT;
    expect(() => service.generarSASUrl("test.pdf")).toThrow();
  });

  // ---- subirDocumento ----
  test("debe subir documento correctamente", async () => {
    const archivo = {
      originalname: "resultado.jpg",
      mimetype: "image/jpeg",
      buffer: Buffer.from("data"),
    };

    const consulta = {
      id: 1,
      expediente: { numeroExpediente: "EXP001" },
    };

    const documentoMock = {
      id: 100,
      originalName: "resultado.jpg",
      url: "https://test.com/doc?token",
      createdAt: new Date(),
    };

    consultaMedicaRepository.obtenerPorId.mockResolvedValue(consulta);
    documentoRepository.crear.mockResolvedValue(documentoMock);

    const result = await service.subirDocumento(archivo, 1, 99);

    expect(result.success).toBe(true);
    expect(result.documento.id).toBe(100);
    expect(auditoriaService.registrarEntidad).toHaveBeenCalledWith(99, "DOCUMENTO", "CARGA", 100);
  });

  test("debe lanzar error si falta archivo", async () => {
    await expect(service.subirDocumento(null, 1, 99)).rejects.toThrow();
  });

  test("debe lanzar error si consulta no existe", async () => {
    consultaMedicaRepository.obtenerPorId.mockResolvedValue(null);
    await expect(service.subirDocumento({ originalname: "a" }, 1, 99)).rejects.toThrow();
  });

  // ---- obtenerDocumentosPorConsulta ----
  test("debe retornar documentos de una consulta", async () => {
    const docs = [{ id: 1, nombre: "doc1.pdf" }];
    documentoRepository.obtenerPorConsulta.mockResolvedValue(docs);

    const result = await service.obtenerDocumentosPorConsulta(5);

    expect(result).toEqual(docs);
  });

  test("debe lanzar error si falla la obtención", async () => {
    documentoRepository.obtenerPorConsulta.mockRejectedValue(new Error("BD error"));
    await expect(service.obtenerDocumentosPorConsulta(5)).rejects.toThrow();
  });

  // ---- obtenerDocumento ----
  test("debe retornar un documento por ID", async () => {
    const documento = { id: 1, nombre: "doc.pdf" };
    documentoRepository.obtenerPorId.mockResolvedValue(documento);

    const result = await service.obtenerDocumento(1);

    expect(result).toEqual(documento);
  });

  // ---- descargarDocumento ----
  test("debe descargar documento correctamente", async () => {
    const buffer = Buffer.from("data");
    blockBlobClientMock.getProperties.mockResolvedValue({ contentLength: 4 });

    const result = await service.descargarDocumento("blob/file.pdf", 42, 10);

    expect(result).toBeInstanceOf(Buffer);
    expect(auditoriaService.registrarEntidad).toHaveBeenCalledWith(42, "Documento", "Descarga", 10);
  });

  test("debe lanzar error si falla la descarga", async () => {
    blockBlobClientMock.getProperties.mockRejectedValue(new Error("Blob error"));
    await expect(service.descargarDocumento("blob/file.pdf", 42, 10)).rejects.toThrow();
  });

  // ---- eliminarDocumento ----
  test("debe eliminar documento correctamente", async () => {
    blockBlobClientMock.delete.mockResolvedValue(true);
    documentoRepository.eliminar.mockResolvedValue(true);

    const result = await service.eliminarDocumento(1, "blob/file.pdf", 42);

    expect(result.success).toBe(true);
    expect(blockBlobClientMock.delete).toHaveBeenCalled();
    expect(documentoRepository.eliminar).toHaveBeenCalledWith(1);
    expect(auditoriaService.registrarEntidad).toHaveBeenCalledWith(42, "DOCUMENTO", "ELIMINACION", 1);
  });

  test("debe lanzar error si falla la eliminación", async () => {
    blockBlobClientMock.delete.mockRejectedValue(new Error("Error"));
    await expect(service.eliminarDocumento(1, "blob/file.pdf", 42)).rejects.toThrow();
  });
});
