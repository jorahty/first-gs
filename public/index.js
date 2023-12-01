connectButton.onclick = () => {
  const socket = io();

  connectButton.disabled = true;

  socket.on('size', (size) => (p.textContent = size));
};
