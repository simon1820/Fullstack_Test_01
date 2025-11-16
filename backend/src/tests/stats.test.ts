import request from "supertest";
import app from "../app";
import { getToken } from "./testUtils";

describe("Stats - Dashboard", () => {
  it("should return user statistics", async () => {
    const token = await getToken();

    const res = await request(app)
      .get("/api/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalProjects");
    expect(res.body).toHaveProperty("totalTasks");
  });
});
