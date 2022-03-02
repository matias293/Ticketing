import nats from 'node-nats-streaming';
import { resolve } from 'path/posix';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('publisher connected to nats');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: 'adfas',
      title: 'concert',
      price: 20,
    });
  } catch (error) {
    console.error(error);
  }
});
