import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { Patient, Gender, DiagnosisEntry } from "../../types";
import { defaultPatient } from "../../utils";
import patientService from "../../services/patients";
import diagnosesService from "../../services/diagnoses";
import EntryList from "./EntryList";

interface Props {
  patientId: string;
}

const PatientData = ({ patientId }: Props) => {
  const [patient, setPatient] = useState<Patient>(defaultPatient);
  const [diagnoses, setDiagnoses] = useState<DiagnosisEntry[]>([]);

  useEffect(() => {
    const fetchPatient = async (id: string) => {
      const patient = await patientService.getPatient(id);
      console.log(patient);
      setPatient(patient);
    };
    void fetchPatient(patientId);
  }, [patientId]);

  useEffect(() => {
    const fetchDiagnosisDescriptions = async () => {
      const diagnoses = await diagnosesService.getAll();
      setDiagnoses(diagnoses);
    };
    fetchDiagnosisDescriptions();
  }, []);

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

      <EntryList entries={patient.entries} diagnoses={diagnoses} />
    </Box>
);
};

export default PatientData;
