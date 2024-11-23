# Install dependencies only when needed
FROM node:20.9.0-alpine3.18 AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./

RUN npm ci

# Rebuild the source code only when needed
FROM node:20.9.0-alpine3.18 AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1


EXPOSE 3000

ENV PORT 3000

# replce environment variables with dummy value gotten from hash of env variable names
RUN node /app/set_dummy_env.js

RUN npm run build

# RUN rm -rf .next


FROM node:20.9.0-alpine3.18 AS stable-build

WORKDIR /app

COPY ./public  /app/.next/standalone/public

COPY --from=builder /app/.next/static /app/.next/static

COPY --from=builder /app/.next/standalone /app

COPY build_and_run.sh .env.example search_and_replace_env.js  /app/

RUN apk add --no-cache git

RUN npm install blueimp-md5@2.19.0 

ENTRYPOINT ["/bin/sh"]
CMD ["/app/build_and_run.sh"]
