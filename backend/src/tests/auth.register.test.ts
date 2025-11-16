import request from "supertest";
import app from "../app";

describe("Auth - Register", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "User Test",
        email: `user_${Date.now()}@mail.com`,
        password: "123456",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});
