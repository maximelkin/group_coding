FROM node:alpine

WORKDIR /home/node/synergy
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --no-cache

COPY . .
# replace ormconfig with special version for docker
COPY docker-ormconfig.json ./ormconfig.json

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["yarn", "start", "--no-cache"]