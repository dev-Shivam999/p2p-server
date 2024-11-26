
FROM node:20


WORKDIR /usr/app


COPY tsconfig*.json ./
COPY package*.json ./


RUN npm install



COPY . .


RUN npx tsc -b


EXPOSE 3000


CMD ["npm", "run", "dev"]
