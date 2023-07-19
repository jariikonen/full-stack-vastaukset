import { Box, Typography } from "@mui/material";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { Patient, Gender } from "../../types";

interface Props {
  patient: Patient;
}

const PatientData = ({ patient }: Props) => {

  const renderGender = (gender: Gender) => {
    switch (gender) {
      case Gender.Female:
        return <FemaleIcon />;
      case Gender.Male:
        return <MaleIcon />;
      case Gender.Other:
        return <TransgenderIcon />;
    }
  }

  return (
    <Box style={{ marginTop: "2.5rem", marginBottom: "2rem" }}>
      <Typography align="left" variant="h4">
          {patient.name} {renderGender(patient.gender)}
      </Typography>
      <Typography align="left" variant="body1" style={{ marginTop: "1.5rem" }}>
          ssn: {patient.ssn}
      </Typography>
      <Typography align="left" variant="body1" style={{ marginTop: 0 }}>
          occupation: {patient.occupation}
      </Typography>
    </Box>
  );
};

export default PatientData;
