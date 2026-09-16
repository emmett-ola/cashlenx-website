# Container Build Contract

`images.env` is the tracked authority for base-image references. References are
pinned by digest so clean and warm builds use the same inputs. Update one pin in
an isolated change, build and verify the candidate image, and roll back by
reverting that change.

The root build context is allowlisted by `.dockerignore`. Environment files,
credentials, Git state, dependency caches, local output, and unrelated files are
never sent to the builder.

Run `scripts/build.sh` to derive and validate the package version and full source
revision, build from `bun.lock`, and verify required runtime files, OCI labels,
public build metadata, and prohibited file absence.
