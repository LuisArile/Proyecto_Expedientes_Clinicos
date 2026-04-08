const { ENTIDADES, ACCIONES } = require("../utils/auditoriaConstante");

class MedicamentoService {
  constructor(repository, auditoriaService) {
    this.repository = repository;
    this.auditoriaService = auditoriaService;
  }

  async buscar(filtros) {
    return await this.repository.buscar(filtros);
  }

  async obtenerActivos() {
    return await this.repository.obtenerActivos();
  }

  async obtenerPorId(id) {
    if (!id) throw new Error("ID requerido");

    const medicamento = await this.repository.obtenerPorId(id);
    if (!medicamento) throw new Error("Medicamento no encontrado");

    return medicamento;
  }

  async crear(data, usuarioId) {
    if (!data.nombre) throw new Error("Nombre requerido");
    if (!data.categoria) throw new Error("Categoría requerida");

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

  async actualizar(idMedicamento, data, usuarioId) {
    const medicamento = await this.repository.actualizar(idMedicamento, data);

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

  async alternarEstado(idMedicamento, usuarioId) {
    const medicamento = await this.repository.alternarEstado(idMedicamento);

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