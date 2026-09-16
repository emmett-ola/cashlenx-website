ARG BUN_BUILD_IMAGE=oven/bun:1-alpine@sha256:07235578f79ef8c6f97d94aee7938e76f5cdba5f21ae5dbfdd3d3d38058437eb
ARG NGINX_IMAGE=nginx:alpine@sha256:db35bfc6b2951e7f8a72db5db120288c127ffaeeb4a6d4b95a26fead017d5913

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
