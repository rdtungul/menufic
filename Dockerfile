FROM node:22.2.0
WORKDIR /app
COPY package*.json ./
RUN npm i --ignore-scripts
COPY . .
RUN npm run postinstall
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
