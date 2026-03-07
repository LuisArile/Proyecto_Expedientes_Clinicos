/*
  Warnings:

  - You are about to drop the column `rol` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `idRol` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Usuario] DROP COLUMN [rol];
ALTER TABLE [dbo].[Usuario] ADD [idRol] INT NOT NULL;

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

-- AddForeignKey
ALTER TABLE [dbo].[PermisosPorRol] ADD CONSTRAINT [PermisosPorRol_idRol_fkey] FOREIGN KEY ([idRol]) REFERENCES [dbo].[Rol]([idRol]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PermisosPorRol] ADD CONSTRAINT [PermisosPorRol_idPermiso_fkey] FOREIGN KEY ([idPermiso]) REFERENCES [dbo].[Permiso]([idPermiso]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [Usuario_idRol_fkey] FOREIGN KEY ([idRol]) REFERENCES [dbo].[Rol]([idRol]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
