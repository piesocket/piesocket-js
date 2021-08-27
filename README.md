# PieSocket JavaScript Client

A JavaScript Library for PieSocket Channels.

[PieSocket Channels](https://www.piesocket.com/blog/channels/) are a medium for clients and a server to communicate in real-time. Unlike, other platforms such as Pusher, we also provide the client-to-client communication ability with PieSocket Channels.


## Setting up demo 
- Clone the repo `git clone git@github.com:piesocket/piesocket-js.git`
- Run `npm install`
- Run `npm start`
- Open `http://localhost:8080/examples/`

Now you can interactively test the SDK and find sample codes.

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
<script src="https://unpkg.com/piesocket-js"></script>
```

## Importing

Import module:

```javascript
const PieSocket = require('piesocket-js');
```

With ES6:
```javascript
import PieSocket from 'piesocket-js';
```

With CDN/Browser:


Use the `PieSocket` global variable

## Usage 

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
```


3. Listen to message event:
```javascript
channel.on('message', function(msg){
    console.log(msg);
});
```

Following are the supported events:
  - `open`
  - `message`
  - `error`
  - `close`


Listen to any event:
```javascript
channel.on(event, callbackFunction);
```

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

  

Documentation: [PieSocket WebSocket docs](https://piesocket.com/docs)