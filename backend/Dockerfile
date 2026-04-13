FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm","start"]
