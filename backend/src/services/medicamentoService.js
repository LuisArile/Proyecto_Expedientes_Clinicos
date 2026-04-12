const { ENTIDADES, ACCIONES } = require("../utils/auditoriaConstante");

class MedicamentoService {
  constructor(repository, auditoriaService) {
    this.repository = repository;
    this.auditoriaService = auditoriaService;
  }

  // Buscar medicamentos
  async buscar(filtros) {
    return this.repository.buscar(filtros);
  }

  // Obtener solo medicamentos activos
  async obtenerActivos() {
    return this.repository.obtenerActivos();
  }

  // Obtener medicamento por ID
  async obtenerPorId(id) {
    if (!id) {
      const error = new Error("ID requerido");
      error.codigoHttp = 400;
      throw error;
    }

    const medicamento = await this.repository.obtenerPorId(id);

    if (!medicamento) {
      const error = new Error("Medicamento no encontrado");
      error.codigoHttp = 404;
      throw error;
    }

    return medicamento;
  }

  // Validar duplicado por nombre
  async validarDuplicado(nombre, idExcluir = null) {
    const existe = await this.repository.existePorNombre(
      nombre,
      idExcluir
    );

    if (existe) {
      const error = new Error(
        "Ya existe un medicamento con este nombre"
      );
      error.codigoHttp = 409;
      throw error;
    }
  }

  // Crear medicamento
  async crear(data, usuarioId) {
    if (!data.nombre) {
      const error = new Error("Nombre requerido");
      error.codigoHttp = 400;
      throw error;
    }

    if (!data.categoria) {
      const error = new Error("Categoría requerida");
      error.codigoHttp = 400;
      throw error;
    }

    await this.validarDuplicado(data.nombre);

    const medicamento = await this.repository.crear(data);

    if (this.auditoriaService && usuarioId) {
      await this.auditoriaService.registrarEntidad(
        usuarioId,
        ENTIDADES.MEDICAMENTO,
        ACCIONES.CREAR,
        medicamento.id
      );
    }

    return medicamento;
  }

  // Actualizar medicamento
  async actualizar(idMedicamento, data, usuarioId) {
    if (!idMedicamento) {
      const error = new Error("ID requerido");
      error.codigoHttp = 400;
      throw error;
    }

    if (data.nombre) {
      await this.validarDuplicado(data.nombre, idMedicamento);
    }

    // Verificar existencia antes de actualizar
    await this.obtenerPorId(idMedicamento);

    const medicamento = await this.repository.actualizar(
      idMedicamento,
      data
    );

    if (this.auditoriaService && usuarioId) {
      await this.auditoriaService.registrarEntidad(
        usuarioId,
        ENTIDADES.MEDICAMENTO,
        ACCIONES.ACTUALIZAR,
        idMedicamento
      );
    }

    return medicamento;
  }

  // Alternar estado del medicamento
  async alternarEstado(idMedicamento, usuarioId) {
    if (!idMedicamento) {
      const error = new Error("ID requerido");
      error.codigoHttp = 400;
      throw error;
    }

    // Verificar existencia antes de cambiar el estado
    await this.obtenerPorId(idMedicamento);

    const medicamento = await this.repository.alternarEstado(
      idMedicamento
    );

    if (this.auditoriaService && usuarioId) {
      await this.auditoriaService.registrarEntidad(
        usuarioId,
        ENTIDADES.MEDICAMENTO,
        ACCIONES.CAMBIAR_ESTADO,
        idMedicamento
      );
    }

    return medicamento;
  }
}

module.exports = MedicamentoService;