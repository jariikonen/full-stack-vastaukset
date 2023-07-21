import { useState, useRef, SyntheticEvent, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Stack,
  MenuItem,
  FormGroup,
  FormLabel,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  Rating,
} from "@mui/material";
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { isAxiosError } from "axios";
import ErrorComponent, { ErrorHandle } from "../Error";
import patientService from "../../services/patients";
import { BaseFormValues, DiagnosisEntry, EntryFormValues, HealthCheckFormValues, HospitalFormValues, OccupationalHealthcareFormValues, Patient } from "../../types";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  }
});

interface HealthCheckInputsProps {
  healthCheckRating: number;
  setHealthCheckRating: React.Dispatch<React.SetStateAction<number>>;
}

const HealthCheckInputs = ({ healthCheckRating, setHealthCheckRating }: HealthCheckInputsProps) => (
  <>
    <Grid item xs={12} style={{ paddingTop: "1.5rem", paddingBottom: "1rem" }}>
      <Stack direction="row" spacing={1}>
        <FormLabel style={{ paddingLeft: "0.8rem" }}>Health check rating:</FormLabel>
        <StyledRating
          max={4}
          icon={<Favorite fontSize="inherit" />}
          emptyIcon={<FavoriteBorder fontSize="inherit" />}
          value={4 - healthCheckRating}
          onChange={(_event, newValue) => {
            setHealthCheckRating(newValue ? Math.abs(newValue - 4) : 0);
          }}
        />
      </Stack>
    </Grid>
  </>
);

interface OccupationalHealthcareInputsProps {
  employerName: string;
  setEmployerName: React.Dispatch<React.SetStateAction<string>>;
  sickLeaveStart: dayjs.Dayjs;
  setSickLeaveStart: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  sickLeaveEnd: dayjs.Dayjs | null;
  setSickLeaveEnd: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
}

const OccupationalHealthcareInputs = ({
  employerName,
  setEmployerName,
  sickLeaveStart,
  setSickLeaveStart,
  sickLeaveEnd,
  setSickLeaveEnd,
}: OccupationalHealthcareInputsProps) => {
  const sickLeaveLength = sickLeaveEnd
    ? sickLeaveEnd.diff(sickLeaveStart, "day")
    : 0;
  return (
    <>
      <Grid item xs={12}>
        <TextField
          label="Employer name"
          fullWidth
          value={employerName}
          onChange={({ target }) => setEmployerName(target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <FormGroup>
          <Stack direction={{ xs: 'column' }} spacing={{ xs: "1rem" }}>
            <FormLabel style={{ marginTop: "0.2rem", marginBottom: "0rem" }}>Sick leave:</FormLabel>
            <Stack direction="row" spacing={1}>
              <DatePicker
                label="Start"
                value={sickLeaveStart}
                onChange={(newValue) => setSickLeaveStart(newValue as dayjs.Dayjs)}
              />
              <DatePicker
                label="End"
                value={sickLeaveEnd}
                onChange={(newValue) => setSickLeaveEnd(newValue as dayjs.Dayjs)}
              />
              <Button
                variant="outlined"
                type="button"
                onClick={() => setSickLeaveEnd(null)}
              >
                Clear
              </Button>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormLabel style={{ paddingLeft: "0.8rem", marginBottom: "1rem" }}>Sick leave length:</FormLabel>
              <Typography variant="body1" sx={{ color: "secondary" }}>
                {sickLeaveLength === 0 ? "No sick leave" : `${sickLeaveLength} days`}
              </Typography>
            </Stack>
          </Stack>
        </FormGroup>
      </Grid>
    </>
  )
};

interface HospitalInputsProps {
  dischargeDate: dayjs.Dayjs | null;
  setDischargeDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
  dischargeCriteria: string;
  setDischargeCriteria: React.Dispatch<React.SetStateAction<string>>;
}

const HospitalInputs = ({
  dischargeDate,
  setDischargeDate,
  dischargeCriteria,
  setDischargeCriteria
}: HospitalInputsProps) => (
  <Grid item xs={12}>
    <FormGroup>
      <Stack direction={{ xs: 'column' }} spacing={1} style={{ marginBottom: "0.5rem" }}>
        <FormLabel style={{ marginTop: "0.2rem", marginBottom: "0rem" }}>Discharge:</FormLabel>
        <Stack direction="row" spacing={1}>
          <DatePicker
            label="Discharge date"
            value={dischargeDate}
            onChange={(newValue) => setDischargeDate(newValue as dayjs.Dayjs)}
          />
          <Button
            variant="outlined"
            type="button"
            onClick={() => {
              setDischargeDate(null);
              setDischargeCriteria("");
            }}
          >
            Clear
          </Button>
        </Stack>
        {dischargeDate &&
          <TextField
            label="Discharge criteria"
            fullWidth
            value={dischargeCriteria}
            onChange={({ target }) => setDischargeCriteria(target.value)}
          />
        }
      </Stack>
    </FormGroup>
  </Grid>
);

interface EntryFormProps {
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient>>;
  diagnoses: DiagnosisEntry[];
}

const EntryForm = ({ patient, setPatient, diagnoses }: EntryFormProps) => {
  const currentDate = new Date().toJSON().slice(0, 10);

  const [type, setType] = useState<string>("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(dayjs(dayjs(currentDate)));
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const [healthCheckRating, setHealthCheckRating] = useState<number>(0);

  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState(dayjs(dayjs(currentDate)));
  const [sickLeaveEnd, setSickLeaveEnd] = useState<dayjs.Dayjs | null>(null);

  const [dischargeDate, setDischargeDate] = useState<dayjs.Dayjs | null>(null);
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const errorRef = useRef<ErrorHandle>(null);

  const [scrollToEntry, setScrollToEntry] = useState<string | null>(null);

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

  const composeNewEntry = (): EntryFormValues => {
    const baseEntry: BaseFormValues = {
      description,
      date: date.format("YYYY-MM-DD"),
      specialist,
      diagnosisCodes,
    };
    let newEntry = null;
    switch (type) {
      case "HealthCheck":
        newEntry = baseEntry as HealthCheckFormValues;
        newEntry.type = type;
        newEntry.healthCheckRating = healthCheckRating;
        return newEntry;
      case "OccupationalHealthcare":
        newEntry = baseEntry as OccupationalHealthcareFormValues;
        newEntry.type = type;
        newEntry.employerName = employerName;
        if (sickLeaveStart && sickLeaveEnd) {
          newEntry.sickLeave = {
            startDate: sickLeaveStart.format("YYYY-MM-DD"),
            endDate: sickLeaveEnd.format("YYYY-MM-DD"),
          };
        }
        return newEntry;
      case "Hospital":
        newEntry = baseEntry as HospitalFormValues;
        newEntry.type = "Hospital";
        if (dischargeDate && dischargeCriteria) {
          newEntry.discharge = {
            date: dischargeDate?.format("YYYY-MM-DD"),
            criteria: dischargeCriteria,
          };
        }
        return newEntry;
      default:
        throw new Error("Incorrect entry type " + type);
    }
  };

  const addEntry = async (event: SyntheticEvent) => {
    event.preventDefault();
    const newEntry = composeNewEntry();
    console.log("adding new entry", newEntry);
    try {
      const returnedEntry = await patientService.addEntry(newEntry, patient.id);
      clearForm();
      const updatedPatient = { ...patient };
      updatedPatient.entries.push(returnedEntry);
      setPatient(updatedPatient);
      console.log(returnedEntry.id);
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
    setType("HealthCheck");
    setDescription("");
    setDate(dayjs(currentDate));
    setSpecialist("");
    setDiagnosisCodes([]);
    setHealthCheckRating(0);
    setEmployerName("");
    setSickLeaveStart(dayjs(currentDate));
    setSickLeaveEnd(null);
    setDischargeDate(null);
    setDischargeCriteria("");
  };

  return (
    <Box sx={{ flexGrow: 1 }} style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <Typography align="left" variant="h5" style={{ marginBottom: "1rem" }}>
        Add new entry
      </Typography>
      <ErrorComponent message={errorMessage} ref={errorRef} />
      <form onSubmit={addEntry}>
        <Grid container rowSpacing={{ xs: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Entry type"
              select
              fullWidth
              value={type}
              onChange={({ target }) => setType(target.value)}
            >
              <MenuItem value={"HealthCheck"}>Health check</MenuItem>
              <MenuItem value={"OccupationalHealthcare"}>Occupational health care</MenuItem>
              <MenuItem value={"Hospital"}>Hospital</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => setSickLeaveEnd(newValue as dayjs.Dayjs)}
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
            <FormControl fullWidth>
              <InputLabel id="diagnosis-codes-label">Diagnosis codes</InputLabel>
              <Select
                labelId="diagnosis-codes-label"
                id="diagnosis-codes"
                multiple
                fullWidth
                value={diagnosisCodes}
                onChange={({ target: { value } }) => {
                  typeof value === "string"
                    ? setDiagnosisCodes(value.split(","))
                    : setDiagnosisCodes(value);
                }}
                input={<OutlinedInput label="Diagnosis codes" id="diagnosis-codes-select" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const chipLabel = value.split(",")[0];
                      return (
                        <Chip key={value} label={chipLabel} />
                      )
                    })}
                  </Box>
                )}
              >
                {diagnoses.map((d) => (
                  <MenuItem
                    key={d.code}
                    value={d.code}
                  >
                    {`${d.code}, ${d.name}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {type === "HealthCheck" &&
            <HealthCheckInputs
              healthCheckRating={healthCheckRating}
              setHealthCheckRating={setHealthCheckRating}
            />
          }
          {type === "OccupationalHealthcare" &&
            <OccupationalHealthcareInputs
              employerName={employerName}
              setEmployerName={setEmployerName}
              sickLeaveStart={sickLeaveStart}
              setSickLeaveStart={setSickLeaveStart}
              sickLeaveEnd={sickLeaveEnd}
              setSickLeaveEnd={setSickLeaveEnd}
            />
          }
          {type === "Hospital" &&
            <HospitalInputs
              dischargeDate={dischargeDate}
              setDischargeDate={setDischargeDate}
              dischargeCriteria={dischargeCriteria}
              setDischargeCriteria={setDischargeCriteria}
            />
          }
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
