const { Server } = require('socket.io');
const AgonesSDK = require('@google-cloud/agones-sdk');
const Matter = require('matter-js');
const Set = require('./set');

// module aliases
const Engine = Matter.Engine,
  Events = Matter.Events,
  Runner = Matter.Runner,
  Body = Matter.Body,
  Bodies = Matter.Bodies,
  Common = Matter.Common,
  Vertices = Matter.Vertices,
  Composite = Matter.Composite;

// provide concave decomposition support library
Common.setDecomp(require('poly-decomp'));

const connect = async (server) => {
  const io = new Server(server);

  const socketSet = new Set();

  // Create instance of Agones Game Server Client SDK
  const agonesSDK = new AgonesSDK();

  // Connect to the SDK server
  console.log(`Connecting to the SDK server...`);
  await agonesSDK.connect();
  console.log('Connected to SDK server!');

  // Send health ping every 20s
  setInterval(() => {
    agonesSDK.health();
    console.log('Health ping sent');
  }, 20000);

  // setup engine and world
  const engine = Engine.create();
  engine.gravity.scale *= 0.6;
  const runner = Runner.create();
  Runner.run(runner, engine);

  // create bodies
  const vertexString =
    '1740 997 1595 1142 442 1142 297 997 297 841 118 841 118 605 297 605 297 165 1008 165 1008 1 1 1 1 1377 2008 1377 2008 1 1028 1 1028 165 1740 165 1740 605 1918 605 1918 841 1740 841';
  const arena = Bodies.fromVertices(0, 0, Vertices.fromPath(vertexString), {
    isStatic: true,
    friction: 0.01,
  });
  const leftPlayer = Bodies.rectangle(-200, 0, 40, 80, {
    restitution: 0.5,
    friction: 0.02,
  });
  const rightPlayer = Bodies.rectangle(200, 0, 40, 80, {
    restitution: 0.5,
    friction: 0.02,
  });
  const ball = Bodies.circle(-180, -100, 40, { restitution: 0.8, mass: 0.3 });

  // add bodies to world
  Composite.add(engine.world, [arena, leftPlayer, rightPlayer, ball]);

  console.log('Marking server as ready...');
  await agonesSDK.ready();

  // broadcast movement
  setInterval(() => {
    io.volatile.emit(
      'move',
      [
        leftPlayer.position.x,
        leftPlayer.position.y,
        leftPlayer.angle,
        rightPlayer.position.x,
        rightPlayer.position.y,
        rightPlayer.angle,
        ball.position.x,
        ball.position.y,
        ball.angle,
      ].map((n) => Math.round(n * 100) / 100)
    );
  }, 1000 / 60);

  let playerLeftIsTaken = false;
  const boostStrength = 0.003;

  // Handle client connection
  io.on('connection', (socket) => {
    socketSet.add(socket);

    let player;

    if (playerLeftIsTaken == false) {
      player = leftPlayer;
      playerLeftIsTaken = true;
    } else {
      player = rightPlayer;
    }

    const side = player === leftPlayer ? 'left' : 'right';
    socket.emit('side', side);

    socket.on('b', () => (player.isBoosting = true));
    socket.on('B', () => (player.isBoosting = false));

    const movePlayer = () => {
      if (player.isBoosting)
        player.force = {
          x: boostStrength * Math.sin(player.angle),
          y: -boostStrength * Math.cos(player.angle),
        };
    };

    Events.on(engine, 'beforeUpdate', movePlayer);

    socket.on('r', (angle) => {
      Body.setAngularVelocity(player, 0);
      Body.setAngle(player, player.angle - angle);
    });

    socket.on('a', (angle) => {
      Body.setAngularVelocity(player, 0);
      Body.setAngle(player, angle);
    });

    socket.on('disconnect', () => {
      if (player === leftPlayer) playerLeftIsTaken = false;
      Events.off(engine, 'beforeUpdate', movePlayer);
      socketSet.remove(socket);
    });
  });
};

module.exports = connect;
