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
