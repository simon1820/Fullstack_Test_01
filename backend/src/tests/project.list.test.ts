import request from "supertest";
import app from "../app";
import { getToken } from "./testUtils";

describe("Projects - List", () => {
  it("should return the list of projects", async () => {
    const token = await getToken();

    const res = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
