import { Repository } from "typeorm";
import { Movie } from "../entities/Movie";
import { AppDataSource } from "../db";

export const movieRepository = (): Repository<Movie> =>
  AppDataSource.getRepository(Movie);
