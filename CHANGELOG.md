# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## v7.1.0 - 2026-09-05

### Changed
- **`portal: true` no longer attaches PieRTC under `version: 4`** (it did in
  v7.0.0). Use `piertc: true` instead (`video: true`/`audio: true` still work
  as before). v3's `Portal` and its `portal: true` flag are unaffected.

## v7.0.0 - 2026-09-05

### Added
- **PieRTC** — the v4 counterpart to Portal (now called PieRTC): programmable WebRTC video/audio
  rooms that ride v4's shared multiplexed connection instead of a dedicated
  per-room socket. Signalling uses its own `rtc::` event namespace, kept
  separate from both v3's `system:` and v4's `system::` control-frame
  conventions. `subscribe(channel, {video: true})` (or `audio`/`portal`)
  under `version: 4` now attaches a `.pieRTC` instance to the returned
  channel; v3's `Portal` is unchanged.
- `scripts/sync-version.js`, wired into `npm run prepare`: keeps
  `SDK_VERSION` in `src/PieSocket.js` in sync with `package.json`, prompting
  interactively to bump the version when run in a TTY.

## [6.1.0] - 2026-09-05

### Added
- v4 multi-channel subscription: a single shared WebSocket
  (`src/Connection.js`) serves every `subscribe()` call under
  `version: 4`, each still returning its own `Channel` handle.
- Delta-based presence for v4: the full roster arrives once as
  `system::member_list`; `system::member_joined`/`member_left` carry only
  the member that changed. `channel.refreshMembers()` re-syncs on demand.
- Binary-by-default framing for v4: any binary frame is delivered as a
  `system::binary` event, no `?binary=1` opt-in required.

## [6.0.0] - 2026-09-05

### Added
- Initial v4 protocol support on the client.

[Unreleased]: https://github.com/piesocket/piesocket-js/compare/v6.1.0...HEAD
[6.1.0]: https://github.com/piesocket/piesocket-js/compare/v6.0.0...v6.1.0
[6.0.0]: https://github.com/piesocket/piesocket-js/releases/tag/v6.0.0
