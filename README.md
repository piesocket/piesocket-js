# PieSocket Javascript Client

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
var channel = piesocket.subscribe(channelId); //channelId = any integere b/w 1-100000
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


Listen any event:
```javascript
channel.on(event, callbackFunction);
```

## Configuration
Following is the complete list of allowed configuration options

| Option                | Description                                     | Default  |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------- |
| apiKey             | Your PieSocket API key                |  Demo key |
| clusterId          | Your API key's cluster ID                       |  `demo` |
| consoleLogs        | Logs useful connection info if set to `true`                       |  `false` |
| notifySelf        | Receive messages sent by self                        |  `true` |

  

Documentation: [PieSocket WebSocket docs](https://piesocket.com/docs)