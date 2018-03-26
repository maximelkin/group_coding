FROM node:alpine

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
USER node

CMD ["npm", "start"]