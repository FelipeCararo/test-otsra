import { Router } from "express";
import { movieRepository } from "../repositories/movie.repository";

export const movieRouter = Router();

movieRouter.get("/", async (_, res) => {
  const movies = await movieRepository().find();
  res.json(movies);
});

movieRouter.get("/:id", async (req, res) => {
  const movie = await movieRepository().findOneBy({ id: +req.params.id });
  if (!movie) return res.sendStatus(404);
  res.json(movie);
});
