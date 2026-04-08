const prisma = require('../config/prisma');

class ExamenRepository {

    async buscar(filtros) {
        let { busqueda } = filtros;

        // Función para normalizar texto (quita acentos y pasa a minúsculas)
        const normalizar = (texto) =>
            texto
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();

        // Si NO hay búsqueda solo se traen 15 registros
        if (!busqueda || busqueda.trim() === "") {
            return await prisma.examen.findMany({
                take: 15,
                orderBy: { fechaCreacion: "desc" }
            });
        }

        // Separar palabras: "hemo cardio" → ["hemo", "cardio"]
        const palabras = normalizar(busqueda).split(" ").filter(p => p.length > 0);

        // Obtener todos (para luego filtrar manualmente)
        const examenes = await prisma.examen.findMany({
            orderBy: { fechaCreacion: "desc" }
        });

        // Filtrado en memoria 
        const resultados = examenes.filter(examen => {
            const nombre = normalizar(examen.nombre);
            const especialidad = normalizar(examen.especialidad);

            return palabras.every(palabra =>
                nombre.includes(palabra) || especialidad.includes(palabra)
            );
        });

        return resultados;
    }

  async obtenerActivos() {
    return await prisma.examen.findMany({
      where: { estado: true },
      orderBy: { nombre: "asc" }
    });
  }

  async obtenerPorId(id) {
    return await prisma.examen.findUnique({
      where: { id: Number(id) }
    });
  }

  async crear(data) {
    return await prisma.examen.create({
      data: {
        nombre: data.nombre,
        especialidad: data.especialidad,
        estado: true
      }
    });
  }

  async actualizar(id, data) {
    return await prisma.examen.update({
      where: { id: Number(id) },
      data: {
        nombre: data.nombre,
        especialidad: data.especialidad
      }
    });
  }

  async alternarEstado(id) {
    const examen = await this.obtenerPorId(id);

    return await prisma.examen.update({
      where: { id: Number(id) },
      data: {
        estado: !examen.estado
      }
    });
  }
}

module.exports = ExamenRepository;