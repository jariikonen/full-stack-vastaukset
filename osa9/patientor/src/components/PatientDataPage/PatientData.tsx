import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { Patient, Gender } from "../../types";
import { defaultPatient } from "../../utils";
import patientService from "../../services/patients";

interface Props {
  patientId: string;
}

const PatientDataPage = ({ patientId }: Props) => {
  const [patient, setPatient] = useState<Patient>(defaultPatient);

  useEffect(() => {
    const fetchPatient = async (id: string) => {
      const patient = await patientService.getPatient(id);
      setPatient(patient);
    };
    void fetchPatient(patientId);
  }, [patientId]);

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
    <Box>
      <Typography align="left" variant="h4" style={{ marginTop: 20 }}>
          {patient.name} {renderGender(patient.gender)}
      </Typography>
      <Typography align="left" variant="body1" style={{ marginTop: 20 }}>
          ssn: {patient.ssn}
      </Typography>
      <Typography align="left" variant="body1" style={{ marginTop: 0 }}>
          occupation: {patient.occupation}
      </Typography>
    </Box>
);
};

export default PatientDataPage;
