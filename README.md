# PieSocket JavaScript Client

A JavaScript Library for PieSocket Channels.

[PieSocket Channels](https://www.piesocket.com/blog/channels/) are a medium for clients and servers to communicate in real-time. Client-to-client communication is also supported.

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

## Subscribe on frontend 

1. Initialize the PieSocket class:
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
channel.on("open", ()=>{
  console.log("PieSocket Channel Connected!");
});
```


3. Listen to message event:
```javascript
channel.on('message', function(msg){
    console.log(msg);
});
```

Following are other supported events:
  - `open`
  - `message`
  - `error`
  - `close`

## Publish from server
Use the following POST request to publish a message from your server.

```
POST /api/publish HTTP/1.1
Host: CLUSTER_ID.piesocket.com
Content-Type: application/json
Content-Length: 188

{
    "key": "API_KEY",
    "secret": "API_SECRET",
    "channelId": "CHANNEL_ID",
    "message": "Hello world!"
}
```


## Client to client communication
You can enable `C2C` communication for your API key from your PieSocket account and then use the `send` method of the Channel object to send messages directly from a client.
```javascript
channel.send(payload);
```

`payload` can be a string or json.



## Supported Methods
List of available methods on the PieSocket object

| Method                | Description                                     | Returns  |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------- |
| subscribe(channelId)    | Subscribe to a channel                       |  Channel Object |
| unsubscribe(channelId)  | Un-subscribe from a channel                  |  Boolean |
| getConnections()        | Get list of all active connections/channels for this client | Object |




## Configuration
Complete list of allowed configuration options

| Option                | Description                                     | Default  |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------- |
| apiKey             | Your PieSocket API key                |  Demo key |
| clusterId          | Your API key's cluster ID                       |  `demo` |
| consoleLogs        | Logs useful connection info if set to `true`                       |  `false` |
| notifySelf        | Receive messages sent by self                        |  `true` |

  
## Development
- Clone the repo `git clone git@github.com:piesocket/piesocket-js.git`
- Run `npm install`
- Run `npm start`
- Open `http://localhost:8080/examples/`

Now you can interactively test the SDK and find sample codes.


Documentation: [PieSocket WebSocket docs](https://piesocket.com/docs)