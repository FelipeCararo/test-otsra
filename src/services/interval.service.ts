import { movieRepository } from "../repositories/movie.repository";

export interface IntervalDTO {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface IntervalResponse {
  min: IntervalDTO[];
  max: IntervalDTO[];
}

export async function calculateIntervals(): Promise<IntervalResponse> {
  const repo = movieRepository();
  const winners = await repo.find({ where: { winner: true } });

  // mapeia produtor → lista de anos em que venceu
  const map = new Map<string, number[]>();
  for (const w of winners) {
    w.producers.split(/,\s*| and /i).forEach((p) => {
      const list = map.get(p.trim()) ?? [];
      list.push(w.year);
      map.set(p.trim(), list);
    });
  }

  // calcula intervalos por produtor
  const intervals: IntervalDTO[] = [];
  for (const [producer, years] of map.entries()) {
    if (years.length < 2) continue;
    const sorted = years.sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      intervals.push({
        producer,
        interval: sorted[i] - sorted[i - 1],
        previousWin: sorted[i - 1],
        followingWin: sorted[i],
      });
    }
  }

  if (intervals.length === 0) return { min: [], max: [] };

  const minValue = Math.min(...intervals.map((i) => i.interval));
  const maxValue = Math.max(...intervals.map((i) => i.interval));

  return {
    min: intervals.filter((i) => i.interval === minValue),
    max: intervals.filter((i) => i.interval === maxValue),
  };
}
