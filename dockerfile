FROM node:22

WORKDIR /app

COPY . /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

RUN npm install

EXPOSE 3000

ENV NAME task_api

CMD ["npm", "run", "test"]

