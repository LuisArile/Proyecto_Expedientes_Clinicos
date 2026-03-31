import { rolAPI, permisoAPI } from "@/shared/services/api";

export const rolesService = {
    async fetchAllData() {
        try {
            const [rolesRes, permisosRes] = await Promise.all([
                rolAPI.obtenerTodos(),
                permisoAPI.obtenerTodos(),
            ]);
            return { roles: rolesRes.data, permisos: permisosRes.data };
        } catch (error) {
            console.error("Error al cargar datos de roles/permisos:", error);
            throw error;
        }
    },

    async saveRol(nombre) {
        return await rolAPI.crear({ nombre });
    },

    async updateRol(id, nombre) {
        return await rolAPI.actualizar(id, { nombre });
    },

    async deleteRol(id) {
        return await rolAPI.eliminar(id);
    },

    async getPermisosByRol(idRol) {
        const res = await rolAPI.obtenerPermisos(idRol);
        return res.data;
    },

    async assignPermisos(idRol, listaIds) {
        return await rolAPI.asignarPermisos(idRol, listaIds);
    },

    async savePermiso(nombre) {
        return await permisoAPI.crear({ nombre });
    },

    async deletePermiso(id) {
        return await permisoAPI.eliminar(id);
    },

    async updatePermiso(id, nombre) {
        return await permisoAPI.actualizar(id, { nombre });
    }
};