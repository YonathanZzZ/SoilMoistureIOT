import request from 'supertest';
import server from '../../src/index';
import { deleteUserByEmail } from '../../src/services/user.service';

const validEmail = 'test@test.com';
const strongPassword = 'bH84Ksf4k';
const REGISTER_ROUTE = '/users/register/password';
const LOGIN_ROUTE = '/users/login/password';

afterAll(() => {
  server.close();
});

describe('Test user login', () => {
  it('should login a user', async () => {
    const user = {
      email: validEmail,
      password: strongPassword,
    };

    await request(server)
      .post(REGISTER_ROUTE)
      .send(user).expect(201);

    await request(server).post(LOGIN_ROUTE).send(user).expect(200);

    await deleteUserByEmail(validEmail);
  });

  it('should not login a user with an incorrect password', async () => {
    const user = {
      email: validEmail,
      password: strongPassword,
    };

    await request(server)
      .post(REGISTER_ROUTE)
      .send(user).expect(201);

    await request(server).post(LOGIN_ROUTE).send({email: validEmail, password: "wrongPass"}).expect(401);

    await deleteUserByEmail(validEmail);
  });

  it('should not login a user with an incorrect email', async () => {
    const user = {
      email: validEmail,
      password: strongPassword,
    };

    await request(server)
      .post(REGISTER_ROUTE)
      .send(user).expect(201);

    await request(server).post(LOGIN_ROUTE).send({email: "wrongEmail", password: strongPassword}).expect(401);

    await deleteUserByEmail(validEmail);
  });
});
