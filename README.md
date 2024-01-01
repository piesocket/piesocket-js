# PieSocket JavaScript Client

A JavaScript Library for PieSocket Realtime.

Note: This package is PieSocket Client SDK (to be used with frontend on browsers), if you are looking for the NodeJS Server SDK, please see [PieSocket-NodeJS](https://github.com/piesocket/piesocket-nodejs).

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
<script src="https://unpkg.com/piesocket-js@5"></script>
```

## Importing

Import module:

```javascript
import PieSocket from 'piesocket-js';
```

With CDN/Browser:


Use the `PieSocket.default` global variable, e.g. `var piesocket = new PieSocket.default({...})`


## How To Use
PieSocketJS offers Channels and Portals.

### Channels
Channels are realtime PubSub connections over WebSocket, they allow you to:

- Subscribe to events on client side
- Publish events from server
- Publish events from client with C2C feature.


See the [Channels documentation](https://www.piesocket.com/docs/3.0/channels) to learn more about how to use Channels.

### Portals
Portals are programmable video streams over WebRTC, they allow you to build powerful video applications.

See the [Portals documentation](https://www.piesocket.com/docs/3.0/portals) to learn more about how to use Portals.

## Configuration
Complete list of allowed configuration options

| Option                | Description                                     | Default  |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------- |
| apiKey             | Required, Your PieSocket API key.                |  Demo key |
| clusterId          | Your API key's cluster ID.                       |  `demo` |
| clusterDomain          | Custom domain, if you have configured one in your account.                       |  `null` |
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
| subscribe(channelId)    | Subscribe to a channel.                       |  Channel Object |
| unsubscribe(channelId)  | Un-subscribe from a channel.                  |  Boolean |
| getConnections()        | Get list of all active connections/channels for this client. | Object |


## Channel Object
List of available methods on the `Channel` object

| Method                | Description                                     
| ----------------------------- | ----------------------------------------------------------------------------- 
| listen("event-name", callback)    | Listen to an event.           
| publish("event-name", data, meta)  | Publish message from client.         
| getMemberByUUID(uuid)  | Get a Presence member from their uuid.         
| on("lifecycle-event", callback)        | Listen to lifecycle events on the native [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) connection.
| confirmOnBlockchain(event, transaction_hash)        | Create a proof-of-witness for a Blockchain message, on receiver's end.



## Development
- Clone the repo `git clone git@github.com:piesocket/piesocket-js.git`
- Run `npm install`
- Run `npm start`
- Open `http://localhost:8080` in browser

Now you can interactively test the SDK, add features and fix bugs.


Documentation: [PieSocket Realtime Docs](https://piesocket.com/docs)