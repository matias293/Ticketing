import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedEvent } from '@mmticketing-course/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  });

  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'musical',
    price: 30,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { data, listener, ticket, msg };
};

describe('Listener test', () => {
  it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });

  it('finds,updates and saves a ticket', async () => {
    const { ticket, listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(Number(updatedTicket!.price)).toEqual(data.price);
  });

  it('does not call ack if the event hasa skipeed version number', async () => {
    const { ticket, listener, data, msg } = await setup();

    data.version = 10;

    try {
      await listener.onMessage(data, msg);
    } catch (error) {
      return;
    }

    expect(msg.ack).not.toHaveBeenCalled();
  });
});
