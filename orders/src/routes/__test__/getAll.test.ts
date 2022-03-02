import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const createTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  return ticket;
};

describe('Route GET all the orders', () => {
  it('can fetch a list of orders', async () => {
    const cookie1 = global.signin();
    const cookie2 = global.signin();

    const ticket1 = await createTicket();
    const ticket2 = await createTicket();
    const ticket3 = await createTicket();

    const { body: order1 } = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie1)
      .send({ ticketId: ticket1.id })
      .expect(201);

    const { body: order2 } = await request(app)
      .post('/api/orders')
      .set('Cookie', cookie1)
      .send({ ticketId: ticket2.id })
      .expect(201);

    await request(app)
      .post('/api/orders')
      .set('Cookie', cookie2)
      .send({ ticketId: ticket3.id })
      .expect(201);

    const response = await request(app)
      .get(`/api/orders`)
      .set('Cookie', cookie1)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(order1.id);
    expect(response.body[1].id).toEqual(order2.id);
    expect(response.body[0].ticket.id).toEqual(ticket1.id);
    expect(response.body[1].ticket.id).toEqual(ticket2.id);
  });
});
