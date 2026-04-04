class ExamenService {
  constructor(repository) {
    this.repository = repository;
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

  async crear(data) {
    if (!data.nombre) throw new Error("Nombre requerido");
    if (!data.especialidad) throw new Error("Especialidad requerida");

    return await this.repository.crear(data);
  }

  async actualizar(id, data) {
    return await this.repository.actualizar(id, data);
  }

  async alternarEstado(id) {
    return await this.repository.alternarEstado(id);
  }
}

module.exports = ExamenService;