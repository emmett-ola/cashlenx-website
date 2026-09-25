ARG BUN_BUILD_IMAGE=oven/bun:1.4.2-alpine@sha256:d888c0ae6c86d7866ff10c5aafdd9077b36aee6455b33dd270fb93c0dd5cef6f
ARG NGINX_IMAGE=nginx:alpine@sha256:1ed1b0e1d7652937d6cbdaf4018c7b6fc009a7dd6c3047351e2eddda745de43f

FROM ${BUN_BUILD_IMAGE} AS build

ARG BUN_VERSION
RUN test "$(bun --version)" = "${BUN_VERSION}"

WORKDIR /app
COPY package.json bun.lock ./
RUN bun --no-env-file install --frozen-lockfile

COPY . .
RUN bun --no-env-file run build

FROM ${NGINX_IMAGE}

ARG GIT_COMMIT=unknown
ARG PRODUCT_VERSION=0.0.0
LABEL org.opencontainers.image.revision="${GIT_COMMIT}"
LABEL org.opencontainers.image.version="${PRODUCT_VERSION}"
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
RUN printf '{"version":"%s","revision":"%s"}\n' "$PRODUCT_VERSION" "$GIT_COMMIT" > /usr/share/nginx/html/build-metadata.json
EXPOSE 8080
