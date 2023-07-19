import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Stack, Typography } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import {
  DiagnosisEntry as DiagnosisType,
  Entry as EntryType,
  HealthCheckEntry as HealthCheckType,
  OccupationalHealthcareEntry as OccupationalType,
  HospitalEntry as HospitalType,
} from "../../types";
import HealthRatingBar from "../HealthRatingBar";

const Item = styled("div")(({ theme }) => ({
  ...theme.typography.body1,
  paddingTop: 2,
  paddingBottom: 2,
  marginTop: 0,
  marginBottom: 0,
  textAlign: "left",
  color: theme.palette.text.primary,
}));

const DescriptionItem = styled("div")(({ theme }) => ({
  ...theme.typography.body2,
  paddingTop: 2,
  paddingBottom: 2,
  marginTop: 0,
  marginBottom: 10,
  textAlign: "left",
  color: theme.palette.text.primary,
  fontStyle: "italic",
  fontSize: "1.1em",
}));

const dash = String.fromCodePoint(8211);

const getDescription = (code: DiagnosisType["code"], diagnoses: DiagnosisType[]) => {
  if (code && diagnoses) {
    const diagnosisEntry = diagnoses.filter((d: DiagnosisType) => d.code === code)[0];
    if (diagnosisEntry && typeof diagnosisEntry === "object" && "code" in diagnosisEntry) {
      return ` ${dash} ${diagnosisEntry.name}`;
    }
  }
  return "";
};

interface DiagnosisListProps {
  diagnosisCodes: EntryType["diagnosisCodes"];
  diagnoses: DiagnosisType[];
}

const DiagnosisList = ({ diagnosisCodes, diagnoses }: DiagnosisListProps) => (
  <>
    {diagnosisCodes && (
      <List>
        {diagnosisCodes.map((code) => (
          <ListItem key={code} disablePadding>
            <ListItemText
              sx={{ fontSize: "0.5" }}
              primary={`${code}${getDescription(code, diagnoses)}`}
            />
          </ListItem>
        ))}
      </List>
    )}
  </>
);

interface HealthCheckEntryProps {
  entry: HealthCheckType;
  diagnoses: DiagnosisType[];
}

const HealthCheckEntry = ({ entry, diagnoses }: HealthCheckEntryProps) => (
  <>
    <Grid item xs={2} id={entry.id}>
      <Stack direction="row" spacing={1}>
        <MonitorHeartIcon />
        <Item style={{ fontWeight: "bold" }}>
          {entry.date}:
        </Item>
      </Stack>
    </Grid>
    <Grid item xs={10}>
      <DescriptionItem>
        {entry.description}
      </DescriptionItem>
      <Item>
        <HealthRatingBar rating={entry.healthCheckRating} showText={true} />
      </Item>
      <Item>
        <DiagnosisList diagnosisCodes={entry.diagnosisCodes} diagnoses={diagnoses} />
      </Item>
      <Item>
        Specialist: {entry.specialist}
      </Item>
    </Grid>
  </>
);

interface OccupationalHealthcareEntryProps {
  entry: OccupationalType;
  diagnoses: DiagnosisType[];
}

const OccupationalHealthcareEntry = ({ entry, diagnoses }: OccupationalHealthcareEntryProps) => (
  <>
    <Grid item xs={2} id={entry.id}>
      <Stack direction="row" spacing={1}>
        <HomeRepairServiceIcon />
        <Item style={{ fontWeight: "bold" }}>
          {entry.date}:
        </Item>
      </Stack>
    </Grid>
    <Grid item xs={10}>
      <DescriptionItem>
        {entry.description}
      </DescriptionItem>
      {entry.sickLeave &&
        <Item>
          Sick leave from {entry.sickLeave?.startDate} to {entry.sickLeave?.endDate}
        </Item>
      }
      <Item>
        <DiagnosisList diagnosisCodes={entry.diagnosisCodes} diagnoses={diagnoses} />
      </Item>
      <Item>
        Employer: {entry.employerName}
      </Item>
      <Item>
        Specialist: {entry.specialist}
      </Item>
    </Grid>
  </>
);

interface HospitalEntryProps {
  entry: HospitalType;
  diagnoses: DiagnosisType[];
}

const HospitalEntry = ({ entry, diagnoses }: HospitalEntryProps) => (
  <>
    <Grid item xs={2} id={entry.id}>
      <Stack direction="row" spacing={1}>
        <LocalHospitalIcon />
        <Item style={{ fontWeight: "bold" }}>
          {entry.date}:
        </Item>
      </Stack>
    </Grid>
    <Grid item xs={10}>
      <DescriptionItem>
        {entry.description}
      </DescriptionItem>
      <Item>
        Discharge: {entry.discharge.date}; Criteria: {entry.discharge.criteria}
      </Item>
      <DiagnosisList diagnosisCodes={entry.diagnosisCodes} diagnoses={diagnoses} />
      <Item>
        Specialist: {entry.specialist}
      </Item>
    </Grid>
  </>
);

interface EntryProps {
  entry: EntryType;
  diagnoses: DiagnosisType[];
}

// Helper function for exhaustive type checking
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Entry = ({ entry, diagnoses }: EntryProps) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckEntry entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntry entry={entry} diagnoses={diagnoses} />;
    case "Hospital":
      return <HospitalEntry entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

interface EntryListProps {
  entries: EntryType[];
  diagnoses: DiagnosisType[];
}

const EntryList = ({ entries, diagnoses }: EntryListProps) => {
  if (entries) {
    return (
      <Box sx={{ flexGrow: 1 }} style={{ marginTop: "3rem", marginBottom: "2rem" }}>
        <Typography align="left" variant="h5" style={{ marginBottom: "1.5rem" }}>
          Entries
        </Typography>
        <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 0 }}>
          {entries.map((entry) => (
            <Entry key={entry.id} entry={entry} diagnoses={diagnoses} />
          ))}
        </Grid>
      </Box>
    );
  }
  return null;
};

export default EntryList;
