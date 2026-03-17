FROM node:22 AS build

WORKDIR /app

COPY Expedientes_Clinicos/package*.json ./

RUN npm ci

COPY Expedientes_Clinicos .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80