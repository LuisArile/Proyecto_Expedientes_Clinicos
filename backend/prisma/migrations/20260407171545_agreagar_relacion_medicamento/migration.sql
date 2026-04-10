/*
  Warnings:

  - You are about to drop the column `medicamento` on the `RecetaMedica` table. All the data in the column will be lost.
  - Added the required column `medicamentoId` to the `RecetaMedica` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[RecetaMedica] DROP COLUMN [medicamento];
ALTER TABLE [dbo].[RecetaMedica] ADD [medicamentoId] INT NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[Medicamento] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    [categoria] NVARCHAR(1000) NOT NULL,
    [presentacion] NVARCHAR(1000) NOT NULL,
    [estado] BIT NOT NULL CONSTRAINT [Medicamento_estado_df] DEFAULT 1,
    [fechaCreacion] DATETIME2 NOT NULL CONSTRAINT [Medicamento_fechaCreacion_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Medicamento_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[RecetaMedica] ADD CONSTRAINT [RecetaMedica_medicamentoId_fkey] FOREIGN KEY ([medicamentoId]) REFERENCES [dbo].[Medicamento]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
