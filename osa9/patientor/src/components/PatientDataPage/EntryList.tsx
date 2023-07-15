import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { DiagnosisEntry, Entry as EntryType } from "../../types";

const Item = styled("div")(({ theme }) => ({
  ...theme.typography.body1,
  paddingTop: 5,
  paddingBottom: 5,
  textAlign: "left",
  color: theme.palette.text.primary,
}));

interface EntryProps {
  entry: EntryType;
  diagnoses: DiagnosisEntry[];
}

const Entry = ({ entry, diagnoses }: EntryProps) => {
  const getDescription = (code: DiagnosisEntry["code"]) => {
    if (diagnoses) {
      const diagnosisEntry = diagnoses.filter((d: DiagnosisEntry) => d.code === code)[0];
      if (diagnosisEntry && typeof diagnosisEntry === "object" && "code" in diagnosisEntry) {
        return ` ${diagnosisEntry.name}`;
      }
    }
    return "";
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container rowSpacing={{ xs: 1 }} columnSpacing={{ xs: 0 }}>
        <Grid item xs={2}>
          <Item style={{ fontWeight: "bold" }}>
            {entry.date}:
          </Item>
        </Grid>
        <Grid item xs={10}>
          <Item>
            <Typography align="left" style={{ fontStyle: "italic" }}>
              {entry.description}
            </Typography>
          </Item>
        </Grid>
        {entry.diagnosisCodes && (
          <>
            <Grid item xs={2}>
              <Item>
              </Item>
            </Grid>
            <Grid item xs={10}>
              <Item>
                <List>
                  {entry.diagnosisCodes.map((code) => (
                    <ListItem key={code} disablePadding>
                      <ListItemText primary={`${code}${getDescription(code)}`} />
                    </ListItem>
                  ))}
                </List>
              </Item>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
};

interface EntryListProps {
  entries: EntryType[];
  diagnoses: DiagnosisEntry[];
}

const EntryList = ({ entries, diagnoses }: EntryListProps) => {
  if (entries) {
    return (
      <Box style={{ marginTop: 20 }}>
        {entries.map((entry) => (
          <Entry key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))}
      </Box>
    );
  }
  return null;
};

export default EntryList;
