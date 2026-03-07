class PermisoService {
    constructor(permisoRepository) {
        this.permisoRepository = permisoRepository;
    }

    async crear(data) {
        if (!data.nombre || !data.nombre.trim()) {
            throw new Error('El nombre del permiso es requerido');
        }

        const existente = await this.permisoRepository.obtenerPorNombre(data.nombre.toUpperCase());
        if (existente) {
            throw new Error('Ya existe un permiso con ese nombre');
        }

        return await this.permisoRepository.crear({ nombre: data.nombre.toUpperCase() });
    }

    async obtenerTodos() {
        return await this.permisoRepository.obtenerTodos();
    }

    async obtenerPorId(idPermiso) {
        const permiso = await this.permisoRepository.obtenerPorId(idPermiso);
        if (!permiso) {
            throw new Error('Permiso no encontrado');
        }
        return permiso;
    }

    async actualizar(idPermiso, data) {
        const permisoExistente = await this.permisoRepository.obtenerPorId(idPermiso);
        if (!permisoExistente) {
            throw new Error('Permiso no encontrado');
        }

        if (data.nombre) {
            const duplicado = await this.permisoRepository.obtenerPorNombre(data.nombre.toUpperCase());
            if (duplicado && duplicado.idPermiso !== Number(idPermiso)) {
                throw new Error('Ya existe un permiso con ese nombre');
            }
        }

        return await this.permisoRepository.actualizar(idPermiso, { nombre: data.nombre.toUpperCase() });
    }

    async eliminar(idPermiso) {
        const permiso = await this.permisoRepository.obtenerPorId(idPermiso);
        if (!permiso) {
            throw new Error('Permiso no encontrado');
        }
        return await this.permisoRepository.eliminar(idPermiso);
    }
}

module.exports = PermisoService;
