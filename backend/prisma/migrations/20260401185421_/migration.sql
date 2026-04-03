BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Rol] (
    [idRol] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(50) NOT NULL,
    CONSTRAINT [Rol_pkey] PRIMARY KEY CLUSTERED ([idRol]),
    CONSTRAINT [Rol_nombre_key] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[Permiso] (
    [idPermiso] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(50) NOT NULL,
    CONSTRAINT [Permiso_pkey] PRIMARY KEY CLUSTERED ([idPermiso]),
    CONSTRAINT [Permiso_nombre_key] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[PermisosPorRol] (
    [idRol] INT NOT NULL,
    [idPermiso] INT NOT NULL,
    CONSTRAINT [PermisosPorRol_pkey] PRIMARY KEY CLUSTERED ([idRol],[idPermiso])
);

-- CreateTable
CREATE TABLE [dbo].[Usuario] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombreUsuario] NVARCHAR(1000) NOT NULL,
    [correo] NVARCHAR(1000) NOT NULL,
    [clave] NVARCHAR(1000) NOT NULL,
    [idRol] INT NOT NULL,
    [activo] BIT NOT NULL CONSTRAINT [Usuario_activo_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Usuario_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [apellido] NVARCHAR(1000) NOT NULL,
    [especialidad] NVARCHAR(1000),
    [nombre] NVARCHAR(1000) NOT NULL,
    [ultimoAcceso] DATETIME2,
    [updatedAt] DATETIME2 NOT NULL,
    [debeCambiarPassword] BIT NOT NULL CONSTRAINT [Usuario_debeCambiarPassword_df] DEFAULT 0,
    CONSTRAINT [Usuario_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Usuario_nombreUsuario_key] UNIQUE NONCLUSTERED ([nombreUsuario]),
    CONSTRAINT [Usuario_correo_key] UNIQUE NONCLUSTERED ([correo])
);

-- CreateTable
CREATE TABLE [dbo].[Auditoria] (
    [id] INT NOT NULL IDENTITY(1,1),
    [usuarioId] INT,
    [accion] NVARCHAR(1000) NOT NULL,
    [detalles] NVARCHAR(1000),
    [fecha] DATETIME2 NOT NULL CONSTRAINT [Auditoria_fecha_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Auditoria_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Paciente] (
    [idPaciente] INT NOT NULL IDENTITY(1,1),
    [dni] NVARCHAR(20) NOT NULL,
    [nombre] NVARCHAR(50) NOT NULL,
    [apellido] NVARCHAR(50) NOT NULL,
    [correo] NVARCHAR(100),
    [telefono] NVARCHAR(20),
    [fechaNacimiento] DATE NOT NULL,
    [direccion] NVARCHAR(100),
    [sexo] NVARCHAR(50),
    CONSTRAINT [Paciente_pkey] PRIMARY KEY CLUSTERED ([idPaciente])
);

-- CreateTable
CREATE TABLE [dbo].[Expediente] (
    [idExpediente] INT NOT NULL IDENTITY(1,1),
    [idPaciente] INT NOT NULL,
    [numeroExpediente] NVARCHAR(50) NOT NULL,
    [estado] BIT NOT NULL CONSTRAINT [Expediente_estado_df] DEFAULT 1,
    [fechaCreacion] DATETIME2 NOT NULL CONSTRAINT [Expediente_fechaCreacion_df] DEFAULT CURRENT_TIMESTAMP,
    [fechaActualizacion] DATETIME2 NOT NULL CONSTRAINT [Expediente_fechaActualizacion_df] DEFAULT CURRENT_TIMESTAMP,
    [observaciones] NVARCHAR(100),
    CONSTRAINT [Expediente_pkey] PRIMARY KEY CLUSTERED ([idExpediente]),
    CONSTRAINT [Expediente_idPaciente_key] UNIQUE NONCLUSTERED ([idPaciente]),
    CONSTRAINT [Expediente_numeroExpediente_key] UNIQUE NONCLUSTERED ([numeroExpediente])
);

-- CreateTable
CREATE TABLE [dbo].[registroPreclinico] (
    [id] INT NOT NULL IDENTITY(1,1),
    [expedienteId] INT NOT NULL,
    [enfermeroId] INT NOT NULL,
    [presionArterial] NVARCHAR(1000),
    [temperatura] FLOAT(53),
    [peso] FLOAT(53),
    [talla] INT,
    [frecuenciaCardiaca] INT,
    [observaciones] TEXT,
    [fechaRegistro] DATETIME2 NOT NULL CONSTRAINT [registroPreclinico_fechaRegistro_df] DEFAULT CURRENT_TIMESTAMP,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [registroPreclinico_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [registroPreclinico_pkey] PRIMARY KEY CLUSTERED ([id])
);

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
ALTER TABLE [dbo].[PermisosPorRol] ADD CONSTRAINT [PermisosPorRol_idRol_fkey] FOREIGN KEY ([idRol]) REFERENCES [dbo].[Rol]([idRol]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PermisosPorRol] ADD CONSTRAINT [PermisosPorRol_idPermiso_fkey] FOREIGN KEY ([idPermiso]) REFERENCES [dbo].[Permiso]([idPermiso]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [Usuario_idRol_fkey] FOREIGN KEY ([idRol]) REFERENCES [dbo].[Rol]([idRol]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Auditoria] ADD CONSTRAINT [Auditoria_usuarioId_fkey] FOREIGN KEY ([usuarioId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Expediente] ADD CONSTRAINT [Expediente_idPaciente_fkey] FOREIGN KEY ([idPaciente]) REFERENCES [dbo].[Paciente]([idPaciente]) ON DELETE NO ACTION ON UPDATE CASCADE;

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
