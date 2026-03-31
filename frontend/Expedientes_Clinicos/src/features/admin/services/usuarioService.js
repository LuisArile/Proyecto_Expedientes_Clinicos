import { usuarioAPI } from '@/shared/services/api';

export const usuarioService = {
    getAll: async () => {
        const res = await usuarioAPI.obtenerTodos();
        return res.data;
    },
    getById: async (id) => {
        const res = await usuarioAPI.obtenerPorId(id);
        return res.data;
    },
    create: (data) => usuarioAPI.crear(data),
    update: (id, data) => usuarioAPI.actualizar(id, data),
    toggleStatus: (id) => usuarioAPI.alternarEstado(id),
    sendCredentials: (id) => usuarioAPI.enviarCredenciales(id)
};