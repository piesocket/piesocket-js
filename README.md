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

Initialize the PieSocket class:
```javascript
var piesocket = new PieSocket({
    cluster_id: 'YOUR_CLUSTER_ID',
    api_key: 'YOUR_API_KEY',
    consoleLogs: false  
});
```



Subscribe to a channel:
```javascript
var channel = piesocket.subscribe(channelId); //channelId = any integere b/w 1-100000
```


Listen to message event:
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
  

Documentation: [PieSocket WebSocket docs](https://piesocket.com/docs)