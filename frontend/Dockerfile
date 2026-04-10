# ---------- BASE ----------
FROM node:22 AS base

WORKDIR /app

COPY Expedientes_Clinicos/package*.json ./
RUN npm install

# ---------- DEV ----------
FROM base AS dev

COPY Expedientes_Clinicos .

EXPOSE 5173

CMD ["npm", "run", "dev"]

# ---------- BUILD ----------
FROM base AS build

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY Expedientes_Clinicos .
RUN npm run build

# ---------- PROD ----------
FROM nginx:alpine AS prod

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]