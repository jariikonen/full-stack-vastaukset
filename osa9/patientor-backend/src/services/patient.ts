import patients from "../../data/patients";
import { v1 as uuid } from "uuid";
import {
  PatientEntry,
  NonSensitivePatientEntry,
  NewPatientEntry,
  NewEntry,
} from "../types";

const getEntries = (): PatientEntry[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findById = (id: string): PatientEntry => {
  return patients.filter((patient) => patient.id === id)[0];
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (patientId: string, entry: NewEntry): PatientEntry => {
  if (!patients.find((patient) => patient.id === patientId)) {
    throw new Error("Patient not found");
  }

  const newEntry = {
    id: uuid(),
    ...entry,
  };

  patients.forEach((p) => {
    if (p.id === patientId) {
      p.entries ? p.entries.push(newEntry) : (p.entries = [newEntry]);
    }
  });

  const updatedPatientEntry = patients.find((p) => p.id === patientId);
  if (!updatedPatientEntry) {
    throw new Error("Internal server error");
  }

  return updatedPatientEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  findById,
  addPatient,
  addEntry,
};
