import socketIO from 'socket.io';
let io;
import EventEmitter from 'events';


export const talkerUpdatesEmitter = new EventEmitter();
function handleSocketUpdates() {

}
export function startSocket(server) {
  io = socketIO(server);
  io.of('/socket.io').on('connection', socket => {
    const { address, url, query } = socket.handshake;
    console.log(
      `client connected to default namespace: ${address}:${url}:${str(query)}`,
    );
    if (query.room) {
      socket.join(query.room);
    }
  });

  talkerUpdatesEmitter.on('updates', async message => {
    try {
      console.log(`received talkerUpdates: ${message}`);
      const data = JSON.parse(message);
      await handleSocketUpdates(data);
    } catch (err) {
      console.log(`sendTakerUpdates fail: ${err.stack}`);
    }
  });
  console.log(`startTalkerUpdater finished`);
}
