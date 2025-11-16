import request from "supertest";
import app from "../app";
import { getToken } from "./testUtils";

describe("Project - Create", () => {
  it("should create a project", async () => {
    const token = await getToken();

    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Project",
        description: "Project created during tests"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});
