FROM node:12-alpine
WORKDIR /app
COPY . /app
RUN npm install -s
CMD ["node", "app.js"]