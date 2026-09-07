# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## v7.3.0 - 2026-09-07

### Added
- **Binary sends (`ArrayBuffer`/`TypedArray`/`Blob`) now work on any v4
  channel, not just the primary.** A raw binary WS frame carries no room for
  a `system::channel` tag, so v7.2.0's fix still only reached the primary
  channel of a multiplexed connection — a secondary channel's `send()`
  silently ended up on the wrong channel at the receiving end. Binary sent
  on a secondary channel is now base64-encoded and sent as a JSON text frame
  instead (tagged with `system::channel`, same as any other secondary-channel
  message), and the receiving SDK transparently decodes it back into an
  `ArrayBuffer` before dispatching to `channel.listen('system::binary', ...)`
  — app code sees no difference between a primary-channel binary frame and a
  secondary-channel one. The primary channel keeps sending raw bytes, since
  that path has no ambiguity and no base64 overhead.

## v7.2.0 - 2026-09-07

### Fixed
- **Sending binary data (`ArrayBuffer`/`TypedArray`/`Blob`) on a v4 channel
  was silently broken.** `Connection#send` checked `typeof data === 'object'`
  before checking for a binary payload — true for `ArrayBuffer` too — so it
  ran `JSON.stringify()` on the buffer (producing `"{}"`) instead of sending
  the actual bytes. Binary sends now bypass the JSON path entirely and go
  straight to the socket, same as v3. Only meaningful on the primary channel
  of a multiplexed connection — the server has no way to stamp a
  `system::channel` tag onto raw bytes, so it attributes an inbound binary
  frame to the connection's primary channel regardless of which channel sent
  it.

## v7.1.0 - 2026-09-05

### Changed
- **`portal: true` no longer attaches PieRTC under `version: 4`** (it did in
  v7.0.0). Use `pieRTC: true` instead (`video: true`/`audio: true` still work
  as before). v3's `Portal` and its `portal: true` flag are unaffected.

### Fixed
- A plain (non-PieRTC) subscriber sharing a channel name with a PieRTC room
  no longer crashes on the room's `rtc::*` signalling frames — `Channel`'s
  `rtc::*` handlers are now guarded on `this.pieRTC` being attached, the same
  way v3's `system:portal_*` handlers are guarded on `this.portal`.
- Re-subscribing to an already-open v4 channel with `{video: true}` (etc.)
  used to silently return the existing channel without a `.pieRTC` attached;
  it now logs a warning instead of failing silently. This does not
  retroactively attach PieRTC — `unsubscribe()` first if you need to change
  room options.
- e2e Puppeteer tests (`test/e2e/*`) failed to launch Chromium on Linux CI
  (`No usable sandbox!`) — added `--no-sandbox`/`--disable-setuid-sandbox`
  launch args. `examples/chatroom.html` also pointed its e2e test at a local
  `localhost:4001` backend that isn't part of CI; switched it to the same
  reachable `demo` cluster `videoroom.html` uses.
- CI matrix dropped Node 14.x/16.x (both EOL, and incompatible with
  `.npmrc`'s `NODE_OPTIONS=--openssl-legacy-provider`, which only exists on
  Node 17+ — `npm ci` failed outright on those two before any tests ran) in
  favor of 18.x/20.x/22.x.

### Known limitation
- `notifySelf` is connection-wide under v4, not per-channel: if a PieRTC
  room's `subscribe()` call is the one that opens the shared socket, every
  other channel multiplexed onto it also gets `notifySelf` forced on. See
  the README's PieRTC notes.

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
