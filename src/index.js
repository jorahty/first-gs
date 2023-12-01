const server = require('./server');

const port = process.env.PORT || 7654;
server.listen(port, () => console.log(`Listening on *:${port}`));
