/*
  Warnings:

  - You are about to drop the column `genero` on the `Paciente` table. All the data in the column will be lost.
  - You are about to drop the column `idResidencia` on the `Paciente` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Paciente] DROP COLUMN [genero],
[idResidencia];
ALTER TABLE [dbo].[Paciente] ADD [direccion] NVARCHAR(100),
[sexo] NVARCHAR(50);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
