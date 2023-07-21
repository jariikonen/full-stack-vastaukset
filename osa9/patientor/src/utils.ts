import { Patient, Gender } from "./types";

export const defaultPatient: Patient = {
  id: "default-id",
  name: "default patient",
  occupation: "default occupation",
  gender: Gender.Other,
  ssn: "default-ssn",
  dateOfBirth: "0000-00-00",
  entries: [],
};

// Helper function for exhaustive type checking
export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
