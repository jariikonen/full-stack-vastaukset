import express from "express";
import diagnosisService from "../services/diagnosis";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(diagnosisService.getEntries());
});

export default router;
