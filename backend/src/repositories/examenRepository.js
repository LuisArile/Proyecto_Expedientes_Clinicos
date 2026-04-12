const prisma = require('../config/prisma');

class ExamenRepository {

  // Normaliza el texto para evitar duplicados por acentos o mayúsculas
  normalizar(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  // Busca o crea la especialidad
  async obtenerOCrearEspecialidad(nombreEspecialidad) {
    const nombreNormalizado = this.normalizar(nombreEspecialidad);

    // Buscar todas las especialidades para comparar de forma normalizada
    const especialidades = await prisma.especialidad.findMany({
      select: { id: true, nombre: true }
    });

    const existente = especialidades.find(
      (e) => this.normalizar(e.nombre) === nombreNormalizado
    );

    if (existente) {
      return existente;
    }

    // Si no existe, crearla
    return await prisma.especialidad.create({
      data: {
        nombre: nombreEspecialidad.trim()
      }
    });
  }

  async existePorNombre(nombre, idExcluir = null) {
    const examenes = await prisma.examen.findMany({
      select: { id: true, nombre: true }
    });

    const nombreNormalizado = this.normalizar(nombre);

    return examenes.some(examen => {
      if (idExcluir && examen.id === Number(idExcluir)) return false;
      return this.normalizar(examen.nombre) === nombreNormalizado;
    });
  }

  async buscar(filtros) {
    let { busqueda } = filtros;

    if (!busqueda || busqueda.trim() === "") {
      return await prisma.examen.findMany({
        take: 15,
        orderBy: { fechaCreacion: "desc" },
        include: {
          especialidad: true
        }
      });
    }

    const palabras = this.normalizar(busqueda)
      .split(" ")
      .filter(p => p.length > 0);

    const examenes = await prisma.examen.findMany({
      orderBy: { fechaCreacion: "desc" },
      include: {
        especialidad: true
      }
    });

    return examenes.filter(examen => {
      const nombre = this.normalizar(examen.nombre);
      const especialidad = this.normalizar(examen.especialidad.nombre);

      return palabras.every(palabra =>
        nombre.includes(palabra) || especialidad.includes(palabra)
      );
    });
  }

  async obtenerActivos() {
    return prisma.examen.findMany({
      where: { estado: true },
      orderBy: { nombre: "asc" },
      include: {
        especialidad: true
      }
    });
  }

  async obtenerPorId(id) {
    return prisma.examen.findUnique({
      where: { id: Number(id) },
      include: {
        especialidad: true
      }
    });
  }

  async crear(data) {
    const especialidad = await this.obtenerOCrearEspecialidad(data.especialidad);

    return prisma.examen.create({
      data: {
        nombre: data.nombre.trim(),
        especialidad: {
          connect: { id: especialidad.id }
        },
        estado: true
      },
      include: {
        especialidad: true
      }
    });
  }

  async actualizar(id, data) {
    let especialidadConnect = undefined;

    if (data.especialidad) {
      const especialidad = await this.obtenerOCrearEspecialidad(data.especialidad);
      especialidadConnect = {
        especialidad: {
          connect: { id: especialidad.id }
        }
      };
    }

    return prisma.examen.update({
      where: { id: Number(id) },
      data: {
        ...(data.nombre && { nombre: data.nombre.trim() }),
        ...especialidadConnect
      },
      include: {
        especialidad: true
      }
    });
  }

  async alternarEstado(id) {
    const examen = await this.obtenerPorId(id);

    return prisma.examen.update({
      where: { id: Number(id) },
      data: { estado: !examen.estado },
      include: {
        especialidad: true
      }
    });
  }
}

module.exports = ExamenRepository;