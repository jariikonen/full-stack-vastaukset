import { useEffect, useState } from "react";
import { Patient, DiagnosisEntry } from "../../types";
import { defaultPatient } from "../../utils";
import patientService from "../../services/patients";
import diagnosesService from "../../services/diagnoses";
import PatientData from "./PatientData";
import EntryList from "./EntryList";
import EntryForm from "./EntryForm";

interface Props {
  patient: Patient | null | undefined;
}

const PatientDataPage = ({ patient }: Props) => {
  const [patientObj, setPatientObj] = useState<Patient>(defaultPatient);
  const [diagnoses, setDiagnoses] = useState<DiagnosisEntry[]>([]);

  useEffect(() => {
    const fetchPatient = async (id: string) => {
      const fetchedPatient = await patientService.getPatient(id);
      console.log(fetchedPatient);
      setPatientObj(fetchedPatient);
    };
    if (patient) {
      void fetchPatient(patient.id);
    }
  }, [patient]);

  useEffect(() => {
    const fetchDiagnosisDescriptions = async () => {
      const fetchedDiagnoses = await diagnosesService.getAll();
      setDiagnoses(fetchedDiagnoses);
    };
    fetchDiagnosisDescriptions();
  }, []);

  if (patient) {
    return (
      <>
        <PatientData patient={patientObj} />
        <EntryForm patient={patientObj} setPatient={setPatientObj} />
        <EntryList entries={patientObj.entries} diagnoses={diagnoses} />
      </>
    );
  }
  return null;
};

export default PatientDataPage;
