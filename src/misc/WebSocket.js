var socket = {};
try {
  socket = WebSocket;
} catch (e) {}
export default socket;
