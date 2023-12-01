const express = require('express');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

app.use(express.static('public'));

const connect = require('./connect');
connect(server);

const port = process.env.PORT || 7654;
server.listen(port, () => console.log(`Listening on *:${port}`));
