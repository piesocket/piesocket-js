# PieSocket Javascript Client

## Usage

Initialize the PieSocket class
```javascript
var piesocket = new PieSocket({
    cluster_id: 'YOUR_CLUSTER_ID',
    api_key: 'YOUR_API_KEY'    
});
```


Subscribe to a channel
```javascript
var channel = piesocket.subscribe(channelId); //channelId can any integere b/w 1-100000
```


Listen to messages/events
```javascript
channel.on('message', function(msg){
    console.log(msg);
});
```

Other supported events are:
  - `open`
  - `close`
  - `error`
  

For a full list of supported events and properties, refer to [this guide](https://piesocke.com/websocket)