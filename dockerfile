
FROM node:20


WORKDIR /usr/app


COPY package*.json ./


RUN npm install


COPY tsconfig*.json ./
COPY . .


RUN npx tsc -b


EXPOSE 3000


CMD ["npm", "run", "dev"]
