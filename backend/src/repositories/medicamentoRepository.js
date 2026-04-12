const prisma = require('../config/prisma');

class MedicamentoRepository {

  // Normaliza el texto para evitar duplicados por acentos o mayúsculas
  normalizar(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  // Verifica si existe un medicamento con el mismo nombre
  async existePorNombre(nombre, idExcluir = null) {
    const medicamentos = await prisma.medicamento.findMany({
      select: { id: true, nombre: true }
    });

    const nombreNormalizado = this.normalizar(nombre);

    return medicamentos.some(medicamento => {
      if (idExcluir && medicamento.id === Number(idExcluir)) return false;
      return this.normalizar(medicamento.nombre) === nombreNormalizado;
    });
  }

  // Buscar medicamentos por nombre o categoría
  async buscar(filtros = {}) {
    let { busqueda } = filtros;

    if (!busqueda || busqueda.trim() === "") {
      return await prisma.medicamento.findMany({
      take: 15,
      orderBy: { fechaCreacion: "desc" },
      include: {
        categoria: true, }
      });
    }

    const palabras = this.normalizar(busqueda)
      .split(" ")
      .filter(p => p.length > 0);

    const medicamentos = await prisma.medicamento.findMany({
      orderBy: { fechaCreacion: "desc" },
      include: {
        categoria: true,
      },
    });

    return medicamentos.filter(medicamento => {
      const nombre = this.normalizar(medicamento.nombre);
      const categoria = this.normalizar(medicamento.categoria || "");

      return palabras.every(palabra =>
        nombre.includes(palabra) ||
        categoria.includes(palabra)
      );
    });
  }

  // Obtener solo medicamentos activos
  async obtenerActivos() {
    return prisma.medicamento.findMany({
      where: { estado: true },
      orderBy: { nombre: "asc" },
      include: {
        categoria: true, 
      },
    });
  }

  // Obtener un medicamento por ID
  async obtenerPorId(id) {
    return prisma.medicamento.findUnique({
      where: { id: Number(id) },
      include: {
        categoria: true, 
      },
    });
  }

  // Crear un nuevo medicamento
  async crear(data) {
    return prisma.medicamento.create({
      data: {
        nombre: data.nombre.trim(),
        estado: true,
        categoria: {
          connectOrCreate: {
            where: {
              nombre: data.categoria.trim(),
            },
            create: {
              nombre: data.categoria.trim(),
            },
          },
        },
      },
      include: {
        categoria: true,
      },
    });
  }

  // Actualizar un medicamento existente
  async actualizar(id, data) {
    return prisma.medicamento.update({
      where: { id: Number(id) },
      data: {
        ...(data.nombre && { nombre: data.nombre.trim() }),
        ...(data.categoria && {
          categoria: {
            connectOrCreate: {
              where: { nombre: data.categoria.trim() },
              create: { nombre: data.categoria.trim() },
            },
          },
        }),
      },
      include: {
        categoria: true, 
      },
    });
  }

  // Alternar el estado del medicamento
  async alternarEstado(id) {
    const medicamento = await this.obtenerPorId(id);

    if (!medicamento) {
      const error = new Error("Medicamento no encontrado");
      error.codigoHttp = 404;
      throw error;
    }

    return prisma.medicamento.update({
      where: { id: Number(id) },
      data: { estado: !medicamento.estado }
    });
  }
}

module.exports = MedicamentoRepository;