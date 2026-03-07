BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Usuario] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombreUsuario] NVARCHAR(1000) NOT NULL,
    [correo] NVARCHAR(1000) NOT NULL,
    [clave] NVARCHAR(1000) NOT NULL,
    [rol] NVARCHAR(1000) NOT NULL,
    [activo] BIT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Usuario_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Usuario_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Usuario_nombreUsuario_key] UNIQUE NONCLUSTERED ([nombreUsuario]),
    CONSTRAINT [Usuario_correo_key] UNIQUE NONCLUSTERED ([correo])
);

-- CreateTable
CREATE TABLE [dbo].[auditoria] (
    [id] INT NOT NULL IDENTITY(1,1),
    [usuarioId] INT NOT NULL,
    [accion] NVARCHAR(1000) NOT NULL,
    [fecha] DATETIME2 NOT NULL CONSTRAINT [auditoria_fecha_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [auditoria_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[auditoria] ADD CONSTRAINT [auditoria_usuarioId_fkey] FOREIGN KEY ([usuarioId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
