/*
  Warnings:

  - You are about to alter the column `estado` on the `Expediente` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Bit`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Expediente] ALTER COLUMN [estado] BIT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
