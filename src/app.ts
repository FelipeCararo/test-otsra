import express from "express";
import { movieRouter } from "./routes/movie.routes";
import { producerRouter } from "./routes/producer.routes";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use("/movies", movieRouter);
  app.use("/producers", producerRouter);

  // healthcheck
  app.get("/health", (_, res) => res.send("OK"));
  return app;
}
