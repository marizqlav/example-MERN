import request from "supertest";

// local imports
import app from "../app";
import { clearDatabase, closeDatabase, connect } from "./utils/db";

describe("Can get all the users", () => {
  beforeAll(async () => {
    await connect();
  });
  afterEach(async () => {
    await clearDatabase();
  });
  afterAll(async () => {
    await closeDatabase();
  });

  it("Should return all the users", async () => {
    const response = await request(app).get("/api/user/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
