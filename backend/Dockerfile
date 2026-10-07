FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY server.js ./

RUN rm -rf /usr/local/lib/node_modules/npm \
    /opt/yarn-v1.22.22

USER node

EXPOSE 3000

CMD ["node", "server.js"]