FROM node:18

WORKDIR /usr/src/app

COPY src/package*.json ./

RUN npm install

COPY src/. .
COPY flag.txt flag.txt

EXPOSE 9000

CMD ["node", "app.js"]
