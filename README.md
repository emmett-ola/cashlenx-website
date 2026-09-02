# CashLenX Website

Single-page product-introduction website for CashLenX product, landscape, roadmap, API, and developer workflow content.

## Tech Stack

- Vite
- React
- TypeScript
- lucide-react icons

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Docker Deployment

The production container builds the Vite site and serves it with nginx on
container port `8080`. The default host port is `11065` so it can run beside the
Flutter web container.

```bash
cp .env.example .env
scripts/build.sh
scripts/start.sh
scripts/stop.sh
```

Every assignment in `.env.example` is active. Change values directly; no
configuration is enabled by uncommenting a line.

`build.sh` compiles the Vite site and builds its image. `start.sh` starts or
updates the container from that existing image without rebuilding and waits on
an in-container HTTP readiness probe. It does not require Compose `up --wait`
or Compose-managed health status. `stop.sh` removes the project container while
preserving built images and persistent volumes. It removes the shared network
only when no CashLenX container remains attached.

All three scripts require `.env` by default. Select another repository-local
file consistently with `ENV_FILE=.env.testing scripts/build.sh`,
`scripts/start.sh`, and `scripts/stop.sh`. Missing files, repository-external
paths, and active `CHANGE_ME` values on startup are rejected. `.env` may be a
symbolic link to a repository-local `.env.local`, `.env.testing`, or
`.env.production`; links resolving outside the repository are rejected.

Published ports bind to `127.0.0.1` by default. `.env.example` explicitly sets
CPU, memory, PID, graceful-stop, health-check, and build-image values. The image
records the source revision in the OCI `org.opencontainers.image.revision`
label.

The default container name is `cashlenx-website`.

Compose reads `docker/compose.yml` and builds from `docker/Dockerfile`. The
default project, container, and shared-network names are `cashlenx-website`,
`cashlenx-website`, and `cashlenx-network`. Configure them explicitly with
`WEBSITE_PROJECT_NAME`, `WEBSITE_CONTAINER_NAME`, and `DOCKER_NETWORK_NAME`.
`start.sh` creates the external network when needed; keep its absolute name
identical in every CashLenX environment file.

## Content

The first scaffold keeps content in `src/App.tsx` so the structure is easy to revise while the documentation source of truth is still settling. Later, the arrays can be replaced with MDX, generated OpenAPI summaries, or content loaded from the CashLenX server docs.
