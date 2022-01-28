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
<script src="https://unpkg.com/piesocket-js@2"></script>
```

## Importing

Import module:

```javascript
import PieSocket from 'piesocket-js';
```

With CDN/Browser:


Use the `PieSocket` global variable


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

## Development
- Clone the repo `git clone git@github.com:piesocket/piesocket-js.git`
- Run `npm install`
- Run `npm start`
- Open `http://localhost:8080` in browser

Now you can interactively test the SDK, add features and fix bugs.


Documentation: [PieSocket Realtime Docs](https://piesocket.com/docs)