const { Server } = require('socket.io');
const AgonesSDK = require('@google-cloud/agones-sdk');
const Set = require('./set');

const connect = async (server) => {
  const io = new Server(server);

  const socketSet = new Set();

  // Create instance of Agones Game Server Client SDK
  const agonesSDK = new AgonesSDK();

  // Connect to the SDK server
  console.log(`Connecting to the SDK server...`);
  // await agonesSDK.connect();
  console.log('Connected to SDK server!');

  // Send health ping every 2s
  setInterval(() => {
    // agonesSDK.health();
    console.log('Health ping sent');
  }, 2000);

  console.log('Marking server as ready...');
  // await agonesSDK.ready();

  // Handle client connection
  io.on('connection', (socket) => {
    socketSet.add(socket);

    socket.on('disconnect', () => {
      socketSet.remove(socket);
    });
  });

  // broadcast 'size' to all connected clients
  setInterval(() => {
    io.emit('size', socketSet.size);
  }, 1000);
};

module.exports = connect;
