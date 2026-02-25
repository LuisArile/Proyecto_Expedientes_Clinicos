# docker-compose.yml orquesta todo, ya no necesitamos DockerFile
# Utilizamos la imagen oficial de sql 2022
FROM mcr.microsoft.com/mssql/server:2022-latest

# # Aceptamos la licencia
# ENV ACCEPT_EULA=Y
# # contraseña creadas en .env.docker (desde la raiz del proyecto)
# ENV MSSQL_SA_PASSWORD=${MSSQL_SA_PASSWORD}

# # Establecemos el directorio de trabajo
# WORKDIR /app

# # Copiamos el script de inicialización de la imagen
# COPY init.sql /app/init.sql
# COPY entrypoint.sh /app/entrypoint.sh

# ENTRYPOINT ["bash", "/app/entrypoint.sh"]