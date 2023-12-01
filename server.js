const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Send health ping every 2s
setInterval(() => {
  agonesSDK.health();
  console.log('health ping sent');
}, 2000);

// Handle client connection
io.on('connection', (socket) => {
  console.log('a user connected');
});

const port = process.env.PORT || 7654;
server.listen(port, () => console.log(`Listening on *:${port}`));
