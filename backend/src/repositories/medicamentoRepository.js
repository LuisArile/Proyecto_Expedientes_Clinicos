const prisma = require('../config/prisma');

class MedicamentoRepository {

    async buscar(filtros) {
        let { busqueda } = filtros;

        const normalizar = (texto) =>
            texto
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();

        if (!busqueda || busqueda.trim() === "") {
            return await prisma.medicamento.findMany({
                take: 15,
                orderBy: { fechaCreacion: "desc" }
            });
        }

        const palabras = normalizar(busqueda)
            .split(" ")
            .filter(p => p.length > 0);

        const medicamentos = await prisma.medicamento.findMany({
            orderBy: { fechaCreacion: "desc" }
        });

        const resultados = medicamentos.filter(medicamento => {
            const nombre = normalizar(medicamento.nombre);
            const categoria = normalizar(medicamento.categoria);

            return palabras.every(palabra =>
                nombre.includes(palabra) ||
                categoria.includes(palabra) 
            );
        });

        return resultados;
    }

  async obtenerActivos() {
    return await prisma.medicamento.findMany({
      where: { estado: true },
      orderBy: { nombre: "asc" }
    });
  }

  async obtenerPorId(id) {
    return await prisma.medicamento.findUnique({
      where: { id: Number(id) }
    });
  }

  async crear(data) {
    return await prisma.medicamento.create({
      data: {
        nombre: data.nombre,
        categoria: data.categoria,
        estado: true
      }
    });
  }

  async actualizar(id, data) {
    return await prisma.medicamento.update({
      where: { id: Number(id) },
      data: {
        nombre: data.nombre,
        categoria: data.categoria
      }
    });
  }

  async alternarEstado(id) {
    const medicamento = await this.obtenerPorId(id);

    return await prisma.medicamento.update({
      where: { id: Number(id) },
      data: {
        estado: !medicamento.estado
      }
    });
  }
}

module.exports = MedicamentoRepository;