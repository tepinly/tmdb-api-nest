FROM node:23

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

RUN npm install -g @nestjs/cli

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start:prod"]
