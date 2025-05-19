import { Router } from "express";
import { calculateIntervals } from "../services/interval.service";

export const producerRouter = Router();

producerRouter.get("/intervals", async (_, res) => {
  const response = await calculateIntervals();
  res.json(response);
});
