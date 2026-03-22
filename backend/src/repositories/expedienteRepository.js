const prisma = require('../config/prisma');

// Mapeo de estados: string a booleano (true = activo, false = inactivo)
const ESTADOS_MAP = {
    'activo': true,
    'inactivo': false,
    'true': true,
    'false': false,
    '1': true,
    '0': false
};

class expedienteRepository {
    
    // Convertir estado de string a booleano
    _mapearEstado(estado) {
        if (typeof estado === 'string') {
            const estadoBooleano = ESTADOS_MAP[estado.toLowerCase()];
            if (estadoBooleano === undefined) {
                throw new Error(`Estado inválido: ${estado}. Estados válidos: activo (1/true) o inactivo (0/false)`);
            }
            return estadoBooleano;
        }
        // Si ya es booleano o número, convertir a booleano
        return Boolean(estado);
    }
    
    /**
     * Crea un expediente.
     * @param {Object} data - Datos del expediente.
     * @param {Object} [tx] - Cliente de transacción (opcional).
     */
    async crear(data, tx = null) {
        const client = tx || prisma;
        try {
            const estadoNumerico = this._mapearEstado(data.estado || 'activo');
            
            const resultado = await client.expediente.create({
                data: {
                    idPaciente: data.idPaciente,
                    numeroExpediente: data.numeroExpediente,
                    estado: estadoNumerico,
                    observaciones: data.observaciones || null,
                    fechaCreacion: new Date(),
                    fechaActualizacion: new Date()
                },
                include: { paciente: true }
            });
            return resultado;
        } catch (error) {
            throw new Error(`Error al crear expediente: ${error.message}`);
        }
    }

    async obtenerTodos() {
        try {
            const resultados = await prisma.expediente.findMany({
                include: { paciente: true }
            });
            return resultados;
        } catch (error) {
            throw new Error(`Error al obtener expedientes: ${error.message}`);
        }
    }

    /**
     * Busca un expediente por su número único.
     * @param {number} idExpediente 
     */
    async obtenerPorId(idExpediente) {
        try {

            const id = Number(idExpediente);

            if (isNaN(id)) {
                throw new Error("El ID proporcionado no es un formato válido (debe ser numérico)");
            }
            
            if (!idExpediente) throw new Error("ID de expediente no proporcionado");

            const data = await prisma.expediente.findUnique({
                where: { idExpediente: Number(idExpediente) },
                include: { paciente: true }
            });
            return data;
        } catch (error) {
            throw new Error(`Error al buscar expediente: ${error.message}`);
        }
    }

    /**
     * Busca un expediente por su número único.
     * @param {number} idPaciente 
     */
    async obtenerPorPaciente(idPaciente) {
        try {
            const data = await prisma.expediente.findUnique({
                where: { idPaciente: Number(idPaciente) },
                include: { paciente: true }
            });
            return data;
        } catch (error) {
            throw new Error(`Error al buscar expediente por paciente: ${error.message}`);
        }
    }

    /**
     * Busca un expediente por su número único.
     * @param {string} numeroExpediente 
     */
    async obtenerPorNumero(numeroExpediente) {
        try {
            const data = await prisma.expediente.findUnique({
                where: { numeroExpediente: numeroExpediente },
                include: { paciente: true }
            });
            return data;
        } catch (error) {
            throw new Error(`Error al buscar expediente por número: ${error.message}`);
        }
    }

    async actualizar(idExpediente, data, tx = null) {
        const client = tx || prisma;
        
        try {
            const datosActualizar = {
                observaciones: data.observaciones || undefined,
                fechaActualizacion: new Date()
            };
            
            // Si se proporciona estado, mapearlo
            if (data.estado !== undefined) {
                datosActualizar.estado = this._mapearEstado(data.estado);
            }
            
            return await client.expediente.update({
                where: { idExpediente: Number(idExpediente) },
                data: datosActualizar,
                include: { paciente: true }
            });
        } catch (error) {
            throw new Error(`Error al actualizar expediente: ${error.message}`);
        }
    }

    async eliminar(idExpediente) {
        try {
            return await prisma.expediente.delete({
                where: { idExpediente: Number(idExpediente) }
            });
        } catch (error) {
            throw new Error(`Error al eliminar expediente: ${error.message}`);
        }
    }

    async contarCreadosHoy(filtroId = null) {
        const inicioHoy = new Date();
        inicioHoy.setHours(0, 0, 0, 0);
        const finHoy = new Date();
        finHoy.setHours(23, 59, 59, 999);

        return await prisma.expediente.count({
            where: {
                fechaCreacion: { gte: inicioHoy, lte: finHoy },
            }
        });
    }
}


module.exports = expedienteRepository;
