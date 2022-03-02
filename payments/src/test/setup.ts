import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  function signin(userId?: string): string[];
}
jest.mock('../nats-wrapper');

process.env.STRIPE_KEY =
  'sk_test_51KYULtBr8JX3R4T23vKKsP4MkKxuyiB9SKTlbJgDZ0P27raeUJPff3zuAwxLrcq1qL7oyTqFEWMyfysOPQD8nLhc00pFpn6p8t';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (userId?: string) => {
  const payload = {
    id: userId || new mongoose.Types.ObjectId(),
    email: 'test2@test.com',
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};
