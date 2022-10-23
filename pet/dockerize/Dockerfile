FROM node:16.15.1-alpine3.16
RUN mkdir /wb
RUN chown -R node:node /wb
USER node
WORKDIR /wb
COPY . .
RUN npm install 

EXPOSE 8080

CMD ["node", "nserver.js"]

