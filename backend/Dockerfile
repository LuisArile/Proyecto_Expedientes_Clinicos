FROM node:20-alpine

# # Dependencias necesarias para Prisma y SQL Server
# # openssl es crítico para las conexiones seguras de Prisma
# RUN apk add --no-cache openssl

# WORKDIR /app

# COPY package*.json ./
# COPY prisma ./prisma/

# RUN npm install
# RUN npx prisma generate

# # Copiamos el resto del código del backend
# COPY . .

# EXPOSE 3000

# CMD ["npm", "run", "dev"]