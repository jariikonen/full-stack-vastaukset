import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { Entry as EntryType } from "../../types";

const Item = styled("div")(({ theme }) => ({
  ...theme.typography.body1,
  paddingTop: 5,
  paddingBottom: 5,
  textAlign: "left",
  color: theme.palette.text.primary,
}));

interface EntryProps {
  entry: EntryType;
}

const Entry = ({ entry }: EntryProps) => (
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
              {entry.diagnosisCodes.join(", ")}
            </Item>
          </Grid>
        </>
      )}
    </Grid>
  </Box>
);

interface EntryListProps {
  entries: EntryType[];
}

const EntryList = ({ entries }: EntryListProps) => {
  if (entries) {
    return (
      <Box style={{ marginTop: 20 }}>
        {entries.map((entry) => (
          <Entry key={entry.id} entry={entry} />
        ))}
      </Box>
    );
  }
  return null;
};

export default EntryList;
