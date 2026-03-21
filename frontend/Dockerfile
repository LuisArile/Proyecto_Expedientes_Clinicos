FROM node:22 AS build

WORKDIR /app

COPY Expedientes_Clinicos/package*.json ./
RUN npm install

COPY Expedientes_Clinicos .
RUN npm run build

# Serve
FROM nginx:alpine

# Config nginx (opcional pero recomendado)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# IMPORTANTE: ruta correcta
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]