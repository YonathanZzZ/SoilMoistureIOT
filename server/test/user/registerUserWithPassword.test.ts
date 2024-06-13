import request from "supertest";
import server from "../../src/index";
import { deleteUserByEmail } from "../../src/services/user.service";

const validEmail = "test@test.com";
const strongPassword = "bH84Ksf4k";
const invalidEmail = "notAn@email";
const weakPassword = "weakPass";
const REGISTER_ROUTE = "/users/register/password";

afterAll(() => {
  server.close();
});

describe("Test user registration", () => {
  it("should register a user", async () => {
    const user = {
      email: validEmail,
      password: strongPassword,
    };

    await request(server).post(REGISTER_ROUTE).send(user).expect(201);

    await deleteUserByEmail(validEmail);
  });

  it("should not register a user that already exists", async () => {
    const user = {
      email: validEmail,
      password: strongPassword,
    };

    await request(server).post(REGISTER_ROUTE).send(user).expect(201);

    const res = await request(server)
      .post(REGISTER_ROUTE)
      .send(user)
      .expect(409);

    await deleteUserByEmail(validEmail);
  });

  it("should not register a user without an email", async () => {
    const user = {
      password: strongPassword,
    };

    const res = await request(server)
      .post(REGISTER_ROUTE)
      .send(user)
      .expect(400);
  });

  it("should not register a user without a password", async () => {
    const user = {
      email: validEmail,
    };

    const res = await request(server)
      .post(REGISTER_ROUTE)
      .send(user)
      .expect(400);
  });

  it("should not register a user with an invalid email", async () => {
    const user = {
      email: invalidEmail,
      password: strongPassword,
    };

    const res = await request(server)
      .post(REGISTER_ROUTE)
      .send(user)
      .expect(400);
  });

  it("should not register a user with a weak password", async () => {
    const user = {
      email: validEmail,
      password: weakPassword,
    };

    const res = await request(server)
      .post(REGISTER_ROUTE)
      .send(user)
      .expect(400);
  });
});
