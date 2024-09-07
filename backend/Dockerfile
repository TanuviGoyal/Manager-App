FROM node:latest
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "src/app.js"]
EXPOSE 5001