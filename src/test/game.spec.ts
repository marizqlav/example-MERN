import request from "supertest";

// local imports
import app from "../app";
import { clearDatabase, closeDatabase, connect } from "./utils/db";

describe("Testing CRUD method", () => {
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
    const response = await request(app).get("/api/games/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("Should create a new game", async () => {
    await request(app).post("/api/auth/signup/").send({
      name: "adminssas1",
      username: "admin12",
      lastName: "admin222",
      rol: "admin",
      email: "admin222@gmail.com",
      phone: "675565630",
      password: "Ss3@3",
    });

    const response = await request(app).post("/api/auth/signin/").send({
      username: "admin12",
      password: "Ss3@3",
    });

    const newGame = {
      name: "New Game",
      description: "This is a new game",
      genre: "Aventura",
    };
    const response2 = await request(app)
      .post("/api/games/")
      .set("Authorization", response.body.token)
      .send(newGame);
    expect(response2.status).toBe(201);
    expect(response2.body.name).toBe(newGame.name);
  });
});
