import { importCsv, CsvFormatError } from "../src/csv-importer";
import { AppDataSource } from "../src/db";
import { createApp } from "../src/app";
import request from "supertest";

describe("CSV válido", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await importCsv("csv/Movielist.csv", AppDataSource);
  });
  afterAll(() => AppDataSource.destroy());

  it("Deve retornar os dados da API baseado no CSV correto com sucesso", async () => {
    const res = await request(createApp()).get("/producers/intervals");
    expect(res.status).toBe(200);
  });
});

describe("CSV inválido (coluna ausente)", () => {
  let csvErr!: CsvFormatError;

  beforeAll(async () => {
    await AppDataSource.initialize();
    await expect(
      importCsv("csv/Movielist-fail.csv", AppDataSource)
    ).rejects.toThrow(CsvFormatError);
    try {
      await importCsv("csv/Movielist-fail.csv", AppDataSource);
    } catch (e) {
      csvErr = e as CsvFormatError;
    }
  });
  afterAll(() => AppDataSource.destroy());

  it("Deve retornar erro 500 com mensagem", async () => {
    const res = await request(createApp(csvErr)).get("/producers/intervals");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: csvErr.message });
  });
});
