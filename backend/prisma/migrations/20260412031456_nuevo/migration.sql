/*
  Warnings:

  - You are about to alter the column `prioridad` on the `ConsultaExamen` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `NVarChar(50)`.
  - You are about to drop the column `presentacion` on the `Medicamento` table. All the data in the column will be lost.
  - You are about to alter the column `nombre` on the `Medicamento` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `NVarChar(150)`.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Examen] DROP CONSTRAINT [FK_Examen_Especialidad];

-- DropForeignKey
ALTER TABLE [dbo].[Medicamento] DROP CONSTRAINT [FK_Medicamento_Categoria];

-- DropIndex
ALTER TABLE [dbo].[CategoriaMedicamento] DROP CONSTRAINT [UQ_CategoriaMedicamento_Nombre];

-- DropIndex
ALTER TABLE [dbo].[Especialidad] DROP CONSTRAINT [UQ_Especialidad_Nombre];

-- DropIndex
DROP INDEX [UQ_Medicamento_Nombre] ON [dbo].[Medicamento];

-- AlterTable
ALTER TABLE [dbo].[CategoriaMedicamento] ALTER COLUMN [nombre] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[ConsultaExamen] ALTER COLUMN [prioridad] NVARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Especialidad] ALTER COLUMN [nombre] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Expediente] ADD CONSTRAINT [Expediente_estado_df] DEFAULT 1 FOR [estado];

-- AlterTable
ALTER TABLE [dbo].[Medicamento] ALTER COLUMN [nombre] NVARCHAR(150) NOT NULL;
ALTER TABLE [dbo].[Medicamento] DROP COLUMN [presentacion];

-- AlterTable
ALTER TABLE [dbo].[Usuario] ADD [debeCambiarPassword] BIT NOT NULL CONSTRAINT [Usuario_debeCambiarPassword_df] DEFAULT 1;

-- CreateTable
CREATE TABLE [dbo].[Cita] (
    [idCita] INT NOT NULL IDENTITY(1,1),
    [pacienteId] INT NOT NULL,
    [fechaCita] DATETIME2 NOT NULL,
    [horaCita] NVARCHAR(20) NOT NULL,
    [motivo] NVARCHAR(255) NOT NULL,
    [prioridad] NVARCHAR(20) NOT NULL CONSTRAINT [Cita_prioridad_df] DEFAULT 'NORMAL',
    [tipo] NVARCHAR(20) NOT NULL CONSTRAINT [Cita_tipo_df] DEFAULT 'PROGRAMADA',
    [estado] NVARCHAR(30) NOT NULL CONSTRAINT [Cita_estado_df] DEFAULT 'PROGRAMADO',
    [recepcionistaId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Cita_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Cita_pkey] PRIMARY KEY CLUSTERED ([idCita])
);

-- CreateTable
CREATE TABLE [dbo].[Seguimiento] (
    [idSeguimiento] INT NOT NULL IDENTITY(1,1),
    [citaId] INT NOT NULL,
    [estadoAnterior] NVARCHAR(30) NOT NULL,
    [estadoNuevo] NVARCHAR(30) NOT NULL,
    [usuarioId] INT NOT NULL,
    [accion] NVARCHAR(100) NOT NULL,
    [observaciones] NVARCHAR(255),
    [fecha] DATETIME2 NOT NULL CONSTRAINT [Seguimiento_fecha_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Seguimiento_pkey] PRIMARY KEY CLUSTERED ([idSeguimiento])
);

-- CreateIndex
ALTER TABLE [dbo].[Especialidad] ADD CONSTRAINT [Especialidad_nombre_key] UNIQUE NONCLUSTERED ([nombre]);

-- CreateIndex
ALTER TABLE [dbo].[CategoriaMedicamento] ADD CONSTRAINT [CategoriaMedicamento_nombre_key] UNIQUE NONCLUSTERED ([nombre]);

-- CreateIndex
ALTER TABLE [dbo].[Medicamento] ADD CONSTRAINT [Medicamento_nombre_key] UNIQUE NONCLUSTERED ([nombre]);

-- AddForeignKey
ALTER TABLE [dbo].[Examen] ADD CONSTRAINT [Examen_especialidadId_fkey] FOREIGN KEY ([especialidadId]) REFERENCES [dbo].[Especialidad]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Medicamento] ADD CONSTRAINT [Medicamento_categoriaId_fkey] FOREIGN KEY ([categoriaId]) REFERENCES [dbo].[CategoriaMedicamento]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Cita] ADD CONSTRAINT [Cita_pacienteId_fkey] FOREIGN KEY ([pacienteId]) REFERENCES [dbo].[Paciente]([idPaciente]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Cita] ADD CONSTRAINT [Cita_recepcionistaId_fkey] FOREIGN KEY ([recepcionistaId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Seguimiento] ADD CONSTRAINT [Seguimiento_citaId_fkey] FOREIGN KEY ([citaId]) REFERENCES [dbo].[Cita]([idCita]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Seguimiento] ADD CONSTRAINT [Seguimiento_usuarioId_fkey] FOREIGN KEY ([usuarioId]) REFERENCES [dbo].[Usuario]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- -- RenameIndex
-- EXEC SP_RENAME N'dbo.CategoriaMedicamento.UQ_CategoriaMedicamento_Nombre', N'CategoriaMedicamento_nombre_key', N'INDEX';

-- -- RenameIndex
-- EXEC SP_RENAME N'dbo.Especialidad.UQ_Especialidad_Nombre', N'Especialidad_nombre_key', N'INDEX';

-- -- RenameIndex
-- EXEC SP_RENAME N'dbo.Examen.UQ_Examen_Nombre', N'Examen_nombre_key', N'INDEX';

-- -- RenameIndex
-- EXEC SP_RENAME N'dbo.Medicamento.UQ_Medicamento_Nombre', N'Medicamento_nombre_key', N'INDEX';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
