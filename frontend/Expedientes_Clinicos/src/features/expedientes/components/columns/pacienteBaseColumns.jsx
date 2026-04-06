export const getPacienteBaseColumns = () => [

    {
        id: "expediente",
        header: "Código de Expediente",
        render: (p) => (
            <span className="font-mono text-sm text-blue-600">
                {p.expedientes?.numeroExpediente}
            </span>
        ),
    },
    {
        id: "nombre",
        header: "Nombre Completo",
        accessorKey: "nombre",
        render: (p) => (
            <span className="font-medium text-gray-900">
                {`${p.nombre || ""} ${p.apellido || ""}`}
            </span>
        ),
        sortable: true
    },
    {
        id: "dni",
        header: "Identidad",
        accessorKey: "dni",
        render: (p) => (
            <span className="text-gray-600">
                {p.dni}
            </span>
        ),
        sortable: true
    },
];