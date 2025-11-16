import request from "supertest";
import app from "../app";

describe("Auth - Login", () => {
  it("should login and return a token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: process.env.TEST_EMAIL || "test_register@mail.com",
        password: "123456",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
