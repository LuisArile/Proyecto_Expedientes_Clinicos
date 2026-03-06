# Proyecto - Sistema de Gestión de Expedientes Clínicos

- **Versión:** 1.0.0-Sprint1
- **Última edición:** 01 de marzo de 2026

Implementar un sistema de gestión digital de expedientes clínicos en la nube que optimice los procesos administrativos y de atención al paciente.

Este proyecto utiliza un stack moderno con **React** en el frontend, **Node.js/Express** en el backend y **SQL Server** como base de datos gestionada por **Prisma ORM**.

## Estructura del Proyecto

        PROYECTO_EXPEDIENTES_CLINICOS/
        ├── backend/                            # Lógica del servidor (Node.js)
        │   ├── src/
        │   │   ├── config/                     # Prisma client y roles
        │   │   ├── controllers/                # Manejo de peticiones HTTP
        |   |   ├── factoryMet                  # Patrones de creación (Factory Method)         
        │   │   ├── middlewares/                # Validación de JWT (Bitácora)
        |   |   ├── models/                     # Definiciones de datos
        │   │   ├── repositories/               # Consultas directas a la DB
        │   │   ├── routes/                     # Definición de Endpoints
        │   │   ├── services/                   # Lógica de negocio (Bitácora, Auth)
        |   |   ├── utils/                      # Helpers y funciones auxiliares
        |   |   └── app.js                      # Configuración de Express
        │   ├── prisma/                         # Schema y Migraciones
        |   ├── tests/                          # Pruebas unitarias/integración
        |   ├── server.js                       # Punto de entrada del servidor
        │   └── .env                            # Variables de entorno (DB, JWT, Port)
        ├── frontend/                           # Interfaz de usuario (React + Vite)
        |   └── Expedientes_Clinicos            #
        │       └── src/
        |           ├── components/             # Layouts, UI genérica
        |           ├── constants/              # Estrategias de Menús y Roles (Configuración estática)
        │           ├── features/               # Módulos de negocio
        |           |       ├── auth/           # Contexto de autenticación y Login
        │           |       ├── dashboard/      # Paneles específicos por Rol (Médico, Admin, etc.)
        │           |       ├── expedientes/    # Gestión de pacientes
        │           |       └── usuarios/
        │           ├── pages/                  # Vistas de alto nivel (Login, Dashboard, Password)
        │           ├── services/               # Cliente de API centralizado (fetch/axios)
        │           └── utils/                  # Formateadores de fecha, validadores, etc.
        ├── database/ (obsoleto)
        ├── .env.docker                         # Configuración para el contenedor
        └── docker-compose.yml                  # Orquestación de SQL Server


## Guía de Instalación Rápida

1. **Configuración de Variables de Entorno**

     Para que el sistema funcione, se deben crear dos archivos ```.env```. (Este se unificara en uno solo en el siguiente sprint)

    1. **En la Raíz del Proyecto (```/.env.docker```)**<br>
        Este archivo configura el contenedor de SQL Server.

           ACCEPT_EULA=Y
           MSSQL_SA_PASSWORD=TuPasswordSeguro123!

    1. **En la carpeta Backend (```/backend/.env```)**<br>
        Este archivo conecta la API con la base de datos y configura la seguridad.

            PORT=3000
            JWT_SECRET=UsaUnaClaveAleatoriaSegura

            # Configuración individual para referencia
            DB_SERVER=localhost
            DB_NAME=BD_EXPEDIENTES_CLINICOS
            DB_USER=sa
            DB_PASSWORD=DebeCoincidirConElDeDocker
            
            # --- Configuración para Prisma ---
            # IMPORTANTE: reemplazar manualmente los valores ${} por los datos reales.
            # Si dejan los símbolos ${}, la conexión fallará.
            DATABASE_URL="sqlserver://${DB_SERVER}:1433;database=${DB_NAME};user=${DB_USER};password=${DB_PASSWORD};trustServerCertificate=true;"

            FRONTEND_URL=http://localhost:5173

1. **Levantar la Base de Datos (Docker):**
<br/>
Este comando descarga y levanta SQL Server. 
     
   docker-compose.yml utiliza el archivo .env.docker para inicializar la instancia.

       docker-compose up -d

 
   * Tip: Si cambia la contraseña en ```.env.docker``` después de haber levantado el contenedor por primera vez, SQL Server no la actualizará automáticamente debido al volumen persistente (sql_data_clinica). Para resetearla totalmente usar:

         docker compose down -v
         docker compose up -d


1. **Configurar el Backend:**
<br/>
Entrar a la carpeta del servidor e instalar las dependencias.

       cd backend
       npm install


   1. **Sincronizar Prisma (ORM):**<br/>
      Generar el cliente de Prisma y empujar el esquema a la base de datos de Docker:

          npx prisma generate     # Genera el cliente de Prisma

   1. Mantenimiento DB:

          npx prisma studio          # Interfaz visual para ver los datos
          npx prisma migrate reset   # BORRA TODO y recrea *(Uso con precaución)*
          npx prisma db pull         # Sincroniza el schema con una DB existente

   1. **Iniciar el Backend**

          npm run dev

1. **Configurar el Fronted**

     * Instalación de dependencias:

          Debido a posibles conflictos de versiones en librerías de UI (Radix, Tailwind), se recomienda usar el flag de compatibilidad:

           npm install --legacy-peer-deps

     * Comando de ejecución:

           npm run dev

## Arquitectura Técnica y Patrones

### Programación Orienta a Objetos

* **Herencia:** 
  * **Clase Padre:** Usuario: Nos permite heredar propiedades y métodos de otra clase.
  * **Clases que Heredan:** Medico, Recepcionista, Enfermero, Paciente, Administrado

* **Polimorfismo:**<br>
  Podemos hacer que en un mismo método se comporte diferente según la clase que lo implante.

  *Ejemplo:* Método de Saludo (getBienvenida()) = Nos retorna `Bienvenido ${this.nombre}` según la clase.

* **Factory Method:**<br>
  Nos permite centralizar la creación de usuarios en un solo lugar, para manejar diferentes roles.

### Seguridad y Auditoría
1. **Autenticación:** Uso de JWT (JSON Web Tokens) y encriptación de contraseñas con bcrypt.

1. **Bitácora Automática:** Flujo estandarizado para registrar acciones:
    * Acción (Front) → Middleware → Controller → Service → AuditoriaService → Repository → DB.

      1. **Acción (Front):** El usuario envía una petición (ej: Crear Expediente).

      1. **Route (Backend):** La petición llega al servidor y es dirigida a la ruta correspondiente.
      
      1. **Middleware (Interceptor):** * Valida el **JWT** en el header ```Authorization: Bearer <token>.```

          * Extrae el ```usuarioId``` y lo inyecta en la petición.
          * Valida permisos (si aplica).

      1. **Controller:** Recibe la petición ya validada.

      1. **Service:** Realiza la lógica y llama al AuditoriaService.

      1. **Repository → DB:** Se guarda la acción en la tabla Auditoria con fecha, usuario y tipo de evento.

      1. **DB (SQL Server):** Se confirman los cambios mediante una transacción.

1. **Roles:** El sistema utiliza Estrategias de Menú para renderizar dinámicamente la interfaz según el rol del usuario logueado.

<div align="center">

| Rol                   | Funciones Principales                         |Color Badge    |
|-----------------------|-----------------------------------------------|---------------|
| **ADMINISTRADOR**     | Gestión total, Auditoría, Catálogos.          |Rojo           |
| **MEDICO**            | Consulta médica, Exámenes, Documentos.        |Morado         |
| **RECEPCIONISTA**     | Crear expedientes, Búsqueda.                  |Azul           |
| **ENFERMERO**         | Preclínica, Signos vitales.                   |Verde          |

</div>

## Comando útiles de mantenimineto

* Ver la base de datos (Interfaz Web):

 npx prisma studio

* Revisar logs de auditoria (SQL):

      SELECT * FROM Auditoria ORDER BY fecha DESC;

* Detener contenedores:

      docker-compose down
