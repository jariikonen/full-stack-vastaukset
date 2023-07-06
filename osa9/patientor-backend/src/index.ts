import express from "express";
import cors from "cors";

import pingRouter from "./routes/ping";
import diagnosisRouter from "./routes/diagnosis";

const app = express();

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.use("/api/ping", pingRouter);
app.use("/api/diagnoses", diagnosisRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
