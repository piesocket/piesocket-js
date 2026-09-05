# PieSocket JavaScript Client

A JavaScript Library for PieSocket Realtime.

Note: This package is PieSocket Client SDK (to be used with frontend on browsers), if you are looking for the NodeJS Server SDK, please see [PieSocket-NodeJS](https://github.com/piesocket/piesocket-nodejs).

See [CHANGELOG.md](CHANGELOG.md) for release notes.

## Installation

Yarn
```
yarn add piesocket-js
```

NPM
```
npm i piesocket-js
```

CDN
```html
<script src="https://unpkg.com/piesocket-js@7"></script>
```

## Importing

Import module:

```javascript
import PieSocket from 'piesocket-js';
```

With CDN/Browser:


Use the `PieSocket.default` global variable, e.g. `var piesocket = new PieSocket.default({...})`


## How To Use
PieSocketJS offers Channels, Portals (v3) and PieRTC (v4).

### Channels
Channels are realtime PubSub connections over WebSocket, they allow you to:

- Subscribe to events on client side
- Publish events from server
- Publish events from client with C2C feature.


See the [Channels documentation](https://www.piesocket.com/docs/3.0/channels) to learn more about how to use Channels.

#### v4 — multi-channel over one connection

Pass `version: 4` to share a **single** WebSocket across every `subscribe()`
call. Each `subscribe()` still returns a `Channel` with the same
`listen` / `publish` / member API — the multiplexing is transparent:

```javascript
const piesocket = new PieSocket({ version: 4, clusterId: 'xxxxx', apiKey: 'yyyyy' });

const chat   = await piesocket.subscribe('chat-room');   // opens the socket
const alerts = await piesocket.subscribe('alerts');      // rides the same socket

chat.listen('message', (data) => { /* ... */ });
alerts.publish('ping', { at: Date.now() });
```

Notes for v4:

- **Presence is delta-based.** The full roster arrives once; after that
  `Channel.members` is kept in sync from join/leave deltas. Call
  `channel.refreshMembers()` to re-sync from the server on demand.
- **Binary needs no opt-in.** Any binary frame is delivered as a
  `system::binary` event (an `ArrayBuffer`). Note the double colon — all v4
  system events (`system::member_joined`, `system::binary`, etc.) use it,
  unlike v3's single-colon `system:` events.
- **Unsubscribing the connect-time channel** promotes another subscribed
  channel to keep the connection alive; a few in-flight frames may be missed
  during the swap.
- **Video/audio rooms** (`subscribe(channel, {video: true})` etc.) ride the
  same shared connection as everything else under `version: 4` — see
  [PieRTC](#piertc-v4) below.

### Portals
Portals are programmable video streams over WebRTC (v3), they allow you to build powerful video applications.

See the [Portals documentation](https://www.piesocket.com/docs/3.0/portals) to learn more about how to use Portals.

### PieRTC (v4)
PieRTC is the v4 counterpart to Portals: the same programmable WebRTC video/audio
rooms, but multiplexed onto v4's shared connection instead of a dedicated socket
per room.

```javascript
const piesocket = new PieSocket({ version: 4, notifySelf: true, clusterId: 'xxxxx', apiKey: 'yyyyy' });

const room = await piesocket.subscribe('video-room', {
  video: true,
  onLocalVideo: (stream) => { /* attach to a <video> element */ },
  onParticipantJoined: (uuid, stream) => { /* attach remote stream */ },
  onParticipantLeft: (uuid) => { /* remove remote stream */ },
});
```

Notes:

- Pass `video: true`, `audio: true`, or `pieRTC: true` in `subscribe()`'s
  second argument to mark a room as a PieRTC room — the channel is attached a
  `.pieRTC` instance once subscribed. Note this is `pieRTC`, not v3 Portal's
  `portal` — under `version: 4`, `portal: true` alone will not attach PieRTC.
- Signalling frames use their own `rtc::` namespace (`rtc::offer`,
  `rtc::answer`, `rtc::candidate`, etc.) — separate from both v3's `system:`
  and v4's `system::` conventions, so they're never mistaken for control
  frames.
- **Set `notifySelf: true`** on the `PieSocket` constructor if this is the
  first `subscribe()` call (it opens the shared connection) — PieRTC relies
  on it the same way v3 Portals do. If a PieRTC room is subscribed onto a
  socket that's already open without it, a console warning is logged since
  it can't be changed after the fact.
- **`notifySelf` is connection-wide under v4, not per-channel.** If a PieRTC
  room's `subscribe()` call is the one that opens the shared socket, every
  *other* channel multiplexed onto that same socket also gets `notifySelf`
  forced on — v4 has no per-channel override for it. If you need a plain
  channel with `notifySelf` off alongside a PieRTC room, `subscribe()` the
  plain channel first so it opens the primary connection.
- **Re-subscribing to an already-open channel does not retroactively attach
  PieRTC.** `subscribe('room', {video: true})` only attaches `.pieRTC` the
  first time a channel is subscribed — a later `subscribe('room', {video:
  true})` call for the same channel ID just returns the existing (non-PieRTC)
  channel handle, with a console warning. `unsubscribe()` first if you need
  to turn a plain channel into a PieRTC room.

## Configuration
Complete list of allowed configuration options

| Option                | Description                                     | Default  |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------- |
| apiKey             | Required, Your PieSocket API key.                |  Demo key |
| version            | Protocol version. Set to `4` for multi-channel multiplexing over one connection. |  `3` |
| clusterId          | Your API key's cluster ID.                       |  `demo` |
| clusterDomain          | For self hosted endpoints (localhost:4001) or custom domains in managed Piesocket                     |  `null` |
| ssl          |  Set to `false` to use ws:// protocol, useful for self-hosted servers                    |  `true` |
| consoleLogs        | Logs useful connection info if set to `true`.                       |  `false` |
| notifySelf        | Receive messages sent by self, pass `0` to disabled.                        |  `1` |
| jwt        | JWT authentication token, skips authentication endpoint call.                        |  `null` |
| presence        | Enable presence events on any channel, pass `1` to enabled.                     |  `0` |
| authEndpoint        | Authentication endpoint for private channels.                     |  `/broadcasting/auth` |
| authHeaders        | Headers to include with authEndpoint call.                   |  `{}` |
| forceAuth        | Force authentication on all channels.                    |  `false` |
| userId        | User ID, used when `user` does not exists in JWT payload.     |  `anonymous` |
| blockchainTestMode        | Enable/disable test mode, defaults to `false` i.e., Ethereum main network. Set to `true` for Rinkeby test network.     |  `false` |
| blockchainGasFee        | Gas fee to set on Ethereum contract calls     |  `41000` |


## PieSocket Object
List of available methods on the `PieSocket` object

| Method                | Description                                     | Returns  |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------- |
| subscribe(channelId, roomOptions)    | Subscribe to a channel. Pass `{video: true}`, `{audio: true}`, or `{portal: true}` (v3) / `{pieRTC: true}` (v4) in `roomOptions` for a WebRTC room. |  Channel Object |
| unsubscribe(channelId)  | Un-subscribe from a channel.                  |  Boolean |
| getConnections()        | Get list of all active connections/channels for this client. | Object |


## Channel Object
List of available methods on the `Channel` object

| Method                | Description                                     
| ----------------------------- | ----------------------------------------------------------------------------- 
| listen("event-name", callback)    | Listen to an event.           
| publish("event-name", data, meta)  | Publish message from client.         
| getMemberByUUID(uuid)  | Get a Presence member from their uuid.         
| refreshMembers()  | (v4) Re-sync the presence roster from the server. Returns a Promise of the member list.         
| .portal / .pieRTC  | Set on a WebRTC room channel — `.portal` under v3, `.pieRTC` under v4. See [Portals](#portals) / [PieRTC](#piertc-v4).         
| on("lifecycle-event", callback)        | Listen to lifecycle events on the native [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) connection.
| confirmOnBlockchain(event, transaction_hash)        | Create a proof-of-witness for a Blockchain message, on receiver's end.



## Development
- Clone the repo `git clone git@github.com:piesocket/piesocket-js.git`
- Run `npm install`
- Run `npm start`
- Open `http://localhost:8080` in browser

Now you can interactively test the SDK, add features and fix bugs.


Documentation: [PieSocket Realtime Docs](https://piesocket.com/docs)