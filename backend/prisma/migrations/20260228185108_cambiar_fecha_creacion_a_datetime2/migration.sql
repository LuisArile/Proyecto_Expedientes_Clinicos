BEGIN TRY

BEGIN TRAN;

-- EliminarConstraint
ALTER TABLE [dbo].[Expediente] DROP CONSTRAINT [Expediente_fechaCreacion_df];

-- AlterTable
ALTER TABLE [dbo].[Expediente] ALTER COLUMN [fechaCreacion] DATETIME2 NOT NULL;

-- Recrear el constraint por defecto
ALTER TABLE [dbo].[Expediente] ADD CONSTRAINT [Expediente_fechaCreacion_df] DEFAULT CURRENT_TIMESTAMP FOR [fechaCreacion];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
