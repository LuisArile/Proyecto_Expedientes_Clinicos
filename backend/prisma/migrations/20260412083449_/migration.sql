-- /*
--   Warnings:

--   - You are about to drop the `EspecialidadCategoriaMedicamento` table. If the table is not empty, all the data it contains will be lost.
--   - You are about to drop the `EspecialidadExamenPermitido` table. If the table is not empty, all the data it contains will be lost.
--   - You are about to drop the `UsuarioEspecialidad` table. If the table is not empty, all the data it contains will be lost.

-- */
-- BEGIN TRY

-- BEGIN TRAN;

-- -- DropForeignKey
-- ALTER TABLE [dbo].[EspecialidadCategoriaMedicamento] DROP CONSTRAINT [FK_ECM_Categoria];

-- -- DropForeignKey
-- ALTER TABLE [dbo].[EspecialidadCategoriaMedicamento] DROP CONSTRAINT [FK_ECM_Especialidad];

-- -- DropForeignKey
-- ALTER TABLE [dbo].[EspecialidadExamenPermitido] DROP CONSTRAINT [FK_EEP_Destino];

-- -- DropForeignKey
-- ALTER TABLE [dbo].[EspecialidadExamenPermitido] DROP CONSTRAINT [FK_EEP_Origen];

-- -- DropForeignKey
-- ALTER TABLE [dbo].[UsuarioEspecialidad] DROP CONSTRAINT [FK_UsuarioEspecialidad_Especialidad];

-- -- DropForeignKey
-- ALTER TABLE [dbo].[UsuarioEspecialidad] DROP CONSTRAINT [FK_UsuarioEspecialidad_Usuario];

-- -- AlterTable
-- ALTER TABLE [dbo].[Usuario] ADD [especialidad] NVARCHAR(1000);

-- -- DropTable
-- DROP TABLE [dbo].[EspecialidadCategoriaMedicamento];

-- -- DropTable
-- DROP TABLE [dbo].[EspecialidadExamenPermitido];

-- -- DropTable
-- DROP TABLE [dbo].[UsuarioEspecialidad];

-- COMMIT TRAN;

-- END TRY
-- BEGIN CATCH

-- IF @@TRANCOUNT > 0
-- BEGIN
--     ROLLBACK TRAN;
-- END;
-- THROW

-- END CATCH
