import fs from "node:fs";
import { parse } from "csv-parse";
import { DataSource } from "typeorm";
import { Movie } from "./entities/Movie";

export class CsvFormatError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "CsvFormatError";
  }
}

const REQUIRED = ["year", "title", "studios", "producers", "winner"] as const;

export async function importCsv(
  filePath: string,
  ds: DataSource
): Promise<void> {
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ columns: true, trim: true, delimiter: ";" }));

  let rowCount = 0;

  for await (const rec of parser) {
    // ── valida cabeçalho logo na 1ª iteração
    if (rowCount === 0) {
      const missing = REQUIRED.filter((c) => !(c in rec));
      if (missing.length) {
        throw new CsvFormatError(
          `Colunas ausentes no CSV: ${missing.join(", ")}`
        );
      }
    }

    // winner pode ser vazio, demais não.
    for (const k of ["year", "title", "studios", "producers"] as const) {
      if (!rec[k] || `${rec[k]}`.trim() === "") {
        throw new CsvFormatError(
          `Campo obrigatório vazio (“${k}”) na linha: ${JSON.stringify(rec)}`
        );
      }
    }

    await ds.manager.save(
      ds.manager.create(Movie, {
        year: +rec.year,
        title: rec.title,
        studios: rec.studios,
        producers: rec.producers,
        winner: (rec.winner || "").toLowerCase() === "yes",
      })
    );
    rowCount++;
  }

  if (rowCount === 0) {
    throw new CsvFormatError(
      "CSV inválido – nenhuma linha de dados encontrada."
    );
  }
}
