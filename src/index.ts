import { AppDataSource } from "./db";
import { createApp } from "./app";
import { importCsv, CsvFormatError } from "./csv-importer";

let csvProblem: CsvFormatError | null = null;

(async () => {
  try {
    await AppDataSource.initialize();
    await importCsv("csv/Movielist.csv", AppDataSource);
  } catch (err) {
    if (err instanceof CsvFormatError) {
      csvProblem = err;
      console.error("Erro no CSV:", err.message);
    } else {
      console.error(err);
      process.exit(1);
    }
  }

  const port = process.env.PORT ?? 3000;
  createApp(csvProblem).listen(port, () =>
    console.log(`API escutando em http://localhost:${port}`)
  );
})();
