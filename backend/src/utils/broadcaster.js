// Module de diffusion d'événements en temps réel (Server-Sent Events)
const clients = new Set();

function addClient(res) {
  clients.add(res);
}

function removeClient(res) {
  clients.delete(res);
}

function broadcast(event, data = {}) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    try {
      client.write(payload);
    } catch (err) {
      clients.delete(client);
    }
  }
}

module.exports = {
  addClient,
  removeClient,
  broadcast
};
