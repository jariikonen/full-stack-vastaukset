import express from "express";
import cors from "cors";
import diaryRouter from "./routes/diaries";

const app = express();

app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diaries", diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
