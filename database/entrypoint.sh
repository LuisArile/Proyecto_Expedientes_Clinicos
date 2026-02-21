#!/bin/bash
# entrypoint.sh

# Inicia SQL Server en background
/opt/mssql/bin/sqlservr &

# Espera a que SQL Server esté listo
echo "Esperando a que SQL Server esté listo..."
until /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -Q "SELECT 1" -C
do
  sleep 2
done

echo "SQL Server listo, ejecutando init.sql..."
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -i /app/init.sql -C

# Contenedor activo con SQL Server en primer plano
wait