class RolService {
    constructor(rolRepository) {
        this.rolRepository = rolRepository;
    }

    async crear(data) {
        if (!data.nombre || !data.nombre.trim()) {
            throw new Error('El nombre del rol es requerido');
        }

        const existente = await this.rolRepository.obtenerPorNombre(data.nombre.toUpperCase());
        if (existente) {
            throw new Error('Ya existe un rol con ese nombre');
        }

        return await this.rolRepository.crear({ nombre: data.nombre.toUpperCase() });
    }

    async obtenerTodos() {
        return await this.rolRepository.obtenerTodos();
    }

    async obtenerPorId(idRol) {
        const rol = await this.rolRepository.obtenerPorId(idRol);
        if (!rol) {
            throw new Error('Rol no encontrado');
        }
        return rol;
    }

    async actualizar(idRol, data) {
        const rolExistente = await this.rolRepository.obtenerPorId(idRol);
        if (!rolExistente) {
            throw new Error('Rol no encontrado');
        }

        if (data.nombre) {
            const duplicado = await this.rolRepository.obtenerPorNombre(data.nombre.toUpperCase());
            if (duplicado && duplicado.idRol !== Number(idRol)) {
                throw new Error('Ya existe un rol con ese nombre');
            }
        }

        return await this.rolRepository.actualizar(idRol, { nombre: data.nombre.toUpperCase() });
    }

    async eliminar(idRol) {
        const rol = await this.rolRepository.obtenerPorId(idRol);
        if (!rol) {
            throw new Error('Rol no encontrado');
        }
        return await this.rolRepository.eliminar(idRol);
    }

    async asignarPermisos(idRol, permisos) {
        const rol = await this.rolRepository.obtenerPorId(idRol);
        if (!rol) {
            throw new Error('Rol no encontrado');
        }

        if (!Array.isArray(permisos)) {
            throw new Error('Se requiere un array de IDs de permisos');
        }

        return await this.rolRepository.asignarPermisos(idRol, permisos);
    }

    async obtenerPermisosPorRol(idRol) {
        const rol = await this.rolRepository.obtenerPorId(idRol);
        if (!rol) {
            throw new Error('Rol no encontrado');
        }
        return await this.rolRepository.obtenerPermisosPorRol(idRol);
    }
}

module.exports = RolService;
