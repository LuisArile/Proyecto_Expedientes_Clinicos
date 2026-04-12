const { ENTIDADES, ACCIONES } = require("../utils/auditoriaConstante");

class ExamenService {
  constructor(repository, auditoriaService) {
    this.repository = repository;
    this.auditoriaService = auditoriaService;
  }

  async buscar(filtros) {
    return this.repository.buscar(filtros);
  }

  async obtenerActivos() {
    return this.repository.obtenerActivos();
  }

  async obtenerPorId(id) {
    if (!id) {
      const error = new Error("ID requerido");
      error.codigoHttp = 400;
      throw error;
    }

    const examen = await this.repository.obtenerPorId(id);
    if (!examen) {
      const error = new Error("Examen no encontrado");
      error.codigoHttp = 404;
      throw error;
    }

    return examen;
  }

  async validarDuplicado(nombre, idExcluir = null) {
    const existe = await this.repository.existePorNombre(nombre, idExcluir);
    if (existe) {
      const error = new Error("Ya existe un examen con este nombre");
      error.codigoHttp = 409;
      throw error;
    }
  }

  async crear(data, usuarioId) {
    if (!data.nombre) {
      const error = new Error("Nombre requerido");
      error.codigoHttp = 400;
      throw error;
    }

    if (!data.especialidad) {
      const error = new Error("Especialidad requerida");
      error.codigoHttp = 400;
      throw error;
    }

    await this.validarDuplicado(data.nombre);

    const examen = await this.repository.crear(data);

    if (this.auditoriaService && usuarioId) {
      await this.auditoriaService.registrarEntidad(
        usuarioId,
        ENTIDADES.EXAMEN,
        ACCIONES.CREAR,
        examen.id
      );
    }

    return examen;
  }

  async actualizar(idexamen, data, usuarioId) {
    if (!idexamen) {
      const error = new Error("ID requerido");
      error.codigoHttp = 400;
      throw error;
    }

    if (data.nombre) {
      await this.validarDuplicado(data.nombre, idexamen);
    }

    const examen = await this.repository.actualizar(idexamen, data);

    if (this.auditoriaService && usuarioId) {
      await this.auditoriaService.registrarEntidad(
        usuarioId,
        ENTIDADES.EXAMEN,
        ACCIONES.ACTUALIZAR,
        idexamen
      );
    }

    return examen;
  }

  async alternarEstado(examenid, usuarioId) {
    const examen = await this.repository.alternarEstado(examenid);

    if (this.auditoriaService && usuarioId) {
      await this.auditoriaService.registrarEntidad(
        usuarioId,
        ENTIDADES.EXAMEN,
        ACCIONES.CAMBIAR_ESTADO,
        examenid
      );
    }

    return examen;
  }
}

module.exports = ExamenService;