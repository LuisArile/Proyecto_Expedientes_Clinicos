BEGIN TRY
    BEGIN TRANSACTION;

    ---------------------------------------------------------
    -- 1. Crear tabla UsuarioEspecialidad
    ---------------------------------------------------------
    IF NOT EXISTS (
        SELECT * FROM sys.tables WHERE name = 'UsuarioEspecialidad'
    )
    BEGIN
        CREATE TABLE UsuarioEspecialidad (
            usuarioId INT NOT NULL,
            especialidadId INT NOT NULL,
            CONSTRAINT PK_UsuarioEspecialidad
                PRIMARY KEY (usuarioId, especialidadId),
            CONSTRAINT FK_UsuarioEspecialidad_Usuario
                FOREIGN KEY (usuarioId) REFERENCES Usuario(id),
            CONSTRAINT FK_UsuarioEspecialidad_Especialidad
                FOREIGN KEY (especialidadId) REFERENCES Especialidad(id)
        );
    END

    ---------------------------------------------------------
    -- 2. Migrar datos desde Usuario.especialidad (si existe)
    ---------------------------------------------------------
    IF EXISTS (
        SELECT * FROM sys.columns
        WHERE Name = N'especialidad'
        AND Object_ID = Object_ID(N'Usuario')
    )
    BEGIN
        -- Insertar especialidades que no existan
        INSERT INTO Especialidad (nombre)
        SELECT DISTINCT LTRIM(RTRIM(especialidad))
        FROM Usuario
        WHERE especialidad IS NOT NULL
          AND LTRIM(RTRIM(especialidad)) <> ''
          AND NOT EXISTS (
              SELECT 1
              FROM Especialidad e
              WHERE e.nombre = LTRIM(RTRIM(Usuario.especialidad))
          );

        -- Relacionar usuarios con sus especialidades
        INSERT INTO UsuarioEspecialidad (usuarioId, especialidadId)
        SELECT u.id, e.id
        FROM Usuario u
        INNER JOIN Especialidad e
            ON e.nombre = LTRIM(RTRIM(u.especialidad))
        WHERE u.especialidad IS NOT NULL
          AND LTRIM(RTRIM(u.especialidad)) <> ''
          AND NOT EXISTS (
              SELECT 1
              FROM UsuarioEspecialidad ue
              WHERE ue.usuarioId = u.id
                AND ue.especialidadId = e.id
          );

        -- Eliminar la columna antigua
        ALTER TABLE Usuario DROP COLUMN especialidad;
    END

    ---------------------------------------------------------
    -- 3. Crear tabla EspecialidadExamenPermitido
    ---------------------------------------------------------
    IF NOT EXISTS (
        SELECT * FROM sys.tables WHERE name = 'EspecialidadExamenPermitido'
    )
    BEGIN
        CREATE TABLE EspecialidadExamenPermitido (
            especialidadOrigenId INT NOT NULL,
            especialidadDestinoId INT NOT NULL,
            CONSTRAINT PK_EspecialidadExamenPermitido
                PRIMARY KEY (especialidadOrigenId, especialidadDestinoId),
            CONSTRAINT FK_EEP_Origen
                FOREIGN KEY (especialidadOrigenId)
                REFERENCES Especialidad(id),
            CONSTRAINT FK_EEP_Destino
                FOREIGN KEY (especialidadDestinoId)
                REFERENCES Especialidad(id)
        );
    END

    ---------------------------------------------------------
    -- 4. Crear tabla EspecialidadCategoriaMedicamento
    ---------------------------------------------------------
    IF NOT EXISTS (
        SELECT * FROM sys.tables WHERE name = 'EspecialidadCategoriaMedicamento'
    )
    BEGIN
        CREATE TABLE EspecialidadCategoriaMedicamento (
            especialidadId INT NOT NULL,
            categoriaId INT NOT NULL,
            CONSTRAINT PK_EspecialidadCategoriaMedicamento
                PRIMARY KEY (especialidadId, categoriaId),
            CONSTRAINT FK_ECM_Especialidad
                FOREIGN KEY (especialidadId)
                REFERENCES Especialidad(id),
            CONSTRAINT FK_ECM_Categoria
                FOREIGN KEY (categoriaId)
                REFERENCES CategoriaMedicamento(id)
        );
    END

    ---------------------------------------------------------
    -- 5. Índices para mejorar el rendimiento
    ---------------------------------------------------------
    IF NOT EXISTS (
        SELECT * FROM sys.indexes WHERE name = 'IX_UsuarioEspecialidad_Usuario'
    )
    BEGIN
        CREATE INDEX IX_UsuarioEspecialidad_Usuario
        ON UsuarioEspecialidad(usuarioId);
    END

    IF NOT EXISTS (
        SELECT * FROM sys.indexes WHERE name = 'IX_UsuarioEspecialidad_Especialidad'
    )
    BEGIN
        CREATE INDEX IX_UsuarioEspecialidad_Especialidad
        ON UsuarioEspecialidad(especialidadId);
    END

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    THROW;
END CATCH;