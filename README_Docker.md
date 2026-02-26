
# Dockerización de la Base de Datos
Este documento explica cómo levantar, configurar y manejar el contenedor de SQL Server para el proyecto de base de datos clínica, utilizando Docker y Docker Compose.

1. Requisitos

    - [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/an_awesome_website_link) instalado y corriendo.



1. Estructura de carpetas

    proyecto-expedientes_clinicos/

        ├── backend/
        |    └──.env # Variables de entorno, ej: DB_PASSWORD=SuContraseñaSegura123!
        |
        ├── database/
        |    ├── dockerfile # Imagen de SQL Server + init
        |    ├── entrypoint.sh # Ejecuta init.sql y migraciones al iniciar
        |    ├── init.sql # Script de creación de DB, esquemas y tablas
        |    ├── seed.sql  # datos de prueba
        |    └──migrations/ # Scripts versionados para cambios futuros
        |                ├── 001_create_roles.sql
        |                ├── 002_create_paciente.sql
        |                └── ...
        └── docker-compose.yml # Levanta contenedor SQL Server

1. Configuración de variables de entorno

    En el archivo .env dentro de backend/ con la contraseña para el usuario sa:

        DB_PASSWORD=SuContraseñaSegura123!
    
    Recordar los criterios de aceptación de una contraseña:
            
    - Más de 12 caracteres

    - Al menos una letra minúscula y una mayúscula

    - Al menos un número

    - Al menos un carácter especial


1. Traer la imagen oficial de SQL Server 

    Antes de levantar el contenedor, desde la terminar traer la imagen oficial desde el registro de Microsoft (MCR):
 
        docker pull mcr.microsoft.com/mssql/server:2022-latest

    Es una de las versión con mayor soporte o pueden revisar otras versiones [Docker Hub](https://hub.docker.com/r/microsoft/mssql-server) **no recomendado**

1. Levantar el contenedor

    1. Desde la raíz del proyecto
    
            docker-compose up -d

        - Esto construye la imagen definida en database/Dockerfile y levanta el contenedor sql-clinica.

        O también:

            docker-compose up -d --build

        - Para la primera ejecución o si hicieron cambios en scripts/Dockerfile
    
    2. Verificar logs de inicialización:

            docker logs sql-clinica

        - Aquí podemos ver si SQL Server arrancó correctamente y si init.sql se ejecutó sin errores.

1. Concetarse al contenedor con sqlcmd

    Abrir una sesión interactiva dentro del contenedor, para probar integridad, y hacer consultas sobre tablas:

        docker exec -it sql-clinica /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P sucontraseña -C

    Prueba de conexión:

        1> SELECT name FROM sys.databases;
        2> GO

1. Estructura de scripts SQL

    1. init.sql: crea base de datos, esquemas y tablas maestras (idempotente).

    1. seed.sql: llena datos de prueba opcionalmente.

    1. migrations/ : scripts versionados para cambios futuros (ej. nuevas tablas, columnas o constraints). **Aún falta investigar** 

        - Cada archivo se numera (001_, 002_, …) para mantener orden de ejecución.

1. Comandos útiles

    - Detener componentes:
       
            docker-compose down 

    - Reiniciar y reconstruir contenedor:

            docker-compose up -d --build

    - Ejecutar un script SQL manualmente:

            docker exec -it sql-clinica /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $DB_PASSWORD -i /app/database/migrations/001_create_roles.sql -C

1. Recomendaciones importantes
    1. Esperar a que SQL Server esté listo:
    
        - El contenedor puede tardar 10-20 segundos en arrancar completamente.

        - Si el backend intenta conectarse antes, dará error de conexión.

1. Lo que falta:

    1. Ejecución automática de migraciones
        - Crear un flujo en entrypoint.sh que detecte los scripts en migrations/ y los ejecute solo si no se han aplicado.

    1. Tabla MigrationHistory
        - Mantener una tabla que registre qué scripts de migración ya se ejecutaron.
        - Cada vez que se corre un script nuevo, se registra su nombre y fecha de ejecución.

    1. Versionado seguro
        - Cada script de migración se versiona en Git con numeración clara (001_, 002_, …).