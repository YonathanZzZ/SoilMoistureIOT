import request from 'supertest';
import server from '../../src/index';

const validEmail = 'test@test.com';
const strongPassword = 'bH84Ksf4k';

const user = {email: validEmail, password: strongPassword};

afterAll(() => {
  server.close();
});

describe('Test user deletion', () => {
    it('should delete a user', async () => {
      // Register the user
      await request(server)
        .post('/users/register/password')
        .send(user).expect(201);
  
      // Login the user
      const loginRes = await request(server)
        .post('/users/login/password')
        .send(user).expect(200);
  
      const userCookie = loginRes.headers['set-cookie'];
  
      // Delete the user
      const deleteRes = await request(server)
        .delete('/users')
        .set('Cookie', userCookie).expect(200); // Include the session cookie in the request\
    });
  });
