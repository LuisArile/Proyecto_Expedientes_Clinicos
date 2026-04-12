BEGIN TRY
    BEGIN TRAN;

    -- Índice único para Examen
    IF NOT EXISTS (
        SELECT 1
        FROM sys.indexes
        WHERE name = 'UQ_Examen_Nombre'
          AND object_id = OBJECT_ID('[dbo].[Examen]')
    )
    BEGIN
        CREATE UNIQUE NONCLUSTERED INDEX [UQ_Examen_Nombre]
        ON [dbo].[Examen] ([nombre]);
    END

    -- Índice único para Medicamento
    IF NOT EXISTS (
        SELECT 1
        FROM sys.indexes
        WHERE name = 'UQ_Medicamento_Nombre'
          AND object_id = OBJECT_ID('[dbo].[Medicamento]')
    )
    BEGIN
        CREATE UNIQUE NONCLUSTERED INDEX [UQ_Medicamento_Nombre]
        ON [dbo].[Medicamento] ([nombre]);
    END

    COMMIT TRAN;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRAN;
    THROW;
END CATCH;