import { useState, useRef, SyntheticEvent, useEffect } from "react";
import { Box, Typography, TextField, Grid, Button, Stack } from "@mui/material";
import { isAxiosError } from "axios";
import ErrorComponent, { ErrorHandle } from "../Error";
import patientService from "../../services/patients";
import { Patient } from "../../types";

interface EntryFormProps {
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient>>;
}

const EntryForm = ({ patient, setPatient }: EntryFormProps) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState("");
  const [diagnosisCodesStr, setDiagnosisCodesStr] = useState("");
  const [scrollToEntry, setScrollToEntry] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const errorRef = useRef<ErrorHandle>(null);

  useEffect(() => {
    if (errorMessage) {
      errorRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [errorMessage]);

  useEffect(() => {
    if (scrollToEntry) {
      const entry = document.getElementById(scrollToEntry);
      entry?.scrollIntoView({ behavior: "smooth" });
      setScrollToEntry(null);
    }
  }, [scrollToEntry]);

  const displayError = async (message: string, seconds=10) => {
    setErrorMessage(message);
    errorRef.current?.show(); // olisi voitu toteuttaa esim. ehdollisella renderöinnillä, mutta harjoituksen vuoksi näin
    setTimeout(() => {
      setErrorMessage(null);
      errorRef.current?.hide(); // olisi voitu toteuttaa esim. ehdollisella renderöinnillä, mutta harjoituksen vuoksi näin
    }, seconds * 1000);
  }

  const addEntry = async (event: SyntheticEvent) => {
    event.preventDefault();
    const diagnosisCodes = diagnosisCodesStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const newEntry = {
      description,
      date,
      specialist,
      healthCheckRating,
      diagnosisCodes,
      type: "HealthCheck",
    };
    console.log("adding new entry", newEntry);
    try {
      const returnedEntry = await patientService.addEntry(newEntry, patient.id);
      clearForm();
      const updatedPatient = { ...patient };
      updatedPatient.entries.push(returnedEntry);
      setPatient(updatedPatient);
      setScrollToEntry(returnedEntry.id);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.data && typeof error.response.data === "string") {
          const message = error.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          displayError(message);
        } else {
          console.error("Unrecognized axios error")
          displayError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", error);
        displayError("Unknown error");
      }
    }
  };

  const clearForm = () => {
    setDescription("");
    setDate("");
    setSpecialist("");
    setHealthCheckRating("");
    setDiagnosisCodesStr("");
  };

  return (
    <Box sx={{ flexGrow: 1 }} style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <Typography align="left" variant="h5" style={{ marginBottom: "1rem" }}>
        New health check entry
      </Typography>
      <ErrorComponent message={errorMessage} ref={errorRef} />
      <form onSubmit={addEntry}>
        <Grid container rowSpacing={{ xs: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Date"
              placeholder="YYYY-MM-DD"
              fullWidth
              value={date}
              onChange={({ target }) => setDate(target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Specialist"
              fullWidth
              value={specialist}
              onChange={({ target }) => setSpecialist(target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Health check rating"
              fullWidth
              value={healthCheckRating}
              onChange={({ target }) => setHealthCheckRating(target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Diagnosis codes"
              fullWidth
              value={diagnosisCodesStr}
              onChange={({ target }) => setDiagnosisCodesStr(target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <Button
                color="secondary"
                variant="contained"
                type="button"
                onClick={clearForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
              >
                Add
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default EntryForm;
