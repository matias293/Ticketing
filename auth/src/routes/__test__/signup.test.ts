import request from 'supertest';
import { app } from '../../app';

describe('Sign Up Test', () => {
  it('returns a 201 on successful signup', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
  });

  it('returns a 400 with an invalid email', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test',
        password: 'password',
      })
      .expect(400);
  });

  it('returns a 400 with an invalid password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'p',
      })
      .expect(400);
  });

  it('returns a 400 with an missing email and password', async () => {
    await request(app).post('/api/users/signup').send({}).expect(400);
  });

  it('disallows duplicate emails', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(400);
  });

  it('set a cookie after a succes signup ', async () => {
    const respone = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    expect(respone.get('Set-Cookie')).toBeDefined();
  });
});
