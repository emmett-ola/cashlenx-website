# Container Build Contract

`images.env` is the tracked authority for base-image references. References are
pinned by digest so clean and warm builds use the same inputs. Update one pin in
an isolated change, build and verify the candidate image, and roll back by
reverting that change.
The same file pins Bun 1.4.0. The Dockerfile verifies that identity before a
frozen install, and CI uses the identical Bun version and sole `bun.lock` file.

The root build context is allowlisted by `.dockerignore`. Environment files,
credentials, Git state, dependency caches, local output, and unrelated files are
never sent to the builder.

Run `scripts/build.sh` to derive and validate the package version and full source
revision, build from `bun.lock`, and verify required runtime files, OCI labels,
public build metadata, and prohibited file absence.

The repository-local lifecycle helper supports Docker Compose v2 and nerdctl
2.2+, checks capabilities before mutation, and derives the image reference from
`WEBSITE_IMAGE_NAME` plus `WEBSITE_IMAGE_TAG` without `config --images`.
