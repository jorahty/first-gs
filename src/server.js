const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const AgonesSDK = require('@google-cloud/agones-sdk');

// Send health ping every 2s
setInterval(() => {
  // agonesSDK.health();
  console.log('Health ping sent');
}, 2000);

// Handle client connection
io.on('connection', (socket) => {
  console.log('A user connected');
});

module.exports = server;
