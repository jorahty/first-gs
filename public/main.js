// const socketEndpoint = 'http://localhost:4000';

const socket = io();

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Body = Matter.Body,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 850,
    hasBounds: true,
  },
});

// set zoom
const zoom = 500;
Render.lookAt(render, {
  min: { x: -zoom, y: -zoom },
  max: { x: zoom, y: zoom },
});

// create bodies
const leftPlayer = Bodies.rectangle(-200, 0, 40, 80, { restitution: 0.4 });
const rightPlayer = Bodies.rectangle(200, 0, 40, 80, { restitution: 0.4 });
const ball = Bodies.circle(-180, -100, 40, { restitution: 0.8, mass: 0.1 });

// add bodies to world
Composite.add(engine.world, [leftPlayer, rightPlayer, ball]);

socket.on('move', (poses) => {
  Body.setPosition(leftPlayer, { x: poses[0], y: poses[1] });
  Body.setAngle(leftPlayer, poses[2]);
  Body.setPosition(rightPlayer, { x: poses[3], y: poses[4] });
  Body.setAngle(rightPlayer, poses[5]);
  Body.setPosition(ball, { x: poses[6], y: poses[7] });
  Body.setAngle(ball, poses[8]);
  Render.world(render);
});
