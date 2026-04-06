const { ENTIDADES, ACCIONES } = require("../utils/auditoriaConstantesExamen");

class ExamenService {
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

    const examen = await this.repository.obtenerPorId(id);
    if (!examen) throw new Error("Examen no encontrado");

    return examen;
  }

  async crear(data, usuarioId) {
    if (!data.nombre) throw new Error("Nombre requerido");
    if (!data.especialidad) throw new Error("Especialidad requerida");

    const examen = await this.repository.crear(data);
    console.log("Examen creado:", examen);
    // Registro en auditoria
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
    const examen = await this.repository.actualizar(idexamen, data);
    // Registro en auditoria
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

  async alternarEstado( examenid, usuarioId ) {
    const examen = await this.repository.alternarEstado(examenid);
    // Registro en auditoria
    
    if ( this.auditoriaService && usuarioId ) {
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