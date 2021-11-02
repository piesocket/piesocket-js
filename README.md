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
channel.listen('event-name', function(data){
    console.log(`event-name published with data: ${data}`);
});
```
or, Listen to all events:
```javascript
channel.listen('*', function(event, data){
    console.log(`${event} published with data: ${data}`);
});
```

4. Listen to lifecycle events
```javascript
channel.on('open', function(event){
    console.log("PieSocket connected!");
});
```

Following life-cycle events are available:
  - `open`
  - `message`
  - `error`
  - `close`

## Publish Events From Browser

You can publish messages directly from the client. Enable `C2C` (Client to client) communication for the API key from your [PieSocket account](https://www.piesocket.com/dashboard) to do the following.

```javascript
channel.publish("event-name", jsonPayload);
```

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
  "message": {"event":"new-tweet", "data":"Hello @PieSocketAPI!"}
}
```
See code examples for this request in PHP, NodeJS, Ruby, Python, Java, and Go in [PieSocket documentation](https://www.piesocket.com/docs/3.0/overview).

## Blockchain Realtime
Send 100% trustworthy messages to connected peers and maintain a proof of the message on the Ethereum Blockchain network. 

To send a message on the Blockhain
```javascript
channel.sendOnBlockchain(payload);
```
`payload` should be a string. 
You will have to sign this message using the [MetaMask](https://metamask.io/download) Ethereum Wallet.

To listen to an incoming Blockchain message.
```javascript
channel.listen("blockchain-message", function(data){
  console.log(data);
});
```

Optinally, to confirm a message on the receiver's end, to create a proof-of-acceptance on the Blockchain. Use the following method.
```javascript
channel.listen("blockchain-message", function(data){
  channel.confirmOnBlockchain(data.transaction_id);
})
```
`transactionHash` is the transaction hash received from the blockchain message sender.

To get a list of blockchain messages pending acceptance, use the [REST API](https://www.piesocket.com/docs/3.0/rest-api).

## PiSocket Methods
List of available methods on the `PieSocket` object

| Method                | Description                                     | Returns  |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------- |
| subscribe(channelId)    | Subscribe to a channel                       |  Channel Object |
| unsubscribe(channelId)  | Un-subscribe from a channel                  |  Boolean |
| getConnections()        | Get list of all active connections/channels for this client | Object |


## PiSocket Channel Methods
List of available methods on the `Channel` object

| Method                | Description                                     
| ----------------------------- | ----------------------------------------------------------------------------- 
| listen("event-name", callback)    | Listen to an event                       
| publish("event-name", jsonPayload)  | Un-subscribe from a channel                  
| on("websocket-event")        | Listen to lifecycle events on the native [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) connection
| sendOnBlockchain(payload)        | Send a Blockchain message and create a proof-of-event on the Ethereum blockchain
| confirmOnBlockchain(transaction_hash)        | Create a proof-of-witness for a Blockchain message, on receiver's end


## Configuration
Complete list of allowed configuration options

| Option                | Description                                     | Default  |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------- |
| apiKey             | Required, Your PieSocket API key                |  Demo key |
| clusterId          | Required, Your API key's cluster ID                       |  `demo` |
| consoleLogs        | Logs useful connection info if set to `true`                       |  `false` |
| notifySelf        | Receive messages sent by self, pass `0` to disabled                        |  `1` |
| jwt        | JWT authentication token, skips authentication endpoint call                        |  `null` |
| presence        | Enable presence events, pass `1` to enabled                     |  `0` |
| authEndpoint        | Authentication endpoint for private channels                     |  `/broadcasting/auth` |
| authHeaders        | Headers to include with authEndpoint call                   |  `{}` |
| forceAuth        | Force authentication on all channels                    |  `false` |
| userId        | User ID, used when `user` does not exists in JWT payload     |  `anonymous` |

  
## Development
- Clone the repo `git clone git@github.com:piesocket/piesocket-js.git`
- Run `npm install`
- Run `npm start`
- Open `http://localhost:8080/examples/`

Now you can interactively test the SDK and find sample codes.


Documentation: [PieSocket WebSocket docs](https://piesocket.com/docs)