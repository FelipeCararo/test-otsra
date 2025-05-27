import express, { Request, Response } from "express";
import { movieRouter } from "./routes/movie.routes";
import { producerRouter } from "./routes/producer.routes";
import { CsvFormatError } from "./csv-importer";

export function createApp(csvError: CsvFormatError | null = null) {
  const app = express();
  app.use(express.json());

  if (csvError) {
    app.use((_req: Request, res: Response) =>
      res.status(500).json({ error: csvError.message })
    );
    return app;
  }

  app.use("/movies", movieRouter);
  app.use("/producers", producerRouter);
  app.get("/health", (_, res) => res.send("OK"));
  app.use((_req, res) => res.sendStatus(404));

  return app;
}
