IF DB_ID('BD_EXPEDIENTES_CLINICOS') IS NULL
BEGIN
    CREATE DATABASE BD_EXPEDIENTES_CLINICOS;
END;

-- SET ANSI_NULLS ON;
-- SET ANSI_PADDING ON;
-- SET ANSI_WARNINGS ON;
-- SET ARITHABORT ON;
-- SET QUOTED_IDENTIFIER ON;
-- GO

-- IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'BD_EXPEDIENTES_CLINICOS')
-- BEGIN
--   CREATE DATABASE BD_EXPEDIENTES_CLINICOS;
-- END
-- GO

-- USE BD_EXPEDIENTES_CLINICOS;
-- GO

-- IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Clinica')
-- BEGIN
--     EXEC('CREATE SCHEMA Clinica');
-- END
-- GO

-- ----------------------------------------------------TABLAS MAESTRAS-----------------------------------------------
-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Rol')
-- BEGIN
--   CREATE TABLE Clinica.Rol (
--       idRol INT IDENTITY(1,1),
--       nombreRol NVARCHAR(50) NOT NULL,
--       descripcion NVARCHAR(200),
--       nivelAcceso INT,

--       CONSTRAINT PK_Rol PRIMARY KEY (idRol)
--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Especialidad')
-- BEGIN
--   CREATE TABLE Clinica.Especialidad (
--       idEspecialidad INT IDENTITY(1,1),
--       nombreEspecialidad NVARCHAR(50) NOT NULL,
--       descripcion NVARCHAR(200),

--       CONSTRAINT PK_Especialidad PRIMARY KEY (idEspecialidad)
--   );
-- END  
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Ubicacion')
-- BEGIN
--   CREATE TABLE Clinica.Ubicacion (
--     idUbicacion INT IDENTITY(1,1),
--     direccion NVARCHAR(100) NOT NULL,
--     ciudad NVARCHAR(50) NOT NULL,
--     departamento NVARCHAR(50) NOT NULL,
--     pais NVARCHAR(50) NOT NULL,
--     codigoPostal NVARCHAR(10),

--     CONSTRAINT PK_Ubicacion PRIMARY KEY (idUbicacion)
--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Diagnostico')
-- BEGIN
--   CREATE TABLE Clinica.Diagnostico (
--       idDiagnostico INT IDENTITY(1,1),
--       tipoDiagnostico NVARCHAR(50) NOT NULL,
--       descripcion NVARCHAR(100),

--       CONSTRAINT PK_Diagnostico PRIMARY KEY (idDiagnostico)
--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Medicamento')
-- BEGIN
--   CREATE TABLE Clinica.Medicamento (
--       idMedicamento INT IDENTITY(1,1),
--       nombreMedicamento NVARCHAR(50) NOT NULL,
--       descripcion NVARCHAR(200),

--       CONSTRAINT PK_Medicamento PRIMARY KEY (idMedicamento)
--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Examen')
-- BEGIN
--   CREATE TABLE Clinica.Examen (
--       idExamen INT IDENTITY(1,1),
--       nombreExamen NVARCHAR(50) NOT NULL,
--       descripcion NVARCHAR(200),

--       CONSTRAINT PK_Examen PRIMARY KEY (idExamen)
--   );
-- END
-- GO
-- -------------------------------------------------------------------------------------------------------------------------------

-- ---------------------------------------------------TABLAS PRINCIPALES---------------------------------------------

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Paciente')
-- BEGIN
--   CREATE TABLE Clinica.Paciente (
--       idPaciente INT IDENTITY(1,1),
--       dni NVARCHAR(20) NOT NULL,
--       nombre NVARCHAR(50) NOT NULL,
--       apellido NVARCHAR(50) NOT NULL,
--       correo NVARCHAR(100),
--       telefono NVARCHAR(20),
--       fechaNacimiento DATE NOT NULL,
--       genero NVARCHAR(50) NOT NULL,
--       idResidencia INT NOT NULL,
      
--       CONSTRAINT PK_Paciente PRIMARY KEY (idPaciente),    
--       CONSTRAINT FK_Paciente_Residencia FOREIGN KEY (idResidencia) REFERENCES Clinica.Ubicacion(idUbicacion)  
--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Usuario')
--   BEGIN
--   CREATE TABLE Clinica.Usuario (
--       idUsuario INT IDENTITY(1,1),
--       nombreCompleto NVARCHAR(100) NOT NULL,
--       correo NVARCHAR(100) NOT NULL UNIQUE,
--       contrasena NVARCHAR(255) NOT NULL,
--       telefono NVARCHAR(20),
--       fechaRegistro DATETIME DEFAULT GETDATE(),
--       estado BIT DEFAULT 1,
--       idRol INT NOT NULL,
      
--       CONSTRAINT PK_Usuario PRIMARY KEY (idUsuario),    
--       CONSTRAINT FK_Usuario_Rol FOREIGN KEY (idRol) REFERENCES Clinica.Rol(idRol)
--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Expediente')
-- BEGIN
--   CREATE TABLE Clinica.Expediente (
--       idExpediente INT IDENTITY(1,1),
--       idPaciente INT NOT NULL,
--       numeroExpediente NVARCHAR(50) NOT NULL UNIQUE,
--       estado TINYINT,
--       fechaCreacion DATE NOT NULL,
--       fechaActualizacion DATETIME DEFAULT GETDATE(),
--       observaciones NVARCHAR(100),

--       CONSTRAINT PK_Expediente PRIMARY KEY (idExpediente),    
--       CONSTRAINT FK_Expediente_Paciente FOREIGN KEY (idPaciente) REFERENCES Clinica.Paciente(idPaciente) 
--   );
-- END
-- GO

-- -------------------------------------------------------------------------------------------------------------------------------

-- --------------------------------------------TABLAS TRANSACCIONALES------------------------------------------

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Cita')
-- BEGIN
--   CREATE TABLE Clinica.Cita (
--       idCita INT IDENTITY(1,1),
--       idPaciente INT NOT NULL,
--       idDoctor INT NOT NULL,
--       idRecepcionista INT NOT NULL,
--       fechaHora DATETIME DEFAULT GETDATE(),
--       estado TINYINT,
--       observaciones NVARCHAR(200),

--       CONSTRAINT PK_Cita PRIMARY KEY (idCita),    
--       CONSTRAINT FK_Cita_Paciente FOREIGN KEY (idPaciente) REFERENCES Clinica.Paciente(idPaciente),
--       CONSTRAINT FK_Cita_Doctor FOREIGN KEY (idDoctor) REFERENCES Clinica.Usuario(idUsuario),
--       CONSTRAINT FK_Cita_Recepcionista FOREIGN KEY (idRecepcionista) REFERENCES Clinica.Usuario(idUsuario)
--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Preclinica')
-- BEGIN
--   CREATE TABLE Clinica.Preclinica (
--       idPreclinica INT IDENTITY(1,1),
--       idExpediente INT NOT NULL,
--       idEnfermero INT NOT NULL,
--       fechaRegistro DATETIME DEFAULT GETDATE(),
--       tension NVARCHAR(50) NOT NULL,
--       peso DECIMAL(5,2) NOT NULL,
--       temperatura DECIMAL(4,2) NOT NULL,
--       observaciones NVARCHAR(20) NOT NULL,

--       CONSTRAINT PK_Preclinica PRIMARY KEY (idPreclinica),    
--       CONSTRAINT FK_Preclinica_Expediente FOREIGN KEY (idExpediente) REFERENCES Clinica.Expediente(idExpediente),
--       CONSTRAINT FK_Preclinica_Enfermero FOREIGN KEY (idEnfermero) REFERENCES Clinica.Usuario(idUsuario)    
--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Consulta')
-- BEGIN
--   CREATE TABLE Clinica.Consulta (
--       idConsulta INT IDENTITY(1,1),
--       idExpediente INT NOT NULL,
--       idDoctor INT NOT NULL,
--       fechaConsulta DATETIME DEFAULT GETDATE(),
--       motivoConsulta NVARCHAR(200),
--       observaciones NVARCHAR(200),
--       estado TINYINT,
--       idDiagnostico INT NOT NULL,
--       idPreclinica INT NOT NULL,

--       CONSTRAINT PK_Consulta PRIMARY KEY (idConsulta),    
--       CONSTRAINT FK_Consulta_Expediente FOREIGN KEY (idExpediente) REFERENCES Clinica.Expediente(idExpediente),
--       CONSTRAINT FK_Consulta_Doctor FOREIGN KEY (idDoctor) REFERENCES Clinica.Usuario(idUsuario),
--       CONSTRAINT FK_Consulta_Diagnostico FOREIGN KEY (idDiagnostico) REFERENCES Clinica.Diagnostico(idDiagnostico),
--       CONSTRAINT FK_Consulta_Preclinica FOREIGN KEY (idPreclinica) REFERENCES Clinica.Preclinica(idPreclinica)
--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Receta')
-- BEGIN
--   CREATE TABLE Clinica.Receta (
--       idReceta INT IDENTITY(1,1),
--       idConsulta INT NOT NULL,
--       fechaReceta DATETIME DEFAULT GETDATE(),

--       CONSTRAINT PK_Receta PRIMARY KEY (idReceta),    
--       CONSTRAINT FK_Receta_Consulta  FOREIGN KEY (idConsulta) REFERENCES Clinica.Consulta(idConsulta) 

--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='DetalleReceta')
-- BEGIN
--   CREATE TABLE Clinica.DetalleReceta (
--       idDetalleReceta INT IDENTITY(1,1),
--       idReceta INT NOT NULL,
--       idMedicamento INT NOT NULL,
--       cantidad NVARCHAR(50) NOT NULL,
--       dosis NVARCHAR(50) NOT NULL,
--       frecuencia NVARCHAR(50) NOT NULL,
--       duracion INT NOT NULL,

--       CONSTRAINT PK_dtllReceta PRIMARY KEY (idDetalleReceta),    
--       CONSTRAINT FK_dtll_Medicamento FOREIGN KEY (idMedicamento) REFERENCES Clinica.Medicamento(idMedicamento),
--       CONSTRAINT FK_dtll_Receta FOREIGN KEY (idReceta) REFERENCES Clinica.Receta(idReceta)
--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='DetalleExamen')
-- BEGIN
--   CREATE TABLE Clinica.DetalleExamen (
--       idDetalleExamen INT IDENTITY(1,1),
--       idConsulta INT NOT NULL,
--       idExamen INT NOT NULL,
--       observaciones NVARCHAR(100),
--       resultados NVARCHAR(100),

--       CONSTRAINT PK_dtllExamen PRIMARY KEY (idDetalleExamen),    
--       CONSTRAINT FK_DtllExm_Consulta FOREIGN KEY (idConsulta) REFERENCES Clinica.Consulta(idConsulta),
--       CONSTRAINT FK_DtllExm_Examen FOREIGN KEY (idExamen) REFERENCES Clinica.Examen(idExamen)
--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Documento')
-- BEGIN
--   CREATE TABLE Clinica.Documento (
--       idDocumento INT IDENTITY(1,1),
--       idConsulta INT NOT NULL,
--       descripcion NVARCHAR(100),
--       tipoDocumento CHAR(10),
--       fechaRegistro DATETIME DEFAULT GETDATE(),

--       CONSTRAINT PK_Documento PRIMARY KEY (idDocumento),    
--       CONSTRAINT FK_Doct_Consulta FOREIGN KEY (idConsulta) REFERENCES Clinica.Consulta(idConsulta) 
--   );
-- END
-- GO

-- -------------------------------------------------------------------------------------------------------------------------------

-- ---------------------------------------------------TABLAS INTERMEDIAS--------------------------------------------

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='MedicamentoEspecialidad')
-- BEGIN
--   CREATE TABLE Clinica.MedicamentoEspecialidad (
--       idMedicamento INT NOT NULL,
--       idEspecialidad INT NOT NULL,

--       CONSTRAINT PK_MedicamentoEspecialidad PRIMARY KEY (idMedicamento, idEspecialidad),
--       CONSTRAINT FK_MedEsp_Medicamento FOREIGN KEY (idMedicamento) REFERENCES Clinica.Medicamento(idMedicamento),
--       CONSTRAINT FK_MedEsp_Especialidad FOREIGN KEY (idEspecialidad) REFERENCES Clinica.Especialidad(idEspecialidad)
--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='ExamenEspecialidad')
-- BEGIN
--   CREATE TABLE Clinica.ExamenEspecialidad (
--       idExamen INT NOT NULL,
--       idEspecialidad INT NOT NULL,
      
--       CONSTRAINT PK_ExamenEspecialidad PRIMARY KEY (idExamen, idEspecialidad),
--       CONSTRAINT FK_ExmEsp_Examen FOREIGN KEY (idExamen) REFERENCES Clinica.Examen(idExamen),
--       CONSTRAINT FK_ExmEsp_Especialidad FOREIGN KEY (idEspecialidad) REFERENCES Clinica.Especialidad(idEspecialidad)
--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='PacienteDoctor')
-- BEGIN
--   CREATE TABLE Clinica.PacienteDoctor (
--       idPacienteDoctor INT IDENTITY(1,1),
--       idPaciente INT NOT NULL,
--       idDoctor INT NOT NULL,
--       UNIQUE (idPaciente, idDoctor),

--       fechaAsignacion DATETIME DEFAULT GETDATE(),
--       estado BIT DEFAULT 1,

--       CONSTRAINT PK_PacntDoc PRIMARY KEY (idPacienteDoctor),    
--       CONSTRAINT FK_PDoc_Paciente FOREIGN KEY (idPaciente) REFERENCES Clinica.Paciente(idPaciente),
--       CONSTRAINT FK_PDoc_Doctor FOREIGN KEY (idDoctor) REFERENCES Clinica.Usuario(idUsuario)
--   );
-- END
-- GO

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='PacienteEnfermero')
-- BEGIN
--   CREATE TABLE Clinica.PacienteEnfermero (
--       idPacienteEnfermero INT IDENTITY(1,1),
--       idPaciente INT NOT NULL,
--       idEnfermero INT NOT NULL,

--       UNIQUE (idPaciente, idEnfermero),

--       fechaAsignacion DATETIME DEFAULT GETDATE(),
--       estado BIT DEFAULT 1,

--       CONSTRAINT PK_PacntEmfr PRIMARY KEY (idPacienteEnfermero),
--       CONSTRAINT FK_Pa_Emfr_Paciente FOREIGN KEY (idPaciente) REFERENCES Clinica.Paciente(idPaciente),
--       CONSTRAINT FK_Pa_Emfr_Enfermero FOREIGN KEY (idEnfermero) REFERENCES Clinica.Usuario(idUsuario)
--   );
-- END
-- GO

-- -------------------------------------------------------------------------------------------------------------------------------

-- --------------------------------------------------TABLAS DE AUDITORÍA--------------------------------------------

-- IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='Clinica' AND TABLE_NAME='Historico')
-- BEGIN
--   CREATE TABLE Clinica.Historico (
--       idHistorico INT IDENTITY(1,1),
--       idUsuario INT NOT NULL,
--       accion NVARCHAR(100) NOT NULL,
--       fecha DATETIME DEFAULT GETDATE(),
--       tablaAfectada VARCHAR(100),

--       CONSTRAINT PK_Historico PRIMARY KEY (idHistorico),
--       CONSTRAINT FK_H_Usuario FOREIGN KEY (idUsuario) REFERENCES Clinica.Usuario(idUsuario) 
--   );
-- END
-- GO



