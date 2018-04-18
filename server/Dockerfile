FROM node:alpine

COPY package*.json ./
RUN yarn install --production

COPY . .
# replace ormconfig with special version for docker
COPY docker-ormconfig.json ./ormconfig.json

RUN yarn run build

ENV NODE_ENV=production
ENV PORT=8080

USER node

EXPOSE 8080

CMD ["npm", "start"]