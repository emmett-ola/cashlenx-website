# CashLenX Website

Single-page documentation scaffold for CashLenX product, landscape, roadmap, API, and developer workflow content.

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
container port `8080`. The default host port is `8081` so it can run beside the
Flutter web container.

```bash
cp .env.sample .env
scripts/build.sh
scripts/start.sh
```

`build.sh` builds the image. `start.sh` updates the container without running
`docker compose down` and then waits for the HTTP health check. Use
`scripts/health.sh` to check it independently. Set `WEBSITE_PORT` in `.env` or
`WEBSITE_HEALTH_URL` in the shell when the service is checked through a reverse
proxy.

## Content

The first scaffold keeps content in `src/App.tsx` so the structure is easy to revise while the documentation source of truth is still settling. Later, the arrays can be replaced with MDX, generated OpenAPI summaries, or content loaded from the CashLenX server docs.
