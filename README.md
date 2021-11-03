# PieSocket JavaScript Client

A JavaScript Library for PieSocket Channels.

[PieSocket Channels](https://www.piesocket.com/blog/channels/) are a medium for clients and servers to communicate in real-time. Client-to-client communications are also supported.

Note: This package is for client-side subscribing, if you are looking for the package to use on the server-side for publishing, please see [PieSocket-NodeJS](https://github.com/piesocket/piesocket-nodejs).
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
<script src="https://unpkg.com/piesocket-js@1"></script>
```

## Importing

Import module:

```javascript
import PieSocket from 'piesocket-js';
```

With CDN/Browser:


Use the `PieSocket` global variable

## Subscribe On Frontend 

1. Initialize PieSocket:
```javascript
var piesocket = new PieSocket({
    clusterId: 'YOUR_CLUSTER_ID',
    apiKey: 'YOUR_API_KEY'
});
```

Reference: [Complete list of configuration options](https://github.com/piesocket/piesocket-js#configuration)


2. Subscribe to a channel:
```javascript
var channel = piesocket.subscribe(channelId); 
```


3. Listen to an event:
```javascript
channel.listen('event-name', function(data, meta){
    console.log("event-name received: ", data, meta);
});
```

or, Listen to all events:
```javascript
channel.listen('*', function(event, data, meta){
    console.log(`${event} received: `, data, meta);
});
```

4. Listen to lifecycle events
```javascript
channel.on('open', function(event){
    console.log("PieSocket connected!");
});
```

Following life-cycle events are available:
  - `open`: Fired when WebSocket connect is established.
  - `message`: Fired when WebSocket message is received.
  - `error`: Fired when WebSocket connection errors occur.
  - `close`: Fired when WebSocket connection is closed.
  - `blockchain-error`: Fired when Blockchain errors occur.
  - `blockchain-hash`:  Fired when Blockchain contract's transaction hash is available.

## Publish Events From Browser

You can publish messages directly from the client. Enable `C2C` (Client to client) communication for the API key from your [PieSocket account](https://www.piesocket.com/dashboard) to do the following.

```javascript
channel.publish("event-name", data, meta);
```

Parameters:
- `data`: JSON data for the event.
- `meta`: Optional information about the event in JSON format.

Make sure to call the `publish` method after connection has been made i.e `on('open', callback)` has been called.

## Publish Events From Server
Use the following POST request to publish a message from your server.

```
POST /api/publish HTTP/1.1
Host: CLUSTER_ID.piesocket.com
Content-Type: application/json

{
  "key": "API_KEY",
  "secret": "API_SECRET",
  "channelId": "CHANNEL_ID",
  "message": { "event": "new-tweet", "data": { "text": "Hello @PieSocketAPI!" }, "meta": { "user": 143 } }
}
```
See code examples for this request in PHP, NodeJS, Ruby, Python, Java, and Go in [PieSocket documentation](https://www.piesocket.com/docs/3.0/overview).

## Blockchain Realtime
Send 100% trustworthy messages to connected peers and maintain a proof of the message on the Ethereum Blockchain network. 

To send a message on the Blockhain
```javascript
channel.publish("event-name", data, {
  blockchain: true
});
```
`payload` should be a string. 
User will have to sign this message using the [MetaMask](https://metamask.io/download) Ethereum Wallet.

Optinally, to confirm a message on the receiver's end, to create a proof-of-acceptance on the Blockchain. Use the following method.
```javascript
channel.listen("event-name", function(data, meta){
  if(meta && meta.blockchain && meta.transaction_hash){
    //This is blockchain message, accept the contract on Ethereum blockchain.
    channel.confirmOnBlockchain("blockchain-confirmation", meta.transaction_hash);
  }
})
```
`meta.transaction_hash` is the transaction hash for the initial blockchain message.

Above code emits an event `blockchain-confirmation` with the confirmation contract's transaction hash in `meta`.

To get a list of blockchain messages pending acceptance, use the [REST API](https://www.piesocket.com/docs/3.0/rest-api).

## PieSocket Methods
List of available methods on the `PieSocket` object

| Method                | Description                                     | Returns  |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------- |
| subscribe(channelId)    | Subscribe to a channel.                       |  Channel Object |
| unsubscribe(channelId)  | Un-subscribe from a channel.                  |  Boolean |
| getConnections()        | Get list of all active connections/channels for this client. | Object |


## PieSocket Channel Methods
List of available methods on the `Channel` object

| Method                | Description                                     
| ----------------------------- | ----------------------------------------------------------------------------- 
| listen("event-name", callback)    | Listen to an event.           
| publish("event-name", data, meta)  | Publish message from client.         
| on("lifecycle-event", callback)        | Listen to lifecycle events on the native [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) connection.
| confirmOnBlockchain(event, transaction_hash)        | Create a proof-of-witness for a Blockchain message, on receiver's end.


## Configuration
Complete list of allowed configuration options

| Option                | Description                                     | Default  |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------- |
| apiKey             | Required, Your PieSocket API key.                |  Demo key |
| clusterId          | Required, Your API key's cluster ID.                       |  `demo` |
| consoleLogs        | Logs useful connection info if set to `true`.                       |  `false` |
| notifySelf        | Receive messages sent by self, pass `0` to disabled.                        |  `1` |
| jwt        | JWT authentication token, skips authentication endpoint call.                        |  `null` |
| presence        | Enable presence events on any channel, pass `1` to enabled.                     |  `0` |
| authEndpoint        | Authentication endpoint for private channels.                     |  `/broadcasting/auth` |
| authHeaders        | Headers to include with authEndpoint call.                   |  `{}` |
| forceAuth        | Force authentication on all channels.                    |  `false` |
| userId        | User ID, used when `user` does not exists in JWT payload.     |  `anonymous` |
| blockchainTestMode        | Enable/disable test mode, defaults to `false` i.e., Ethreum main network. Set to `true` for Rinkeby test network.     |  `false` |
| blockchainGasFee        | Gas fee to set on Ethreum contract calls     |  `41000` |

  
## Development
- Clone the repo `git clone git@github.com:piesocket/piesocket-js.git`
- Run `npm install`
- Run `npm start`
- Open `http://localhost:8080/examples/`

Now you can interactively test the SDK and find sample codes.


Documentation: [PieSocket WebSocket docs](https://piesocket.com/docs)