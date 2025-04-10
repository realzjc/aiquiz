FROM node:18

WORKDIR /app
COPY package.json vite.config.js ./
RUN npm install

COPY ./src ./src
COPY ./public ./public

CMD ["npm", "run", "dev"]