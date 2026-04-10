export class ViewRegistry {
    constructor() {
        this.views = new Map();
    }

    register(id, config) {
        if (this.views.has(id)) {
            console.warn(`Ver ${id} ya registrado`);
            return;
        }

        if (!config.component) {
            throw new Error(`La vista ${id} debe tener un componente`);
        }

        this.views.set(id, {
            id,
            path: config.path,
            component: config.component,
            parent: config.parent || null,
            permissions: config.permissions || [],
            requiresPaciente: config.requiresPaciente || false,
            metadata: config.metadata || {}
        });
    }

    getView(id) {
        const view = this.views.get(id);
        if (!view) {
            console.warn(`Vista ${id} no encontrada, se devuelve una vista de error`);
            return this.views.get("error");
        }
        return view;
    }

    getAllViews() {
        return Array.from(this.views.values());
    }

    hasView(id) {
        return this.views.has(id);
    }
}

export const viewRegistry = new ViewRegistry();