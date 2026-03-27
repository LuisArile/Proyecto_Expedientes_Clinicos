BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ConsultaMedica] (
    [id] INT NOT NULL IDENTITY(1,1),
    [expedienteId] INT NOT NULL,
    [medicoId] INT NOT NULL,
    [fechaConsulta] DATETIME2 NOT NULL CONSTRAINT [ConsultaMedica_fechaConsulta_df] DEFAULT CURRENT_TIMESTAMP,
    [motivo] TEXT NOT NULL,
    [diagnostico] TEXT NOT NULL,
    [observaciones] TEXT,
    [tipoConsulta] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ConsultaMedica_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [ConsultaMedica_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[RecetaMedica] (
    [id] INT NOT NULL IDENTITY(1,1),
    [consultaId] INT NOT NULL,
    [medicamento] NVARCHAR(1000) NOT NULL,
    [dosis] NVARCHAR(1000) NOT NULL,
    [duracion] NVARCHAR(1000) NOT NULL,
    [indicaciones] TEXT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RecetaMedica_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RecetaMedica_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[registroPreclinico] ADD CONSTRAINT [registroPreclinico_expedienteId_fkey] FOREIGN KEY ([expedienteId]) REFERENCES [dbo].[Expediente]([idExpediente]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[registroPreclinico] ADD CONSTRAINT [registroPreclinico_enfermeroId_fkey] FOREIGN KEY ([enfermeroId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ConsultaMedica] ADD CONSTRAINT [ConsultaMedica_expedienteId_fkey] FOREIGN KEY ([expedienteId]) REFERENCES [dbo].[Expediente]([idExpediente]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ConsultaMedica] ADD CONSTRAINT [ConsultaMedica_medicoId_fkey] FOREIGN KEY ([medicoId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RecetaMedica] ADD CONSTRAINT [RecetaMedica_consultaId_fkey] FOREIGN KEY ([consultaId]) REFERENCES [dbo].[ConsultaMedica]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
