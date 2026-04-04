BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Examen] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(100) NOT NULL,
    [especialidad] NVARCHAR(100) NOT NULL,
    [estado] BIT NOT NULL CONSTRAINT [Examen_estado_df] DEFAULT 1,
    [fechaCreacion] DATETIME2 NOT NULL CONSTRAINT [Examen_fechaCreacion_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Examen_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ConsultaExamen] (
    [id] INT NOT NULL IDENTITY(1,1),
    [consultaId] INT NOT NULL,
    [examenId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ConsultaExamen_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ConsultaExamen_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ConsultaExamen_consultaId_examenId_key] UNIQUE NONCLUSTERED ([consultaId],[examenId])
);

-- AddForeignKey
ALTER TABLE [dbo].[ConsultaExamen] ADD CONSTRAINT [ConsultaExamen_consultaId_fkey] FOREIGN KEY ([consultaId]) REFERENCES [dbo].[ConsultaMedica]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ConsultaExamen] ADD CONSTRAINT [ConsultaExamen_examenId_fkey] FOREIGN KEY ([examenId]) REFERENCES [dbo].[Examen]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
