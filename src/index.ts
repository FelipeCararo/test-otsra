import fs from "node:fs";
import { parse } from "csv-parse";
import { AppDataSource } from "./db";
import { Movie } from "./entities/Movie";
import { createApp } from "./app";

await AppDataSource.initialize();

// 1. importação do CSV → banco de dados
const parser = fs.createReadStream("csv/Movielist.csv").pipe(
  parse({
    columns: true,
    trim: true,
    delimiter: ";", // CSV usa ponto‑e‑vírgula
  })
);

for await (const record of parser) {
  const movie = new Movie();
  movie.year = +record.year;
  movie.title = record.title;
  movie.producers = record.producers;
  movie.winner = record.winner.toLowerCase() === "yes";
  await AppDataSource.manager.save(movie);
}

// 2. inicia o servidor HTTP
const port = process.env.PORT ?? 3000;
createApp().listen(port, () => {
  console.log(`API escutando em http://localhost:${port}`);
});
