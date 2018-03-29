FROM node:alpine

COPY package*.json ./
RUN npm ci

COPY . .
# replace ormconfig with special version for docker
COPY docker-ormconfig.json ./ormconfig.json

RUN npm run build

ENV NODE_ENV=production
USER node

EXPOSE 3000

CMD ["npm", "start"]