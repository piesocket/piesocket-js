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
var channel = piesocket.subscribe(channelId); //channelId = any integere b/w 1-100000
```


Listen to message event
```javascript
channel.on('message', function(msg){
    console.log(msg);
});
```

Following are the supported events:
  - `message`
  - `close`
  - `error`
  

For a full list of supported events and properties, refer to [this guide](https://piesocke.com/websocket)