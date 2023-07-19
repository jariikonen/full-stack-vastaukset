import express from "express";
import patientService from "../services/patient";
import { toNewPatientEntry, toNewEntry } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get("/:id", (req, res) => {
  const { params } = req;

  const patientToReturn = patientService.findById(params.id);

  if (!patientToReturn) {
    return res.status(404).send({ error: "resource not found" });
  }

  return res.send(patientToReturn);
});

router.post("/", (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedEntry = patientService.addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post("/:id/entries", (req, res) => {
  const { params } = req;

  try {
    const newEntry = toNewEntry(req.body);
    const returnedEntry = patientService.addEntry(params.id, newEntry);
    return res.json(returnedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
      switch (error.message) {
        case "Patient not found":
          return res.status(404).send(errorMessage);
        case "Internal server error":
          return res.status(500).send(errorMessage);
      }
    }
    return res.status(400).send(errorMessage);
  }
});

export default router;
