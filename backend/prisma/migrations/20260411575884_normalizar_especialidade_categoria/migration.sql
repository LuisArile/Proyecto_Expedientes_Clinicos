BEGIN TRY
    BEGIN TRAN;

    -- =========================================
    -- 1. Crear tabla Especialidad
    -- =========================================
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Especialidad')
    BEGIN
        CREATE TABLE [dbo].[Especialidad] (
            [id] INT IDENTITY(1,1) NOT NULL,
            [nombre] NVARCHAR(100) NOT NULL,
            CONSTRAINT [Especialidad_pkey] PRIMARY KEY CLUSTERED ([id]),
            CONSTRAINT [UQ_Especialidad_Nombre] UNIQUE ([nombre])
        );
    END

    -- =========================================
    -- 2. Crear tabla CategoriaMedicamento
    -- =========================================
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CategoriaMedicamento')
    BEGIN
        CREATE TABLE [dbo].[CategoriaMedicamento] (
            [id] INT IDENTITY(1,1) NOT NULL,
            [nombre] NVARCHAR(100) NOT NULL,
            CONSTRAINT [CategoriaMedicamento_pkey] PRIMARY KEY CLUSTERED ([id]),
            CONSTRAINT [UQ_CategoriaMedicamento_Nombre] UNIQUE ([nombre])
        );
    END

    -- =========================================
    -- 3. Agregar columnas de relación
    -- =========================================
    IF COL_LENGTH('Examen', 'especialidadId') IS NULL
        ALTER TABLE [dbo].[Examen] ADD [especialidadId] INT;

    IF COL_LENGTH('Medicamento', 'categoriaId') IS NULL
        ALTER TABLE [dbo].[Medicamento] ADD [categoriaId] INT;

    -- =========================================
    -- 4. Insertar especialidades únicas
    -- =========================================
    INSERT INTO [dbo].[Especialidad] (nombre)
    SELECT DISTINCT LTRIM(RTRIM(especialidad))
    FROM [dbo].[Examen]
    WHERE especialidad IS NOT NULL
      AND NOT EXISTS (
          SELECT 1 FROM [dbo].[Especialidad] e
          WHERE e.nombre = LTRIM(RTRIM(Examen.especialidad))
      );

    -- =========================================
    -- 5. Insertar categorías únicas
    -- =========================================
    INSERT INTO [dbo].[CategoriaMedicamento] (nombre)
    SELECT DISTINCT LTRIM(RTRIM(categoria))
    FROM [dbo].[Medicamento]
    WHERE categoria IS NOT NULL
      AND NOT EXISTS (
          SELECT 1 FROM [dbo].[CategoriaMedicamento] c
          WHERE c.nombre = LTRIM(RTRIM(Medicamento.categoria))
      );

    -- =========================================
    -- 6. Actualizar relaciones
    -- =========================================
    UPDATE e
    SET especialidadId = es.id
    FROM [dbo].[Examen] e
    INNER JOIN [dbo].[Especialidad] es
        ON LTRIM(RTRIM(e.especialidad)) = es.nombre;

    UPDATE m
    SET categoriaId = c.id
    FROM [dbo].[Medicamento] m
    INNER JOIN [dbo].[CategoriaMedicamento] c
        ON LTRIM(RTRIM(m.categoria)) = c.nombre;

    -- =========================================
    -- 7. Hacer obligatorias las columnas
    -- =========================================
    ALTER TABLE [dbo].[Examen]
        ALTER COLUMN [especialidadId] INT NOT NULL;

    ALTER TABLE [dbo].[Medicamento]
        ALTER COLUMN [categoriaId] INT NOT NULL;

    -- =========================================
    -- 8. Crear claves foráneas
    -- =========================================
    ALTER TABLE [dbo].[Examen]
        ADD CONSTRAINT [FK_Examen_Especialidad]
        FOREIGN KEY ([especialidadId]) REFERENCES [dbo].[Especialidad]([id]);

    ALTER TABLE [dbo].[Medicamento]
        ADD CONSTRAINT [FK_Medicamento_Categoria]
        FOREIGN KEY ([categoriaId]) REFERENCES [dbo].[CategoriaMedicamento]([id]);

    -- =========================================
    -- 9. Eliminar columnas antiguas
    -- =========================================
    IF COL_LENGTH('Examen', 'especialidad') IS NOT NULL
        ALTER TABLE [dbo].[Examen] DROP COLUMN [especialidad];

    IF COL_LENGTH('Medicamento', 'categoria') IS NOT NULL
        ALTER TABLE [dbo].[Medicamento] DROP COLUMN [categoria];

    COMMIT TRAN;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRAN;
    THROW;
END CATCH;