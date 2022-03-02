import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

describe('Route GET by id Ticket', () => {
  it('return a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`).send().expect(404);
  });

  it('return the ticket if the ticker is found', async () => {
    const body = {
      title: 'Ticket',
      price: 20,
    };

    const respose = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send(body)
      .expect(201);

    const ticketResponse = await request(app)
      .get(`/api/tickets/${respose.body.id}`)
      .send()
      .expect(200);
    expect(ticketResponse.body.title).toEqual(body.title);
    expect(Number(ticketResponse.body.price)).toEqual(body.price);
  });
});
