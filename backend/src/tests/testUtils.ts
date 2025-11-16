import request from "supertest";
import app from "../app";

export async function getToken() {
  const login = await request(app)
    .post("/api/auth/login")
    .send({
      email: "test_register@mail.com",
      password: "123456",
    });

  return login.body.token;
}
