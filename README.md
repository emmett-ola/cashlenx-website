# CashLenX Website

Single-page product-introduction website for CashLenX product, landscape, roadmap, API, and developer workflow content.

## CashLenX Project

CashLenX is developed as a set of independently buildable repositories with
explicit ownership boundaries:

| Repository | Responsibility |
| --- | --- |
| [cashlenx-app](https://github.com/emmett-ola/cashlenx-app) | Cross-platform Flutter client and user experience. |
| [cashlenx-server](https://github.com/emmett-ola/cashlenx-server) | Go REST API, Cobra CLI, authentication, finance services, and MongoDB/MySQL persistence. |
| [cashlenx-design](https://github.com/emmett-ola/cashlenx-design) | Figma-exported React/Vite visual and interaction reference. |
| [cashlenx-website](https://github.com/emmett-ola/cashlenx-website) | Public product and developer-information website. |
| [cashlenx-spec](https://github.com/emmett-ola/cashlenx-spec) | Product and system facts, delivery workflow, decisions, and retained evidence. |

This repository owns the public product and developer-information website.
Cross-repository contracts are coordinated through OpenAPI and the CashLenX
Spec workflow. Runtime repositories remain independently buildable and do not
depend on the spec or design reference at build time or runtime.

## Tech Stack

- Vite
- React
- TypeScript
- lucide-react icons

## Development

```bash
bun --no-env-file install --frozen-lockfile
bun run dev
```

## Build

```bash
bun --no-env-file install --frozen-lockfile
scripts/audit-dependencies.sh
bun --no-env-file run build
```

GitHub Actions runs the same clean install and production build on `develop`,
`testing`, `main`, and pull requests targeting those branches.
`bun.lock` is the only dependency lockfile. CI and the container build both use
Bun 1.4.0 and fail if the lockfile or pinned toolchain identity drifts.
The audit wrapper also fails CI on high or critical findings even though Bun's
human-readable audit command does not itself provide a failing exit status.

## Docker Deployment

The production container builds the Vite site and serves it with nginx on
container port `8080`. The default host port is `11065` so it can run beside the
Flutter web container.

```bash
cp .env.example .env
scripts/build.sh
scripts/start.sh
scripts/status.sh
scripts/doctor.sh
scripts/logs.sh 100
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

`status.sh` reports non-secret frontend capabilities, requested and effective
image identity, network/container state, and live in-container health, and exits
nonzero for a degraded condition. `doctor.sh` emits the same facts with an
incident-friendly diagnostic marker. `logs.sh [lines]` accepts 1 to 99999 lines
(100 by default). `stop.sh` enforces the configured grace bound, distinguishes
graceful, already-stopped, forced, and failed results, and is safe to repeat.

The lifecycle supports Docker Compose v2 and nerdctl 2.2 or newer. The
`CONTAINER_FRONTEND` setting accepts `auto`, `docker`, or `nerdctl`; auto mode
detects the implementation reported by the selected command, including a
`docker` wrapper around nerdctl. `CONTAINER_CLI` is an invoking-shell override
for a nonstandard executable path. Frontend and Compose configuration checks run
before mutation, and the built image reference is derived from validated
`WEBSITE_IMAGE_NAME` and `WEBSITE_IMAGE_TAG` values rather than
`compose config --images`. Start commands suppress frontend command traces so
environment values cannot leak through nerdctl's informational output.
Start also uses `--pull never`; a controlled deployment must preload the exact
verified Website image rather than resolving a registry tag during replacement.

All lifecycle scripts require `.env` by default. Select another repository-local
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

Run `test/scripts/container-lifecycle-smoke.sh` for mutation-free Docker and
nerdctl command-shape, wrapper, symlink, and negative capability checks.

## Content

The first scaffold keeps content in `src/App.tsx` so the structure is easy to revise while the documentation source of truth is still settling. Later, the arrays can be replaced with MDX, generated OpenAPI summaries, or content loaded from the CashLenX server docs.

## Contributing And Security

- [Contribution Guide](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Shared Governance](https://github.com/emmett-ola/cashlenx-spec/blob/main/GOVERNANCE.md)
- [Shared Delivery Workflow](https://github.com/emmett-ola/cashlenx-spec/blob/main/WORKFLOW.md)

## License

This project is licensed under the [MIT License](LICENSE). Commercial use,
modification, and redistribution are permitted when the copyright and license
notices are retained.
