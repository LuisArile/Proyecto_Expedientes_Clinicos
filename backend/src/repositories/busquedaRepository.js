const prisma = require('../config/prisma');

class BusquedaRepository {
    async buscarPacientesYExpedientes(termino, criterio, limite, skip) {
        let whereClause = this._construirWhere(termino, criterio);

        return await prisma.paciente.findMany({
            where: whereClause,
            include: { expedientes: true },
            take: limite,
            skip: skip,
            orderBy: { nombre: 'asc' }
        });
    }

    async contarResultados(termino, criterio) {
        return await prisma.paciente.count({
            where: this._construirWhere(termino, criterio)
        });
    }

    _construirWhere(termino, criterio) {
        if (!termino) return {};

        const palabras = termino.trim().split(/\s+/);

        if (criterio === 'nombre') {
            return { 
                AND: palabras.map(palabra => ({
                    OR: [
                        { nombre: { contains: palabra } },
                        { apellido: { contains: palabra } }
                    ]
                }))
            };
        }
        if (criterio === 'identidad') {
            return { dni: { contains: termino } };
        }
        if (criterio === 'codigo') {
            return { expedientes: {
                numeroExpediente: { contains: termino } } 
            };
        }
        // (Default)
        return {
            OR: [
                { dni: { contains: termino } },
                {
                    AND: palabras.map(palabra => ({
                        OR: [
                            { nombre: { contains: palabra } },
                            { apellido: { contains: palabra } }
                        ]
                    }))
                },
                { expedientes: { 
                    numeroExpediente: { contains: termino } } 
                }
            ]
        };
    }    
}

module.exports = BusquedaRepository;