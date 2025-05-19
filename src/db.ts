import "reflect-metadata";
import { DataSource } from "typeorm";
import { Movie } from "./entities/Movie";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  synchronize: true,
  entities: [Movie],
  logging: false,
});
