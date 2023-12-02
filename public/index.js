connectButton.onclick = () => {
  const socket = io();

  connectButton.disabled = true;

  socket.on('size', (size) => (p.textContent = size));

  exitButton.disabled = false;
  exitButton.onclick = () => {
    socket.emit('exit');
    exitButton.disabled = true;
  };
};
