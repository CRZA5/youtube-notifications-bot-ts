FROM node:12-alpine AS builder

RUN apk update && apk add curl

RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | sh -s -- -b /usr/local/bin

WORKDIR /app
COPY . .

RUN yarn --frozen-lockfile
RUN yarn build-prod
RUN npm prune --production
RUN /usr/local/bin/node-prune

FROM node:12-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/index.js"]