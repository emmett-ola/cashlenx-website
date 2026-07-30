ARG BUN_BUILD_IMAGE=oven/bun:1-alpine
ARG NGINX_IMAGE=nginx:alpine

FROM ${BUN_BUILD_IMAGE} AS build

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM ${NGINX_IMAGE}

ARG GIT_COMMIT=unknown
LABEL org.opencontainers.image.revision="${GIT_COMMIT}"
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
