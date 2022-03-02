import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  const body = {
    title: 'Ticket',
    price: 20,
  };
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(body)
    .expect(201);
};

describe('Route GET all the tickets', () => {
  it('can fetch a list of tickets', async () => {
    await createTicket();
    await createTicket();
    await createTicket();
    const response = await request(app).get(`/api/tickets`).send().expect(200);

    expect(response.body.length).toEqual(3);
  });
});
