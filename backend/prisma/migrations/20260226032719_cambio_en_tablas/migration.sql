/*
  Warnings:

  - You are about to drop the `auditoria` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `apellido` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[auditoria] DROP CONSTRAINT [auditoria_usuarioId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [Usuario_activo_df] DEFAULT 1 FOR [activo];
ALTER TABLE [dbo].[Usuario] ADD [apellido] NVARCHAR(1000) NOT NULL,
[especialidad] NVARCHAR(1000),
[nombre] NVARCHAR(1000) NOT NULL,
[ultimoAcceso] DATETIME2,
[updatedAt] DATETIME2 NOT NULL;

-- DropTable
DROP TABLE [dbo].[auditoria];

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
    [genero] NVARCHAR(50) NOT NULL,
    [idResidencia] INT NOT NULL,
    CONSTRAINT [Paciente_pkey] PRIMARY KEY CLUSTERED ([idPaciente])
);

-- CreateTable
CREATE TABLE [dbo].[Expediente] (
    [idExpediente] INT NOT NULL IDENTITY(1,1),
    [idPaciente] INT NOT NULL,
    [numeroExpediente] NVARCHAR(50) NOT NULL,
    [estado] TINYINT NOT NULL,
    [fechaCreacion] DATE NOT NULL CONSTRAINT [Expediente_fechaCreacion_df] DEFAULT CURRENT_TIMESTAMP,
    [fechaActualizacion] DATETIME2 NOT NULL CONSTRAINT [Expediente_fechaActualizacion_df] DEFAULT CURRENT_TIMESTAMP,
    [observaciones] NVARCHAR(100),
    CONSTRAINT [Expediente_pkey] PRIMARY KEY CLUSTERED ([idExpediente]),
    CONSTRAINT [Expediente_idPaciente_key] UNIQUE NONCLUSTERED ([idPaciente]),
    CONSTRAINT [Expediente_numeroExpediente_key] UNIQUE NONCLUSTERED ([numeroExpediente])
);

-- AddForeignKey
ALTER TABLE [dbo].[Auditoria] ADD CONSTRAINT [Auditoria_usuarioId_fkey] FOREIGN KEY ([usuarioId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Expediente] ADD CONSTRAINT [Expediente_idPaciente_fkey] FOREIGN KEY ([idPaciente]) REFERENCES [dbo].[Paciente]([idPaciente]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
