BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[registroPreclinico] (
    [id] INT NOT NULL IDENTITY(1,1),
    [expedienteId] INT NOT NULL,
    [enfermeroId] INT NOT NULL,
    [presionArterial] NVARCHAR(1000),
    [temperatura] FLOAT(53),
    [peso] FLOAT(53),
    [frecuenciaCardiaca] INT,
    [observaciones] TEXT,
    [fechaRegistro] DATETIME2 NOT NULL CONSTRAINT [registroPreclinico_fechaRegistro_df] DEFAULT CURRENT_TIMESTAMP,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [registroPreclinico_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [registroPreclinico_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[registroPreclinico] ADD CONSTRAINT [registroPreclinico_expedienteId_fkey] FOREIGN KEY ([expedienteId]) REFERENCES [dbo].[Expediente]([idExpediente]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[registroPreclinico] ADD CONSTRAINT [registroPreclinico_enfermeroId_fkey] FOREIGN KEY ([enfermeroId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
