# Changelog

All notable changes to the CashLenX product website are recorded here. Entries
describe website artifacts separately from deployment state.

## [Unreleased]

### Changed

- Added exact candidate image references to package metadata and made website
  container start fail instead of pulling a missing configured image.
- Made build, start, stop, verification, and image packaging portable across
  Docker Compose and nerdctl 2.2 with pre-mutation capability checks and
  configured image identity, value-safe start output, and bounded readiness.

## [1.0.0-rc.1] - 2026-09-16

### Added

- A stable `/api/v1` API reference with explicit `/api/v0` compatibility
  selection.
- Traceable container packaging with semantic version, exact source revision,
  input-set digest, image identity, and SHA-256 artifact sidecars.

### Changed

- Aligned website and embedded API examples with the coordinated v1
  release-candidate line.
