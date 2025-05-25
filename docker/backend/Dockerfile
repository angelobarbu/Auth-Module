FROM node:lts-alpine

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend .

ENV NODE_ENV=production

EXPOSE 5001

CMD ["node","server.js"]