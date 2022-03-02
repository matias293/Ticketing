import { OrderStatus } from '@mmticketing-course/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';

describe('Create Payments test', () => {
  it('return a 404 when purchasing an order does not exist', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({ token: 'asdasdasd', orderId })
      .expect(404);
  });

  it('return a 401 when  purchasing an order belong to the user', async () => {
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      version: 0,
      userId: new mongoose.Types.ObjectId().toHexString(),
      price: 200,
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({ orderId: order.id, token: 'asdasdasd' })
      .expect(401);
  });

  it('return a 400 when purchasing an order with status cancelled', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId,
      status: OrderStatus.Created,
      version: 0,
      price: 200,
    });

    await order.save();

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({ orderId: order.id, token: 'asdasdasd' })
      .expect(400);
  });

  it('return a 201 whit valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId,
      status: OrderStatus.Created,
      version: 0,
      price,
    });
    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(userId))
      .send({ orderId: order.id, token: 'tok_visa' })
      .expect(201);

    const stripeCharges = await stripe.charges.list({ limit: 50 });

    const stripeCharge = stripeCharges.data.find((charge) => {
      return charge.amount === price * 100;
    });

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');

    const payment = await Payment.findOne({
      orderId: order.id,
      stripeId: stripeCharge!.id,
    });
    expect(payment).not.toBeNull();
  });
});
