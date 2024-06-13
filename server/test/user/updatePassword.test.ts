import request from "supertest";
import server from "../../src/index";
import { deleteUserByEmail } from "../../src/services/user.service";

const validEmail = "test@test.com";
const strongPassword = "bH84Ksf4k";

const user = { email: validEmail, password: strongPassword };

afterAll(() => {
  server.close();
});

describe("Test password update", () => {
  it("should login with updated password", async () => {
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
      .patch("/users/password")
      .set("Cookie", userCookie)
      .send({ oldPassword: strongPassword, newPassword: strongPassword + 1 })
      .expect(200); // Include the session cookie in the request\


    //login with new password
    await request(server)
      .post("/users/login/password")
      .send({email: validEmail, password: strongPassword + 1})
      .expect(200);

    await deleteUserByEmail(validEmail);
  });

  it("should not login with old password", async () => {
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

    // Delete the user
    await request(server)
      .patch("/users/password")
      .set("Cookie", userCookie)
      .send({ oldPassword: strongPassword, newPassword: strongPassword + 1 })
      .expect(200); // Include the session cookie in the request\


    //login with new password
    await request(server)
      .post("/users/login/password")
      .send({email: validEmail, password: strongPassword})
      .expect(401);

    await deleteUserByEmail(validEmail);
  });

  it("should not update password with incorrect old password", async () => {
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

    // Delete the user
    await request(server)
      .patch("/users/password")
      .set("Cookie", userCookie)
      .send({ oldPassword: "wrongOldPassword", newPassword: strongPassword + 1 })
      .expect(400); // Include the session cookie in the request\

    await deleteUserByEmail(validEmail);
  });

  it("should not update password with weak new password", async () => {
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

    // Delete the user
    await request(server)
      .patch("/users/password")
      .set("Cookie", userCookie)
      .send({ oldPassword: strongPassword, newPassword: "weakPassword" })
      .expect(400); // Include the session cookie in the request\

    await deleteUserByEmail(validEmail);
  });
});
