import request from "supertest";
import server from "../../src/index";
import { deleteUserByEmail } from "../../src/services/user.service";

const validEmail = "test@test.com";
const newEmail = "new@new.com";
const strongPassword = "bH84Ksf4k";

const user = { email: validEmail, password: strongPassword };

afterAll(() => {
  server.close();
});

describe("Test email update", () => {
  it("should login with updated email", async () => {
    // Register the user
    await request(server)
      .post("/users/register/password")
      .send(user)
      .expect(201);

    // Login the user
    const loginRes = await request(server)
      .post("/users/login/password")
      .send(user)
      .expect(200);

    const userCookie = loginRes.headers["set-cookie"];

    await request(server)
      .patch("/users/email")
      .set("Cookie", userCookie)
      .send({ email: newEmail })
      .expect(200); // Include the session cookie in the request\

    //login with new email
    await request(server)
      .post("/users/login/password")
      .send({ email: newEmail, password: strongPassword })
      .expect(200);

    await deleteUserByEmail(newEmail);
  });

  it("should not update email with a used email", async () => {
    // Register the user
    const anotherEmail = "another@test.com";
    
    await request(server)
      .post("/users/register/password")
      .send(user)
      .expect(201);

    //register another user
    await request(server)
      .post("/users/register/password")
      .send({ email: anotherEmail, password: strongPassword })
      .expect(201);

    // Login the user
    const loginRes = await request(server)
      .post("/users/login/password")
      .send(user)
      .expect(200);

    const userCookie = loginRes.headers["set-cookie"];

    await request(server)
      .patch("/users/email")
      .set("Cookie", userCookie)
      .send({ email: anotherEmail })
      .expect(409); // Include the session cookie in the request\

    await deleteUserByEmail(validEmail);
    await deleteUserByEmail(anotherEmail);
  });
});
