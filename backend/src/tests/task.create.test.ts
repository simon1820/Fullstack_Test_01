import request from "supertest";
import app from "../app";
import { getToken } from "./testUtils";

describe("Projects - Create", () => {
  it("should create a new project", async () => {
    const token = await getToken();

    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Project",
        description: "Project created via test",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});
