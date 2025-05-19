import request from "supertest";
import { createApp } from "../src/app";
import { AppDataSource } from "../src/db";
import { Movie } from "../src/entities/Movie";
import { calculateIntervals } from "../src/services/interval.service";

beforeAll(async () => {
  await AppDataSource.initialize();
  await AppDataSource.manager.save(
    AppDataSource.manager.create(Movie, [
      { year: 2000, title: "Foo", producers: "A", winner: true },
      { year: 2005, title: "Bar", producers: "A", winner: true },
      { year: 2001, title: "Baz", producers: "B", winner: true },
      { year: 2010, title: "Qux", producers: "B", winner: true },
    ])
  );
});

afterAll(() => AppDataSource.destroy());

const app = createApp();

describe("GET /producers/intervals", () => {
  it("deve retornar os intervalos mínimos e máximos corretos", async () => {
    const res = await request(app).get("/producers/intervals");
    expect(res.status).toBe(200);

    // serviço e rota devem concordar
    expect(res.body).toEqual(await calculateIntervals());
  });
});
