import { Patient } from "../../types";
import PatientData from "./PatientData";

interface Props {
  patient: Patient | null | undefined;
}

const PatientDataPage = ({ patient }: Props) => {
  if (patient) {
    return (
      <PatientData patientId={patient.id} />
    );
  }
  return null;
};

export default PatientDataPage;
